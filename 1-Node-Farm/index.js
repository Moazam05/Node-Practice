const fs = require("fs");

console.log("======= Blocking, synchronous way =======");
// Blocking, synchronous way

const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;

fs.writeFileSync("./txt/output.txt", textOut);
console.log("File Written!");

console.log("======= Non-Blocking, asynchronous way =======");
// Non-Blocking, asynchronous way

fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
	if (err) return console.log("Error 💥");
	// console.log(data1);
	fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
		console.log(data2);
		fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
			console.log(data3);

			// Write File
			fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
				console.log("Your file has been written 😊");
			});
		});
	});
});

console.log("Will Read File!");
