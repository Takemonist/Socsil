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
    const titles = [];
    req.body.forEach(url => {
        const promise = fetch(url).then(res => res.text()).then(html => {
            const dom = new JSDOM(html);
            const title = dom.window.document.title;
            titles.push(title);
        }).catch(err => console.error(err));
        promises.push(promise);
    });
    await Promise.all(promises);
    res.send(JSON.stringify({title : titles}));
    /*request(options, function(error, response, body) {
        req.body.forEach(body => {
            fetch(body).then(function (response) {
                // The API call was successful!
                return response.text();
            }).then(function (html) {
                //console.log(html);
                // This is the HTML from our response as a text string
                //console.log(html);
                const dom = new JSDOM(html);
                // get element
                const text = dom.window.document.title;
                titles.push(text);
                console.log(body + ":" + text);
            }).catch(function (err) {
                // There was an error
                console.warn('Something went wrong.', err);
            });
        });
    });*/
});
  