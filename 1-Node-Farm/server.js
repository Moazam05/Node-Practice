const http = require("http");
const fs = require("fs");

const replaceTemplate = (temp, product) => {
	let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
	output = output.replace(/{%IMAGE%}/g, product.image);
	output = output.replace(/{%PRICE%}/g, product.price);
	output = output.replace(/{%FROM%}/g, product.from);
	output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
	output = output.replace(/{%QUANTITY%}/g, product.quantity);
	output = output.replace(/{%DESCRIPTION%}/g, product.description);
	output = output.replace(/{%ID%}/g, product.id);

	if (!product.organic)
		output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

	return output;
};

const tempOverview = fs.readFileSync(
	`${__dirname}/templates/template-overview.html`,
	"utf-8"
);
const tempCard = fs.readFileSync(
	`${__dirname}/templates/template-card.html`,
	"utf-8"
);
const tempProduct = fs.readFileSync(
	`${__dirname}/templates/template-product.html`,
	"utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
	const pathName = req.url;

	// Overview Page
	if (pathName === "/" || pathName === "/overview") {
		// res.end("This is the OVERVIEW");
		res.writeHead(200, { "Content-type": "text/html" });

		const cardHtml = dataObj
			.map((el) => replaceTemplate(tempCard, el))
			.join("");

		const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);

		res.end(output);

		// Product Page
	} else if (pathName === "/product") {
		res.end("This is the PRODUCT");

		// API Page
	} else if (pathName === "/api") {
		fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
			// const productData = JSON.parse(data);
			// console.log(productData);
			// res.writeHead(200, { "Content-type": "application/json" });
			res.end(data);
		});

		// Not found
	} else {
		res.end("Page not found!");
	}
});

server.listen(8000, "127.0.0.1", () => {
	console.log("Listening to requests on port 8000");
});
