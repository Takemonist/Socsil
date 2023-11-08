import express from 'express';
import { chromium } from "@playwright/test";
import path from 'path';
import bodyParser from 'body-parser';
import { JSDOM } from "jsdom";
import request from 'request';
import { fileURLToPath } from 'url';

import fetch from 'node-fetch';
import zlib from 'zlib';
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
console.log('http://127.0.0.1:4000/');

app.listen(4000);

(async () => {
    const browser = await chromium.launch({ headless: false }); // ここにオプションを設定！
  
    const page = await browser.newPage();
    await page.goto("http://127.0.0.1:4000/");
  })();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


app.post('/query/', async (req, res) => {
    var API_KEY = `6238329b-3b1c-ea0e-a973-226835408801:fx`
    var API_URL = `https://api-free.deepl.com/v2/translate`
    let en_result = '';
    let ja_result = '';
    let content = encodeURI('auth_key=' + API_KEY + '&text=' + req.body.query + '&source_lang=JA&target_lang=EN');
    let translate_ja2en_api = API_URL + '?' + content;

    let response = await fetch(translate_ja2en_api);
    if (response.ok) {
        let data = await response.json();
        console.log(data);
        let jaText = data.translations[0].text; // JSONからtextを取得

        let responseEn = await query({"question": jaText});
        console.log(responseEn);
        en_result = responseEn;

        let en_content = encodeURI('auth_key=' + API_KEY + '&text=' + en_result + '&source_lang=EN&target_lang=JA');
        let translate_en2ja_api = API_URL + '?' + en_content;

        response = await fetch(translate_en2ja_api);
        if (response.ok) {
            data = await response.json();
            console.log(data);
            ja_result = data["translations"][0]["text"];
            console.log(ja_result);
        } else {
            throw new Error("Could not reach the API: " + response.statusText);
        }
    }
    res.set('Content-Type', 'application/json');
    res.json({result: ja_result}); 
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

  async function query(data) {
    const response = await fetch(
        "http://localhost:3000/api/v1/prediction/04173494-eab9-4982-aa7e-f6a6238ca714",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    return result;
}


  