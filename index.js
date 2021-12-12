const log = require("loglevel");

async function convertPdfToHtml(path){
  const pdf2Html = require("pdf2html")
  log.warn("loaded:", pdf2Html);
  const result = await new Promise((resolve, reject) => {
    pdf2Html.html(path, (err, html) => {
      if(err){
        log.error("error:", err);
        return;
      }else{
        log.warn("html:", html);
        resolve(html);
      }
    });
  });
  log.warn("parsed result length:", result.length);
  return result;
}

// export 
module.exports = convertPdfToHtml;