it("read test.pdf, print html code", async () => {
  const convertPdfToHtml = require("./index");
  const result = await convertPdfToHtml("test.pdf");
  expect(result).toBe(true);
});