const DICT_PATH = "/public/dict";
const story = "昔々、あるところにお爺さんとお婆さんが住んでいたそうな。お爺さんは山へ芝刈りに、お婆さんは川へ洗濯に向かいましたとさ。すると、川上からどんぶらこどんぶらこと大きな桃が流れてきました。";

const apiKey = 'AIzaSyCkW1quG7BBO92_8IPJc9KKRz6i88rPiFM';
const cx = '4783df8e532fc4495';

// パネルとボタンへの参照を取得
const searchHistoryPanel = document.getElementById("searchHistoryPanel");
const toggleSearchHistoryButton = document.getElementById("toggleSearchHistory");


// パネルを切り替える関数
function toggleSearchHistory() {
    if (searchHistoryPanel.style.left === "0px") {
        searchHistoryPanel.style.left = "-300px";
    } else {
        searchHistoryPanel.style.left = "0px";
    }
}

// ボタンにクリックイベントハンドラをアタッチ
toggleSearchHistoryButton.addEventListener("click", toggleSearchHistory);

var when = document.getElementById('when');
var where = document.getElementById('where');
var who = document.getElementById('who');
var what = document.getElementById('what');
var why = document.getElementById('why');
var how = document.getElementById('how');
var search = document.getElementById('searchButton');
var searchInput = document.getElementById('searchInput');


function toggleButton(button) {
	// ボタンの状態を切り替える
	if (button.classList.contains('active')) {
		// ボタンがアクティブな場合の処理
		button.classList.remove('active');
		console.log(button.id + " deactivated");
} else {
		// ボタンが非アクティブな場合の処理
		button.classList.add('active');
		console.log(button.id + " activated");
}
}


when.addEventListener('click', function() {
	toggleButton(when);
});
where.addEventListener('click', function() {
	toggleButton(where);
});
who.addEventListener('click', function() {
	toggleButton(who);
});
what.addEventListener('click', function() {
	toggleButton(what);
});
why.addEventListener('click', function() {
	toggleButton(why);
});
how.addEventListener('click', function() {
	toggleButton(how);
});

/*internal processing*/

search.addEventListener('click', function() {
	var input_value = searchInput.value;
	var is_when = when.classList.contains('active');
	var is_where = where.classList.contains('active');
	var is_who = who.classList.contains('active');
	var is_what = what.classList.contains('active');
	var is_why = why.classList.contains('active');
	var is_how = how.classList.contains('active');
	var str_5w1h = "";
	if(is_when) str_5w1h += " いつ ";
	if(is_where) str_5w1h += " どこ ";
	if(is_who) str_5w1h += " だれ ";
	if(is_what) str_5w1h += " とは ";
	if(is_why) str_5w1h += " なぜ ";
	console.log(input_value+str_5w1h);

	var searchQuery = input_value+str_5w1h;

	var apiUrl = `https://www.googleapis.com/customsearch/v1?q=${searchQuery}&key=${apiKey}&cx=${cx}`;

	var history_element = document.createElement("li");
	var textNode = document.createTextNode(searchQuery); // テキストノードを作成
	history_element.appendChild(textNode); // テキストノードを<li>要素に追加
	document.getElementById("historyList").appendChild(history_element); // <li>要素を#historyListに追加

	fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
					display_urls(data.items);
        })
        .catch(error => {
            console.error('検索エラー:', error);
        });
});

const resultsContainer = document.getElementById('results-container');
function display_results(res) {
    resultsContainer.innerHTML = '';
    res.texts.forEach(item => {
			const resultDiv = document.createElement('div');
			resultDiv.innerHTML = `${item}`;
			resultsContainer.appendChild(resultDiv);
		});
}
function display_urls(items) {
	resultsContainer.innerHTML = '';

	if (items && items.length > 0) {
			// 上位3つの検索結果のURLを取得
			const Urls = items.slice(0,2).map(item => item.link);
			console.log(JSON.stringify(Urls, null, 2));
			fetch('http://127.0.0.1:3000/auth/', {

        method: 'POST',
        headers: {
         'content-type': 'application/json',
        },
        body: JSON.stringify(Urls),

      }).then(response => {

       return response.json();

      }).then(res => {
      	console.log(res);
				console.log(JSON.stringify(res));
				display_results(res);

      }).catch(error => {
				console.log(error);
      });
	} else {
			resultsContainer.innerHTML = '検索結果が見つかりませんでした。';
	}
}

window.onload = (event)=>{

	const ids = [];  // tokenで取得できる言葉のIDを格納する配列
	const names = [];// tokenで取得した名詞を格納する配列

	// Kuromoji
	kuromoji.builder({dicPath: DICT_PATH}).build((err, tokenizer)=>{
		const tokens = tokenizer.tokenize(story);
		tokens.forEach((token)=>{
			console.log(token);
			if(token.pos == "助詞" /*&& token.pos_detail_1 == "一般"*/){
				ids.push(token.word_id);// IDを追加する
				names.push(token.surface_form);// 名詞を追加する
			}
		});
		makeAnotherStory(tokens, ids, names);// 話を作る関数を実行
	});
}

// 話を作る関数
function makeAnotherStory(tokens, ids, names){
	shuffle(names);// 名詞配列をシャッフルする関数を実行

	const story = [];// 結果を格納する配列
	tokens.forEach((token)=>{// tokensから1語づつ抜き出す
		const id = token.word_id;// IDを取り出す
		const find = ids.findIndex((elem)=>elem==id);// ID配列に存在するかどうか
		if(find < 0){// ID配列に存在しない場合(名詞でない)
			story.push(token.surface_form);// そのままstoryに追加
		}else{// ID配列に存在する場合(名詞である)
			story.push(names.pop());// 名詞配列から1つ取り出してstoryに追加
		}
	});

	console.log(story.join(""));// 配列を1つの文章にして出力する
}

// 名詞配列をシャッフルする関数
function shuffle(arr){
	for(let i=arr.length-1; 0<i; i--){
		const r = Math.floor(Math.random() * i);
		const tmp = arr[r];
		arr[r] = arr[i];
		arr[i] = tmp;
	}
}

