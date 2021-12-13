const log = require("loglevel");
const axios = require("axios");
const fs = require("fs");

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


it.skip("read simple html, get reader mode content", async () => {
  const fs = require("fs");
  var { Readability } = require('@mozilla/readability');
  var { JSDOM } = require('jsdom');
  //read simple.html
  const html = fs.readFileSync("simple.html", "utf8");
  const doc = new JSDOM(html, {
    url: "https://www.example.com/the-page-i-got-the-source-from"
  });
  const reader = new Readability(doc.window.document);
  const article = reader.parse();
  log.warn("article", article);
  expect(article).toMatchObject({
    content: expect.stringMatching(/^<div id="readability-page-1"/),
  })
});

const download_image = (url, image_path) =>
axios({
  url,
  responseType: 'stream',
}).then(
  response =>
    new Promise((resolve, reject) => {
      response.data
        .pipe(fs.createWriteStream(image_path))
        .on('finish', () => resolve())
        .on('error', e => reject(e));
    }),
);

function extractName(url) {
  const m = url.match(/^https?:\/\/.*\/([^/]*(png|svg|jpeg))/i);
  const imageName = m[1];
  return imageName;
}

it.only("read oop html, get reader mode content, output to a file", async () => {
  const fs = require("fs");
  var { Readability } = require('@mozilla/readability');
  var { JSDOM } = require('jsdom');
  //read simple.html
  const html = fs.readFileSync("oop.html", "utf8");
  const doc = new JSDOM(html, {
    url: "https://www.example.com/the-page-i-got-the-source-from"
  });
  const reader = new Readability(doc.window.document);
  const article = reader.parse();
  log.warn("article", article);
  expect(article).toMatchObject({
    content: expect.stringMatching(/^<div id="readability-page-1"/),
  })

  let {content} = article;

  const imgs = content.match(/<img[^>]*?src="([^"]*?)"[^>]*?>/g);
  expect(imgs).toHaveLength(3);
  for(let img of imgs) {
    const url0 = img.match(/src="([^"]*?)"/)[1];
    expect(url0).toMatch(/^https?:\/\//);
    const imageName = extractName(url0);
    log.warn("image url:", url0);
    const path = `./out/${imageName}`;
    await download_image(url0, path);
    const index = content.search(url0);
    expect(index).toBeGreaterThan(1);
    content = content.replace(url0, `./${imageName}`);
  }

  const template = fs.readFileSync("./template.html", "utf8");
  expect(template).toMatch(/^\<html/);
  expect(template).toMatch(/\$\{content\}/);
  const result = template.replace("${content}", content);

  //write result to oop.readability.html
  fs.writeFileSync("out/oop.html", result);

});

it("down load image, and save to file: https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Octicons-terminal.svg/24px-Octicons-terminal.svg.png", async () => {
  const url = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Octicons-terminal.svg/24px-Octicons-terminal.svg.png";
  const imageName = extractName(url);
  expect(imageName).toBe("24px-Octicons-terminal.svg.png");
  await download_image(url, `out/${imageName}`);
  // file exists
  expect(fs.existsSync(`out/${imageName}`)).toBe(true);
});



