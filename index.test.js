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

async function readable(html, path, fileName) {
  const fs = require("fs");
  var { Readability } = require('@mozilla/readability');
  var { JSDOM } = require('jsdom');
  //read simple.html
  const doc = new JSDOM(html, {
    url: "https://www.example.com/the-page-i-got-the-source-from"
  });
  const reader = new Readability(doc.window.document);
  const article = reader.parse();
  log.warn("article", article);
  expect(article).toMatchObject({
    content: expect.stringMatching(/^<div id="readability-page-1"/),
  })

  let { content } = article;

  const imgs = content.match(/<img[^>]*?src="([^"]*?)"[^>]*?>/g);
  expect(imgs).toHaveLength(3);
  for (let img of imgs) {
    const url0 = img.match(/src="([^"]*?)"/)[1];
    expect(url0).toMatch(/^https?:\/\//);
    const imageName = extractName(url0);
    log.warn("image url:", url0);
    const pathFile = `./${path}/${imageName}`;
    await download_image(url0, pathFile);
    const index = content.search(url0);
    expect(index).toBeGreaterThan(1);
    content = content.replace(url0, `./${imageName}`);
  }

  const template = fs.readFileSync("./template.html", "utf8");
  expect(template).toMatch(/^\<html/);
  expect(template).toMatch(/\$\{content\}/);
  const result = template.replace("${content}", content);

  //write result to oop.readability.html
  fs.writeFileSync(`${path}/${fileName}`, result);
}

it.skip("read oop html, get reader mode content, output to a file", async () => {
  const html = fs.readFileSync("oop.html", "utf8");
  readable(html, "out", "oop.html");

});

it.only("read fp html, get reader mode content, output to a file", async () => {
  const html = fs.readFileSync("fp.html", "utf8");
  readable(html, "out", "fp.html");

});

it.skip("down load image, and save to file: https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Octicons-terminal.svg/24px-Octicons-terminal.svg.png", async () => {
  const url = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Octicons-terminal.svg/24px-Octicons-terminal.svg.png";
  const imageName = extractName(url);
  expect(imageName).toBe("24px-Octicons-terminal.svg.png");
  await download_image(url, `out/${imageName}`);
  // file exists
  expect(fs.existsSync(`out/${imageName}`)).toBe(true);
});


it.skip("copy html from zhihu", async () => {
  const html = `
<div class="List-item" tabindex="0"><div><div class="ContentItem AnswerItem" data-zop="{&quot;authorName&quot;:&quot;CJex&quot;,&quot;itemId&quot;:561017786,&quot;title&quot;:&quot;面向对象（OOP）是编程语言发展中的弯路吗？为什么？&quot;,&quot;type&quot;:&quot;answer&quot;}" name="561017786" itemprop="answer" itemtype="http://schema.org/Answer" itemscope="" data-za-detail-view-path-module="AnswerItem" data-za-extra-module="{&quot;card&quot;:{&quot;has_image&quot;:false,&quot;has_video&quot;:false,&quot;content&quot;:{&quot;type&quot;:&quot;Answer&quot;,&quot;token&quot;:&quot;561017786&quot;,&quot;upvote_num&quot;:196,&quot;comment_num&quot;:3,&quot;publish_timestamp&quot;:null,&quot;parent_token&quot;:&quot;307049097&quot;,&quot;author_member_hash_id&quot;:&quot;01f3a7120f847fd6affe3f1e68438ef5&quot;}}}"><div class="ContentItem-meta"><div class="AuthorInfo AnswerItem-authorInfo AnswerItem-authorInfo--related" itemprop="author" itemscope="" itemtype="http://schema.org/Person"><div class="AuthorInfo"><meta itemprop="name" content="CJex"><meta itemprop="image" content="https://pic3.zhimg.com/c65c31e2b06796affdb022c261d3ba05_l.jpg?source=1940ef5c"><meta itemprop="url" content="https://www.zhihu.com/people/cjex"><meta itemprop="zhihu:followerCount" content="4367"><span class="UserLink AuthorInfo-avatarWrapper"><div class="Popover"><div id="Popover23-toggle" aria-haspopup="true" aria-expanded="false" aria-owns="Popover23-content"><a target="_blank" class="UserLink-link" data-za-detail-view-element_name="User" href="//www.zhihu.com/people/cjex"><img class="Avatar AuthorInfo-avatar" width="38" height="38" src="https://pic3.zhimg.com/c65c31e2b06796affdb022c261d3ba05_xs.jpg?source=1940ef5c" srcset="https://pic3.zhimg.com/c65c31e2b06796affdb022c261d3ba05_l.jpg?source=1940ef5c 2x" alt="CJex"></a></div></div></span><div class="AuthorInfo-content"><div class="AuthorInfo-head"><span class="UserLink AuthorInfo-name"><div class="Popover"><div id="Popover24-toggle" aria-haspopup="true" aria-expanded="false" aria-owns="Popover24-content"><a target="_blank" class="UserLink-link" data-za-detail-view-element_name="User" href="//www.zhihu.com/people/cjex">CJex</a></div></div></span></div><div class="AuthorInfo-detail"><div class="AuthorInfo-badge"><div class="ztext AuthorInfo-badgeText">https://jex.im/</div></div></div></div></div></div><div class="LabelContainer-wrapper"></div><div class="css-1k5dpte"><span><span class="Voters"><button type="button" class="Button Button--plain">196 人赞同了该回答</button></span></span></div></div><meta itemprop="image"><meta itemprop="upvoteCount" content="196"><meta itemprop="url" content="https://www.zhihu.com/question/307049097/answer/561017786"><meta itemprop="dateCreated" content="2018-12-27T10:52:20.000Z"><meta itemprop="dateModified" content="2019-08-31T02:09:23.000Z"><meta itemprop="commentCount" content="3"><div class="RichContent RichContent--unescapable"><div class="RichContent-inner RichContent-inner--collapsed"><span class="RichText ztext CopyrightRichText-richText css-hnrfcf" options="[object Object]" itemprop="text"><p data-pid="WDj1IKtZ">一切皆对象的口号显然有点过了，但也不至于说走了多少弯路。</p><p data-pid="t6eLv6wC">这个问题跟「<a href="https://www.zhihu.com/question/289974125/answer/468200343" class="internal" data-za-detail-view-id="1043">子类型（subtyping）是不是错误（ill-defined）的东西？</a>」有点类似，就是程序员突然发现工具箱里面有些工具没了的话好像也没关系，就开始怀疑它们是不是多余的或错误的设计。OOP是个模糊的概念，它不仅仅指<span><a data-za-not-track-link="true" href="https://www.zhihu.com/search?q=%E7%A8%8B%E5%BA%8F%E8%AF%AD%E8%A8%80&amp;search_source=Entity&amp;hybrid_search_source=Entity&amp;hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A561017786%7D" target="_blank" class="css-1occaib">程序语言<svg width="8px" height="8px" viewBox="0 0 15 15" class="css-ukqak1"><path d="M10.89 9.477l3.06 3.059a1 1 0 0 1-1.414 1.414l-3.06-3.06a6 6 0 1 1 1.414-1.414zM6 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="currentColor"></path></svg></a></span>的那些特性，OOP之前必须先OOD （Object Oriented Design），不可能脱离OOD谈OOP，如果只谈概念，我们来看看：</p><ol><li data-pid="4d_snD_j">封装：到底什么是封装？<span><a data-za-not-track-link="true" href="https://www.zhihu.com/search?q=%E7%A7%81%E6%9C%89%E6%96%B9%E6%B3%95&amp;search_source=Entity&amp;hybrid_search_source=Entity&amp;hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A561017786%7D" target="_blank" class="css-1occaib">私有方法<svg width="8px" height="8px" viewBox="0 0 15 15" class="css-ukqak1"><path d="M10.89 9.477l3.06 3.059a1 1 0 0 1-1.414 1.414l-3.06-3.06a6 6 0 1 1 1.414-1.414zM6 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="currentColor"></path></svg></a></span>？那 Haskell 只导出 Smart Constructors 算不算？</li><li data-pid="QGfN2tMk">继承：OCaml module include 算不算？Typeclass hierarchy 算不算？</li><li data-pid="74PZhldx">多态：<span><a data-za-not-track-link="true" href="https://www.zhihu.com/search?q=%E5%8F%82%E6%95%B0%E5%8C%96%E5%A4%9A%E6%80%81&amp;search_source=Entity&amp;hybrid_search_source=Entity&amp;hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A561017786%7D" target="_blank" class="css-1occaib">参数化多态<svg width="8px" height="8px" viewBox="0 0 15 15" class="css-ukqak1"><path d="M10.89 9.477l3.06 3.059a1 1 0 0 1-1.414 1.414l-3.06-3.06a6 6 0 1 1 1.414-1.414zM6 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="currentColor"></path></svg></a></span>也叫多态啊！</li></ol><p data-pid="0XHowPCh">如何才能划出一条清晰的边线界定OOP？对象内部状态？这可就麻烦大了，所有非纯函数式编程都不可能完全避开内部状态。如果你就是要原教旨 Pure FP 大法好？那……你开心就好：</p><div class="highlight"><pre><code class="language-haskell"><span class="kr">type</span> <span class="kt">MonadStackHell</span> <span class="n">a</span> <span class="n">b</span> <span class="n">c</span> <span class="ow">=</span> <span class="kt">AppT</span> <span class="p">(</span><span class="kt">MaybeT</span> <span class="p">(</span><span class="kt">ReaderT</span> <span class="n">a</span> <span class="p">(</span><span class="kt">StateT</span> <span class="n">b</span> <span class="kt">IO</span><span class="p">)))</span>  <span class="n">c</span></code></pre></div><p data-pid="_4h5EFss">不要跟我提<span><a data-za-not-track-link="true" href="https://www.zhihu.com/search?q=Extensible+effects&amp;search_source=Entity&amp;hybrid_search_source=Entity&amp;hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A561017786%7D" target="_blank" class="css-1occaib">Extensible effects<svg width="8px" height="8px" viewBox="0 0 15 15" class="css-ukqak1"><path d="M10.89 9.477l3.06 3.059a1 1 0 0 1-1.414 1.414l-3.06-3.06a6 6 0 1 1 1.414-1.414zM6 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="currentColor"></path></svg></a></span>，既然Haskell都只能做到这种地步，为什么它就不算走弯路？</p><p data-pid="cTO-8c3D">有些人不爽的地方可能在于，数据和行为是两个不同的维度，而现有的OOP语言都把数据和行为绑定到了一起，不得不用 Extensible Visitor Pattern 绕弯。可这本身就是难解之题，Haskell 里面虽然可以很方便地用 Typeclass 扩展方法，但添加新的数据却成了问题。Data types à <span><a data-za-not-track-link="true" href="https://www.zhihu.com/search?q=la+carte&amp;search_source=Entity&amp;hybrid_search_source=Entity&amp;hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A561017786%7D" target="_blank" class="css-1occaib">la carte<svg width="8px" height="8px" viewBox="0 0 15 15" class="css-ukqak1"><path d="M10.89 9.477l3.06 3.059a1 1 0 0 1-1.414 1.414l-3.06-3.06a6 6 0 1 1 1.414-1.414zM6 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="currentColor"></path></svg></a></span> 那种方式虽然可以无限扩展数据，但却增加了转型的运行时开销，鱼和熊掌不可兼得，OOP 语言选择了另一条路，但子类型虚函数又会增加方法调用的运行时开销。（我也不提 Object Algebras </p><p data-pid="EL_74EZi">只从编程语言角度思考就进入了死胡同，我们要从OOD的角度看。在设计时自然说 A student is a Person，继承了Person的属性和方法，Haskell不支持Record继承，难道在设计时也说Student包含一个Person？然后白板上 Functor、MonadTrans、Constraints 满天飞？这样看将 Subtying 和 Inheritance 捆绑在一起还真是非常贴心，要是只说Student是Person的子类还不够，还要加一句Person有的ABCD接口Student都继承实现，那就太啰嗦了 。对象思维方式显然更易于描述现实中的大部分<span><a data-za-not-track-link="true" href="https://www.zhihu.com/search?q=%E4%B8%9A%E5%8A%A1%E6%A8%A1%E5%9E%8B&amp;search_source=Entity&amp;hybrid_search_source=Entity&amp;hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A561017786%7D" target="_blank" class="css-1occaib">业务模型<svg width="8px" height="8px" viewBox="0 0 15 15" class="css-ukqak1"><path d="M10.89 9.477l3.06 3.059a1 1 0 0 1-1.414 1.414l-3.06-3.06a6 6 0 1 1 1.414-1.414zM6 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="currentColor"></path></svg></a></span>。它有它的局限性，但离泛滥还远着呢，我看到更多的是很多程序员根本不懂面向对象设计，甚至根本就没有 Design 这一步，从这方面来讲，不但不算是弯路，甚至还应该继续大力推进。问题的关键并不在于OOP，而在于错误的OOD。</p><hr><p data-pid="HWqkFVcf">如果OOD本身就是错的，那么正确的又是什么？我觉得现在我们还不能完美回答这个问题，有一个词呼之欲出： Language Oriented Design，但是我们还有很多路要走，而且我很怀疑有些<span><a data-za-not-track-link="true" href="https://www.zhihu.com/search?q=%E4%B8%9A%E5%8A%A1%E9%80%BB%E8%BE%91&amp;search_source=Entity&amp;hybrid_search_source=Entity&amp;hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A561017786%7D" target="_blank" class="css-1occaib">业务逻辑<svg width="8px" height="8px" viewBox="0 0 15 15" class="css-ukqak1"><path d="M10.89 9.477l3.06 3.059a1 1 0 0 1-1.414 1.414l-3.06-3.06a6 6 0 1 1 1.414-1.414zM6 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="currentColor"></path></svg></a></span>天生更适合用OOD描述，换成LOD只不过是重新发明一个OO DSL而已。</p><p data-pid="fuPX9lsB"><a href="https://link.zhihu.com/?target=https%3A//parametri.city/blog/2018-12-23-language-oriented-software-engineering/index.html" class=" wrap external" target="_blank" rel="nofollow noreferrer" data-za-detail-view-id="1043">Language-oriented software engineering，a book review of Clean Architecture</a></p></span></div><div><div class="ContentItem-time"><a target="_blank" href="//www.zhihu.com/question/307049097/answer/561017786"><span data-tooltip="发布于 2018-12-27 18:52" aria-label="发布于 2018-12-27 18:52">编辑于 2019-08-31 10:09</span></a></div></div><div class="ContentItem-actions RichContent-actions"><span><button aria-label="赞同 196 " aria-live="polite" type="button" class="Button VoteButton VoteButton--up"><span style="display: inline-flex; align-items: center;">​<svg class="Zi Zi--TriangleUp VoteButton-TriangleUp" fill="currentColor" viewBox="0 0 24 24" width="10" height="10"><path d="M2 18.242c0-.326.088-.532.237-.896l7.98-13.203C10.572 3.57 11.086 3 12 3c.915 0 1.429.571 1.784 1.143l7.98 13.203c.15.364.236.57.236.896 0 1.386-.875 1.9-1.955 1.9H3.955c-1.08 0-1.955-.517-1.955-1.9z" fill-rule="evenodd"></path></svg></span>赞同 196</button><button aria-label="反对" aria-live="polite" type="button" class="Button VoteButton VoteButton--down"><span style="display: inline-flex; align-items: center;">​<svg class="Zi Zi--TriangleDown" fill="currentColor" viewBox="0 0 24 24" width="10" height="10"><path d="M20.044 3H3.956C2.876 3 2 3.517 2 4.9c0 .326.087.533.236.896L10.216 19c.355.571.87 1.143 1.784 1.143s1.429-.572 1.784-1.143l7.98-13.204c.149-.363.236-.57.236-.896 0-1.386-.876-1.9-1.956-1.9z" fill-rule="evenodd"></path></svg></span></button></span><button type="button" class="Button ContentItem-action Button--plain Button--withIcon Button--withLabel"><span style="display: inline-flex; align-items: center;">​<svg class="Zi Zi--Comment Button-zi" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M10.241 19.313a.97.97 0 0 0-.77.2 7.908 7.908 0 0 1-3.772 1.482.409.409 0 0 1-.38-.637 5.825 5.825 0 0 0 1.11-2.237.605.605 0 0 0-.227-.59A7.935 7.935 0 0 1 3 11.25C3 6.7 7.03 3 12 3s9 3.7 9 8.25-4.373 9.108-10.759 8.063z" fill-rule="evenodd"></path></svg></span>3 条评论</button><div class="Popover ShareMenu ContentItem-action"><div class="ShareMenu-toggler" id="Popover31-toggle" aria-haspopup="true" aria-expanded="false" aria-owns="Popover31-content"><button type="button" class="Button Button--plain Button--withIcon Button--withLabel"><span style="display: inline-flex; align-items: center;">​<svg class="Zi Zi--Share Button-zi" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M2.931 7.89c-1.067.24-1.275 1.669-.318 2.207l5.277 2.908 8.168-4.776c.25-.127.477.198.273.39L9.05 14.66l.927 5.953c.18 1.084 1.593 1.376 2.182.456l9.644-15.242c.584-.892-.212-2.029-1.234-1.796L2.93 7.89z" fill-rule="evenodd"></path></svg></span>分享</button></div></div><button type="button" class="Button ContentItem-action Button--plain Button--withIcon Button--withLabel"><span style="display: inline-flex; align-items: center;">​<svg class="Zi Zi--Star Button-zi" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M5.515 19.64l.918-5.355-3.89-3.792c-.926-.902-.639-1.784.64-1.97L8.56 7.74l2.404-4.871c.572-1.16 1.5-1.16 2.072 0L15.44 7.74l5.377.782c1.28.186 1.566 1.068.64 1.97l-3.89 3.793.918 5.354c.219 1.274-.532 1.82-1.676 1.218L12 18.33l-4.808 2.528c-1.145.602-1.896.056-1.677-1.218z" fill-rule="evenodd"></path></svg></span>收藏</button><button aria-live="polite" type="button" class="Button ContentItem-action Button--plain Button--withIcon Button--withLabel"><span style="display: inline-flex; align-items: center;">​<svg class="Zi Zi--Heart Button-zi" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M2 8.437C2 5.505 4.294 3.094 7.207 3 9.243 3 11.092 4.19 12 6c.823-1.758 2.649-3 4.651-3C19.545 3 22 5.507 22 8.432 22 16.24 13.842 21 12 21 10.158 21 2 16.24 2 8.437z" fill-rule="evenodd"></path></svg></span>喜欢</button><div class="Popover ContentItem-action"><button aria-label="更多" id="Popover32-toggle" aria-haspopup="true" aria-expanded="false" aria-owns="Popover32-content" type="button" class="Button OptionsButton Button--plain Button--withIcon Button--iconOnly"><span style="display: inline-flex; align-items: center;">​<svg class="Zi Zi--Dots Button-zi" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M5 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm7 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm7 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill-rule="evenodd"></path></svg></span></button></div><button data-zop-retract-question="true" type="button" class="Button ContentItem-action ContentItem-rightButton Button--plain"><span class="RichContent-collapsedText">收起</span><span style="display: inline-flex; align-items: center;">​<svg class="Zi Zi--ArrowDown ContentItem-arrowIcon is-active" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M12 13L8.285 9.218a.758.758 0 0 0-1.064 0 .738.738 0 0 0 0 1.052l4.249 4.512a.758.758 0 0 0 1.064 0l4.246-4.512a.738.738 0 0 0 0-1.052.757.757 0 0 0-1.063 0L12.002 13z" fill-rule="evenodd"></path></svg></span></button></div></div><div><div><div class=""></div><div class="ModalLoading-content"><svg width="30" height="30" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg" class="CircleLoadingBar" aria-hidden="true"><g><circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle></g></svg></div></div></div></div></div></div>
  `

  //to conver to reader mode
});
