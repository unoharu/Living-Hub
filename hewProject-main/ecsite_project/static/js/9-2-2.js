let searchUi = ".search_ui"; // 絞り込み検索条件設定エリア
let listItem = ".item"; // 検索対象アイテム
let hideItem = "hide_item"; // 対象外アイテムに付与されるclass名
let checkBox = 'input[name="size"]'; //チェックボックスのnameを指定


const btn = document.querySelector("#btn");
const btn1 = document.querySelector("#btn1");
const dialog = document.querySelector("#dialog");
const dialog1 = document.querySelector("#dialog1");
const modalBtn = document.querySelector("#modalBtn");
const modalBtn1 = document.querySelector("#modalBtn1");
btn.addEventListener("click", () => {
  dialog.showModal();
  document.documentElement.style.overflow = "hidden";
});
btn1.addEventListener("click", () => {
  dialog1.showModal();
  document.documentElement.style.overflow = "hidden";
});



// フィルタリング関数
function search_filter() {
	// 非表示状態を解除
	$(".item").removeClass("hide_item");
  
	// 各絞り込み条件をチェック
	$(".search_ui").each(function() {
	  let name = $(this).find("input").attr("name");
	  let searchData = get_selected_input_items(name);
  
	  if (searchData.length === 0 || searchData[0] === "") {
		return;
	  }
  
	  $(".item").each(function() {
		let itemData = $(this).data(name);
		if (!Array.isArray(itemData)) {
		  itemData = [itemData];
		}
		let check = array_match_check(itemData, searchData);
		if (!check) {
		  $(this).addClass("hide_item");
		}
	  });
	});
  }
  
  // チェックされた項目を取得する関数
  function get_selected_input_items(name) {
	let searchData = [];
	$("[name=" + name + "]:checked").each(function () {
	  searchData.push($(this).val());
	});
	return searchData;
  }
  
  // 2つの配列内で一致する文字列があるかどうかを調べる関数
  function array_match_check(arr1, arr2) {
	for (let i = 0; i < arr1.length; i++) {
	  if (arr2.indexOf(arr1[i]) >= 0) {
		return true;
	  }
	}
	return false;
  }
  

  
  
  // 絞り込みボタンのクリックイベントをデリゲート
  $(document).on("click", "#qqq", function(event) { 
	event.preventDefault(); // フォームのデフォルトの送信を防止
	search_filter(); // フィルタリング関数を呼び出す
	dialog.close(); // モーダルを閉じる
	document.documentElement.removeAttribute("style");
  });
  $(document).on("click", "#qqq1", function(event) { 
	event.preventDefault(); // フォームのデフォルトの送信を防止
	search_filter(); // フィルタリング関数を呼び出す
	dialog1.close(); // モーダルを閉じる
	document.documentElement.removeAttribute("style");
  });
  
  // モーダルの背景クリック時にもモーダルを閉じる
  $("#dialog").click(function(event) {
	if (event.target === this) {
	  dialog.close(); // モーダルを閉じる
	  document.documentElement.removeAttribute("style");
	}
  });
  $("#dialog1").click(function(event) {
	if (event.target === this) {
	  dialog1.close(); // モーダルを閉じる
	  document.documentElement.removeAttribute("style");
	}
  });