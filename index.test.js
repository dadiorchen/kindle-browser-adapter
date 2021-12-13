it.skip("read test.pdf, print html code", async () => {
  const convertPdfToHtml = require("./index");
  const result = await convertPdfToHtml("test.pdf");
  // jest expect match the string
  expect(result).toMatch(/^\<html/);
  const fs = require("fs");
  //write result to test.html
  fs.writeFileSync("test.html", result);
});

it.skip("read ddd.pdf, print html code", async () => {
  const convertPdfToHtml = require("./index");
  const result = await convertPdfToHtml("ddd.pdf");
  // jest expect match the string
  expect(result).toMatch(/^\<html/);
  const fs = require("fs");
  //write result to test.html
  fs.writeFileSync("ddd.html", result);
}, 1000*30);


it("read simple html, get reader mode content", async () => {
  const fs = require("fs");
  //read simple.html
  const html = fs.readFileSync("simple.html", "utf8");
});