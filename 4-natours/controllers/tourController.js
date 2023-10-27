// const fs = require('fs');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// Check ID Middleware
// exports.checkID = (req, res, next, val) => {
//   console.log(`The tour id is: ${val}`);

//   const id = Number(req.params.id);

//   if (id > tours.length)
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });

//   next();
// };

// Check body Middleware
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

// exports.getAllTours = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// };

// exports.getTour = (req, res) => {
//   const id = Number(req.params.id);

//   const tour = tours.find((el) => el.id === id);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// };

// exports.updateTour = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<Updated tour here...>',
//     },
//   });
// };

// exports.createTour = (req, res) => {
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);

//   tours.push(newTour);

//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
// };

// exports.deleteTour = (req, res) => {
//   res.status(204).json({
//     status: 'success',
//     message: null,
//   });
// };

// Old Code based on static data ⬆

const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

exports.getAllTours = factory.getAll(Tour);
// 1A) Filtering
// const queryObj = { ...req.query };
// const excludedFiles = ['sort', 'page', 'limit', 'fields'];
// excludedFiles.forEach((el) => delete queryObj[el]);

// 1B) Advanced Filter
// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
// gte, gt, lte, lt

// Normal Way
// let query = Tour.find(JSON.parse(queryStr));

// 2) Sorting
// if (req.query.sort) {
//   query = query.sort(req.query.sort);
//   const sortBy = req.query.sort.split(',').join(' ');
//   query = query.sort(sortBy);
// sort('price ratingsAverage')
// } else {
//   query = query.sort('createdAt');
// }

// 3) Field Limiting
// if (req.query.fields) {
//   const fields = req.query.fields.split(',').join(' ');
//   query = query.select(fields);
// } else {
//   query = query.select('-__v');
// }

// 4) Pagination
// 1-10 Page1, 11-20 Page2, 21-30 Page3
// const page = Number(req.query.page) || 1;
// const limit = Number(req.query.limit) || 10;
// const skip = (page - 1) * limit;

// query = query.skip(skip).limit(limit);

// if (req.query.page) {
//   const numTours = await Tour.countDocuments();
//   if (skip >= numTours) {
//     throw new Error('This page does not exist');
//   }
// }

exports.getTour = factory.getOne(Tour, { path: 'reviews' });
// const tour = await Tour.findById(req.params.id).populate('reviews');
exports.updateTour = factory.updateOne(Tour);
exports.createTour = factory.createOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: null,
        // _id: '$difficulty',
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },

    { $sort: { avgPrice: 1 } },

    // { $match: { _id: { $ne: 'EASY' } } },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = Number(req.params.year);

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStats: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },

    { $project: { _id: 0 } },

    { $sort: { numTourStats: -1 } },

    // { $limit: 6 },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});
