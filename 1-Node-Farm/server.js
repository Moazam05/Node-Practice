const http = require("http");
const fs = require("fs");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

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
	const { query, pathname } = url.parse(req.url, true);

	// Overview Page
	if (pathname === "/" || pathname === "/overview") {
		// res.end("This is the OVERVIEW");

		res.writeHead(200, { "Content-type": "text/html" });

		const cardHtml = dataObj
			.map((el) => replaceTemplate(tempCard, el))
			.join("");
		const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);

		res.end(output);

		// Product Page
	} else if (pathname === "/product") {
		// res.end("This is the PRODUCT");

		res.writeHead(200, { "Content-type": "text/html" });

		const product = dataObj[query.id];
		const output = replaceTemplate(tempProduct, product);

		res.end(output);

		// API Page
	} else if (pathname === "/api") {
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
