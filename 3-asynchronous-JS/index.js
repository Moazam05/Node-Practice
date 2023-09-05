const fs = require('fs');
const superagent = require('superagent');

// Callback Hell
// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`Breed: ${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err, res) => {
//       if (err) return console.log(err.message);

//       console.log(res.body.message);

//       fs.writeFile('dog-img.txt', res.body.message, (err) => {
//         if (err) return console.log(err.message);

//         console.log('Random dog image saved to file!');
//       });
//     });
// });

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('I could not find that file 😥');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('Could not write file 😥');

      resolve('success');
    });
  });
};

// Callback convert into Promises
// readFilePro(`${__dirname}/dog.txt`)
//   .then((data) => {
//     console.log(`Bread: ${data}`);

//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);

//     return writeFilePro('dog-img.txt', res.body.message);
//   })
//   .then(() => {
//     console.log('Random dog image saved to file!');
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// Async Await
const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Bread: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    console.log(res.body.message);

    await writeFilePro('dog-img.txt', res.body.message);

    console.log('Random dog image saved to file!');
  } catch (error) {
    console.log(error);

    throw Error;
  }

  return '2: Ready 🐶';
};

// Better Way
(async () => {
  try {
    console.log('1: Will get dog pic!');
    const x = await getDogPic();
    console.log(x);
    console.log('3: Dog pics ready');
  } catch (error) {
    console.log('Error 💥');
  }
})();

// Not Better way
// console.log('1: Will get dog pic!');
// getDogPic()
//   .then((x) => {
//     console.log(x);
//     console.log('3: Dog pics ready');
//   })
//   .catch((err) => {
//     console.log('Error 💥');
//   });
