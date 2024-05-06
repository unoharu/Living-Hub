const $tab = $(".tab-link");
const $tabContents = $(".text-contents");

$('.text-contents[id != "tab1"]').hide();

$tab.on("click", function () {
    const $currentTab = $(".current");

    $tabContents.hide();

    const idName = $(this).attr("href");

    $(idName).show();

    $currentTab.removeClass("current");

    $(this).addClass("current");

    return false;
});