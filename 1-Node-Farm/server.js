const http = require("http");

const server = http.createServer((req, res) => {
	const pathName = req.url;

	if (pathName === "/" || pathName === "/overview") {
		res.end("This is the OVERVIEW");
	} else if (pathName === "/product") {
		res.end("This is the PRODUCT");
	} else {
		res.end("Page not found!");
	}
});

server.listen(8000, "127.0.0.1", () => {
	console.log("Listening to requests on port 8000");
});
