const DICT_PATH = "./dict";
const story = "昔々、あるところにお爺さんとお婆さんが住んでいたそうな。お爺さんは山へ芝刈りに、お婆さんは川へ洗濯に向かいましたとさ。すると、川上からどんぶらこどんぶらこと大きな桃が流れてきました。";

// Main
window.onload = (event)=>{

	const ids = [];  // tokenで取得できる言葉のIDを格納する配列
	const names = [];// tokenで取得した名詞を格納する配列

	// Kuromoji
	kuromoji.builder({dicPath: DICT_PATH}).build((err, tokenizer)=>{
		const tokens = tokenizer.tokenize(story);
		tokens.forEach((token)=>{
			console.log(token);
			if(token.pos == "名詞" && token.pos_detail_1 == "一般"){
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