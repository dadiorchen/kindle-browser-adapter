const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const log = require("loglevel");

/* To split a html page */
class PageSliter{
  constructor(html, options){
    this.html = html;
    this.options = options;
    this._parse();
    log.warn("options:", options);
  }

  _parse(){
    this.pages = [];
    const dom = new JSDOM(this.html);
    const contentElement = dom.window.document.querySelector("body");
    log.warn("contentElement", contentElement);
    const childrenNodes = contentElement.childNodes;
    let pageLines = 0;
    let pageHtml = '';
    for(const node of childrenNodes){
      log.warn("text2:", node.textContent);
      //pageNode.appendChild(node);
      pageHtml += node.outerHTML || '';
      log.warn("node:", node);
      const {textContent} = node;
      log.warn("text:", textContent);
      const textCount = textContent.trim().length;
      log.warn("text count:", textCount);
      log.warn("html:", node.outerHTML);
      const lines = Math.ceil(textCount / this.options.lettersPerLine);
      log.warn("lines:", lines);
      pageLines += lines;
      if(pageLines >= this.options.linesPerPage){
        log.warn("create new page")
        this.pages.push(pageHtml);
        pageHtml = '';
        pageLines = 0;
      }
    }
    this.pages.push(pageHtml);
  }

  getPage(number){
    return this.pages[number];
  }

  getPages(){
    return this.pages;
  }

  getPageCount(){
    return this.pages.length;
  }

}

module.exports = PageSliter;