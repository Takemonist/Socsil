import express from 'express';
import { chromium } from "@playwright/test";
import path from 'path';
import bodyParser from 'body-parser';
import { JSDOM } from "jsdom";
import request from 'request';
import { fileURLToPath } from 'url';
const app = express();

const apiKey = 'AIzaSyCkW1quG7BBO92_8IPJc9KKRz6i88rPiFM';
//パスの設定
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname,'view')));

app.use('/public', express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/public/js/dict'));
app.get('/',(req,res)=>{
    res.render('index.html');
});
console.log('http://127.0.0.1:3000/');

app.listen(3000);

(async () => {
    const browser = await chromium.launch({ headless: false }); // ここにオプションを設定！
  
    const page = await browser.newPage();
    await page.goto("http://127.0.0.1:3000/");
  })();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.post('/auth/', async (req, res) => {
    /*const options = {
        method: 'GET',
        json: true,
    };*/
    const promises = [];
    const texts = [];
    req.body.forEach(url => {
        const promise = fetch(url).then(res => res.text()).then(html => {
            const dom = new JSDOM(html);
            const title = dom.window.document.title;
            const text = htmlToText(html);
            console.log(text);
            texts.push(text);
        }).catch(err => console.error(err));
        promises.push(promise);
    });
    await Promise.all(promises);
    res.send(JSON.stringify({texts : texts}));

});
  // HTML文字列を引数として受け取る関数
function htmlToText(html) {
    const dom = new JSDOM(html);
    let regex =/<script[^>]*>[\s\S]*?<\/script>|<[^>]*>|\s/g;
    // HTMLタグを空文字に置換する
    let text = html.replace(regex, "");
    // 特殊文字をデコードするための仮想的なDOM要素を作成する
    let element = dom.window.document.createElement("div");
    // 特殊文字を含むテキストを要素のinnerHTMLに設定する
    element.innerHTML = text;
    // 要素のtextContentを返す（特殊文字がデコードされる）
    return element.textContent;
  }
  