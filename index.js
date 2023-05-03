const fs = require("fs");
const http = require("http");
const url = require("url");
const templateReplace = require("./modules/templateReplace");
const slugify = require("slugify");

// FILES

// ! Blocking, synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!");

// ! Non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR! 💥");

//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written 😁");
//       });
//     });
//   });
// });
// console.log("Will read file!");

// ! server

const tempOverview = fs.readFileSync(
  "./templates/template-overview.html",
  "utf-8"
);
const tempCard = fs.readFileSync("./templates/template-card.html", "utf-8");
const tempProduct = fs.readFileSync(
  "./templates/template-product.html",
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => templateReplace(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const product = dataObj[query.id];
    const output = templateReplace(tempProduct, product);
    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-header": "hello-world",
    });
    res.end("<h1>404</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Port listening on 8000");
});
