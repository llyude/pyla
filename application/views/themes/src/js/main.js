/**
 * Fichier Js principal
 */
jQuery(document).ready(function($) {
    $(".button-collapse").sideNav();

    $('nav.main-nav ul.desktop li').mouseenter(function() {
        $("nav.main-nav ul.desktop li > div.subMenu").show();
    });
    $('nav.main-nav ul.desktop li').mouseleave(function(event) {
        $("nav.main-nav ul.desktop li > div.subMenu").hide();
    });

    //centerMenu("ul.desktop");
});


function centerMenu(menu){
    var ulWidth = $(menu).width();
    $(menu).attr("width", ulWidth);
}
