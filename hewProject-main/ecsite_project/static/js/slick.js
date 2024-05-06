$('.slider').slick({
	infinite: true,//スライドをループさせるかどうか。初期値はtrue。
	slidesToShow: 1,//スライドを画面に3枚見せる
	slidesToScroll: 1,//1回のスクロールで3枚の写真を移動して見せる
	arrows: true,//左右の矢印あり
	prevArrow: '<div class="slick-prev"></div>',//矢印部分PreviewのHTMLを変更
	nextArrow: '<div class="slick-next"></div>',//矢印部分NextのHTMLを変更
	dots: false,//下部ドットナビゲーションの表示
	pauseOnFocus: false,//フォーカスで一時停止を無効
	pauseOnHover: false,//マウスホバーで一時停止を無効
	pauseOnDotsHover: false,//ドットナビゲーションをマウスホバーで一時停止を無効
});

$('.slider-for').slick({
	slidesToShow: 1,
	slidesToScroll: 1,
	fade: false,
	asNavFor: '.slider-nav',
	arrows: false,//左右の矢印あり
	// prevArrow: '<div class="slick-prev"></div>',//矢印部分PreviewのHTMLを変更
	// nextArrow: '<div class="slick-next"></div>',//矢印部分NextのHTMLを変更
  });
  $('.slider-nav').slick({
	slidesToShow: 4,
	slidesToScroll: 1,
	asNavFor: '.slider-for',
	dots: false,
	centerMode: false,
	focusOnSelect: true,
	arrows: false,
  });