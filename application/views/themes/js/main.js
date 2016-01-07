(function($) {

/*
*  new_map
*
*  This function will render a Google Map onto the selected jQuery element
*
*  @type	function
*  @date	8/11/2013
*  @since	4.3.0
*
*  @param	$el (jQuery element)
*  @return	n/a
*/

function new_map( $el ) {

	// var
	var $markers = $el.find('.marker');



	// vars
	var args = {
		zoom		: 16,
		center		: new google.maps.LatLng(0, 0),
		mapTypeId	: google.maps.MapTypeId.ROADMAP
	};


	// create map
	var map = new google.maps.Map( $el[0], args);


	// add a markers reference
	map.markers = [];


	// add markers
	$markers.each(function(){

    	add_marker( $(this), map );

	});


	// center map
	center_map( map );


	// return
	return map;

}

/*
*  add_marker
*
*  This function will add a marker to the selected Google Map
*
*  @type	function
*  @date	8/11/2013
*  @since	4.3.0
*
*  @param	$marker (jQuery element)
*  @param	map (Google Map object)
*  @return	n/a
*/

function add_marker( $marker, map ) {

	// var
	var latlng = new google.maps.LatLng( $marker.attr('data-lat'), $marker.attr('data-lng') );


	// create marker
	var iconBase = '/app/themes/carel/img/';
	var marker = new google.maps.Marker({
		position	: latlng,
		map			: map,
		icon: iconBase + 'markerGMap.png'
	});


	// add to array
	map.markers.push( marker );

	// if marker contains HTML, add it to an infoWindow
	if( $marker.html() )
	{
		// create info window
		var infowindow = new google.maps.InfoWindow({
			content		: $marker.html()
		});

		// show info window when marker is clicked
		google.maps.event.addListener(marker, 'click', function() {

			infowindow.open( map, marker );

		});
	}

}

/*
*  center_map
*
*  This function will center the map, showing all markers attached to this map
*
*  @type	function
*  @date	8/11/2013
*  @since	4.3.0
*
*  @param	map (Google Map object)
*  @return	n/a
*/

function center_map( map ) {

	// vars
	var bounds = new google.maps.LatLngBounds();

	// loop through all markers and create bounds
	$.each( map.markers, function( i, marker ){

		var latlng = new google.maps.LatLng( marker.position.lat(), marker.position.lng() );

		bounds.extend( latlng );

	});

	// only 1 marker?
	if( map.markers.length == 1 )
	{
		// set center of map
	    map.setCenter( bounds.getCenter() );
	    map.setZoom( 16 );
	}
	else
	{
		// fit to bounds
		map.fitBounds( bounds );
	}

}

/*
*  document ready
*
*  This function will render each map when the document is ready (page has loaded)
*
*  @type	function
*  @date	8/11/2013
*  @since	5.0.0
*
*  @param	n/a
*  @return	n/a
*/
// global var
//var map = null;

$(document).ready(function(){

	$('.acf-map').each(function(){

		// create map
		map = new_map( $(this) );

	});

});

})(jQuery);

var map;

// This Carousel needs first and last Items identicals //
// to make an infinite loop effect//



var carousel = {
    wrapperCarousel : window.document.getElementById('bloc-carousel'),
    wrapperItems : window.document.getElementById('wrapper-items-carousel'),
    numberItems : window.document.querySelectorAll('#wrapper-items-carousel  .items-carousel').length,
    items : window.document.getElementsByClassName('items-carousel'),
    count : 0,
    setSizeItems : function(){
        this.wrapperItems.style.width = this.numberItems * 100 + "%"; // Set the wrapper-items-carousel width
    },
    slideLeft : function(){
        intervale = setInterval(carousel.autoSlide, 4000); // 1000 = 1 second
    },
    autoSlide : function(){
        if(carousel.count == (carousel.numberItems-1)){
            carousel.wrapperItems.style.left = "-" + carousel.count * 100 + "%";
            // Infinite Loop
            lastItem = window.setTimeout(function(){
                carousel.wrapperItems.style.left = 0; // Put wrapper-items-carousel at initial position
                carousel.wrapperItems.style.transition = "none"; // Disabled Transition effect
                infosCarousel.changeInfos(0); // Animation infos bloc carousel
                carousel.count = 1; // Set Count for the second Item
            }, 500);

        }else{
            carousel.wrapperItems.style.transition = "left 0.5s, position 0.5s"; // Enabled Transition effect
            carousel.wrapperItems.style.left = "-" + carousel.count * 100 + "%";
            infosCarousel.changeInfos(carousel.count);// Animation infos bloc carousel
            carousel.count++; // Count loop
        }
    },

    addCarouselListener : function(){
        window.addEventListener("resize", carousel.resizeCarousel, false); // Responsive
        carousel.wrapperCarousel.addEventListener("mouseenter", carousel.pauseHover, false); // Stop Loop carousel
        carousel.wrapperCarousel.addEventListener("mouseleave", carousel.slideLeft, false); // Reload Loop carousel

        var nextLink = window.document.getElementById('next');
        var prevLink = window.document.getElementById('prev');
        nextLink.addEventListener("click", carouselClickHandler , false);
        prevLink.addEventListener("click", carouselClickHandler , false);

    },
    pauseHover : function(){
        clearInterval(intervale); // Stop Loop carousel
    },
    resizeCarousel : function(){
        var currentViewportWidth; var newWidth; var newHeight;
        if (typeof window.innerWidth != 'undefined') {
                currentViewportWidth = window.innerWidth; // Get Viewport Width
            }
        // Apply only if the viewport width is
        // under its initial width

        if(currentViewportWidth < 2000 && currentViewportWidth > 800){
            newWidth = currentViewportWidth - 17; // viewport width minus scroll bar width
            newHeight = newWidth /2.7322;
        }else if(currentViewportWidth < 800){
            newWidth = 0;
            newHeight = 0;
        }else{ // Apply initial width in other cases
            newWidth = 2000;
            newHeight = 732;
        }
        carousel.wrapperCarousel.style.width = newWidth +"px";
        carousel.wrapperCarousel.style.height = newHeight +"px";
        for(i = 0; i < carousel.numberItems; i++){
            carousel.items[i].style.width = newWidth +"px";
        }
    },

};

function carouselClickHandler(e){

    var direction = this.id; // Get the current item
    var limit = carousel.numberItems - 2 ; // loop condition
    if (direction == "next") {
        if (carousel.count < limit) {
            carousel.count += 1;
        }else{
            carousel.count = 0;
        }
    }else if(direction == "prev"){
        if (carousel.count > 0) {
            carousel.count -= 1;
        }else{
            carousel.count = 0;
        }
    }
    // Modify item left position
    carousel.wrapperItems.style.left = "-" + carousel.count * 100 + "%";
    carousel.wrapperItems.style.transition = "left 0.5s, position 0.5s";
    infosCarousel.changeInfos(carousel.count); // Animation infos bloc carousel
}

var infosCarousel = {
    wrapperInfos : window.document.querySelectorAll('#wrapper-infos-items .infos-items'),
    changeInfos : function(actived){
        for(i = 0; i < infosCarousel.wrapperInfos.length; i++){
            if(actived == i){
                currentInfos = window.document.querySelectorAll('.active');
                for(j = 0; j < currentInfos.length; j++){
                    currentInfos[j].classList.remove("active"); // Remove All active classes
                }
                infosCarousel.wrapperInfos[i].classList.add("active"); // Add active class to the Info Box
            }
        }
    },
};

if (carousel.wrapperCarousel !== null){
	carousel.resizeCarousel();
	carousel.setSizeItems();
	carousel.slideLeft();
	carousel.addCarouselListener();
	//navCarousel.slideCommand();
}

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjZi1nb29nbGUtbWFwLmpzIiwiY2Fyb3VzZWwuanMiLCJtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkKSB7XHJcblxyXG4vKlxyXG4qICBuZXdfbWFwXHJcbipcclxuKiAgVGhpcyBmdW5jdGlvbiB3aWxsIHJlbmRlciBhIEdvb2dsZSBNYXAgb250byB0aGUgc2VsZWN0ZWQgalF1ZXJ5IGVsZW1lbnRcclxuKlxyXG4qICBAdHlwZVx0ZnVuY3Rpb25cclxuKiAgQGRhdGVcdDgvMTEvMjAxM1xyXG4qICBAc2luY2VcdDQuMy4wXHJcbipcclxuKiAgQHBhcmFtXHQkZWwgKGpRdWVyeSBlbGVtZW50KVxyXG4qICBAcmV0dXJuXHRuL2FcclxuKi9cclxuXHJcbmZ1bmN0aW9uIG5ld19tYXAoICRlbCApIHtcclxuXHJcblx0Ly8gdmFyXHJcblx0dmFyICRtYXJrZXJzID0gJGVsLmZpbmQoJy5tYXJrZXInKTtcclxuXHJcblxyXG5cclxuXHQvLyB2YXJzXHJcblx0dmFyIGFyZ3MgPSB7XHJcblx0XHR6b29tXHRcdDogMTYsXHJcblx0XHRjZW50ZXJcdFx0OiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDAsIDApLFxyXG5cdFx0bWFwVHlwZUlkXHQ6IGdvb2dsZS5tYXBzLk1hcFR5cGVJZC5ST0FETUFQXHJcblx0fTtcclxuXHJcblxyXG5cdC8vIGNyZWF0ZSBtYXBcclxuXHR2YXIgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcCggJGVsWzBdLCBhcmdzKTtcclxuXHJcblxyXG5cdC8vIGFkZCBhIG1hcmtlcnMgcmVmZXJlbmNlXHJcblx0bWFwLm1hcmtlcnMgPSBbXTtcclxuXHJcblxyXG5cdC8vIGFkZCBtYXJrZXJzXHJcblx0JG1hcmtlcnMuZWFjaChmdW5jdGlvbigpe1xyXG5cclxuICAgIFx0YWRkX21hcmtlciggJCh0aGlzKSwgbWFwICk7XHJcblxyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gY2VudGVyIG1hcFxyXG5cdGNlbnRlcl9tYXAoIG1hcCApO1xyXG5cclxuXHJcblx0Ly8gcmV0dXJuXHJcblx0cmV0dXJuIG1hcDtcclxuXHJcbn1cclxuXHJcbi8qXHJcbiogIGFkZF9tYXJrZXJcclxuKlxyXG4qICBUaGlzIGZ1bmN0aW9uIHdpbGwgYWRkIGEgbWFya2VyIHRvIHRoZSBzZWxlY3RlZCBHb29nbGUgTWFwXHJcbipcclxuKiAgQHR5cGVcdGZ1bmN0aW9uXHJcbiogIEBkYXRlXHQ4LzExLzIwMTNcclxuKiAgQHNpbmNlXHQ0LjMuMFxyXG4qXHJcbiogIEBwYXJhbVx0JG1hcmtlciAoalF1ZXJ5IGVsZW1lbnQpXHJcbiogIEBwYXJhbVx0bWFwIChHb29nbGUgTWFwIG9iamVjdClcclxuKiAgQHJldHVyblx0bi9hXHJcbiovXHJcblxyXG5mdW5jdGlvbiBhZGRfbWFya2VyKCAkbWFya2VyLCBtYXAgKSB7XHJcblxyXG5cdC8vIHZhclxyXG5cdHZhciBsYXRsbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKCAkbWFya2VyLmF0dHIoJ2RhdGEtbGF0JyksICRtYXJrZXIuYXR0cignZGF0YS1sbmcnKSApO1xyXG5cclxuXHJcblx0Ly8gY3JlYXRlIG1hcmtlclxyXG5cdHZhciBpY29uQmFzZSA9ICcvYXBwL3RoZW1lcy9jYXJlbC9pbWcvJztcclxuXHR2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcblx0XHRwb3NpdGlvblx0OiBsYXRsbmcsXHJcblx0XHRtYXBcdFx0XHQ6IG1hcCxcclxuXHRcdGljb246IGljb25CYXNlICsgJ21hcmtlckdNYXAucG5nJ1xyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gYWRkIHRvIGFycmF5XHJcblx0bWFwLm1hcmtlcnMucHVzaCggbWFya2VyICk7XHJcblxyXG5cdC8vIGlmIG1hcmtlciBjb250YWlucyBIVE1MLCBhZGQgaXQgdG8gYW4gaW5mb1dpbmRvd1xyXG5cdGlmKCAkbWFya2VyLmh0bWwoKSApXHJcblx0e1xyXG5cdFx0Ly8gY3JlYXRlIGluZm8gd2luZG93XHJcblx0XHR2YXIgaW5mb3dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHtcclxuXHRcdFx0Y29udGVudFx0XHQ6ICRtYXJrZXIuaHRtbCgpXHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBzaG93IGluZm8gd2luZG93IHdoZW4gbWFya2VyIGlzIGNsaWNrZWRcclxuXHRcdGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHRpbmZvd2luZG93Lm9wZW4oIG1hcCwgbWFya2VyICk7XHJcblxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxufVxyXG5cclxuLypcclxuKiAgY2VudGVyX21hcFxyXG4qXHJcbiogIFRoaXMgZnVuY3Rpb24gd2lsbCBjZW50ZXIgdGhlIG1hcCwgc2hvd2luZyBhbGwgbWFya2VycyBhdHRhY2hlZCB0byB0aGlzIG1hcFxyXG4qXHJcbiogIEB0eXBlXHRmdW5jdGlvblxyXG4qICBAZGF0ZVx0OC8xMS8yMDEzXHJcbiogIEBzaW5jZVx0NC4zLjBcclxuKlxyXG4qICBAcGFyYW1cdG1hcCAoR29vZ2xlIE1hcCBvYmplY3QpXHJcbiogIEByZXR1cm5cdG4vYVxyXG4qL1xyXG5cclxuZnVuY3Rpb24gY2VudGVyX21hcCggbWFwICkge1xyXG5cclxuXHQvLyB2YXJzXHJcblx0dmFyIGJvdW5kcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoKTtcclxuXHJcblx0Ly8gbG9vcCB0aHJvdWdoIGFsbCBtYXJrZXJzIGFuZCBjcmVhdGUgYm91bmRzXHJcblx0JC5lYWNoKCBtYXAubWFya2VycywgZnVuY3Rpb24oIGksIG1hcmtlciApe1xyXG5cclxuXHRcdHZhciBsYXRsbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKCBtYXJrZXIucG9zaXRpb24ubGF0KCksIG1hcmtlci5wb3NpdGlvbi5sbmcoKSApO1xyXG5cclxuXHRcdGJvdW5kcy5leHRlbmQoIGxhdGxuZyApO1xyXG5cclxuXHR9KTtcclxuXHJcblx0Ly8gb25seSAxIG1hcmtlcj9cclxuXHRpZiggbWFwLm1hcmtlcnMubGVuZ3RoID09IDEgKVxyXG5cdHtcclxuXHRcdC8vIHNldCBjZW50ZXIgb2YgbWFwXHJcblx0ICAgIG1hcC5zZXRDZW50ZXIoIGJvdW5kcy5nZXRDZW50ZXIoKSApO1xyXG5cdCAgICBtYXAuc2V0Wm9vbSggMTYgKTtcclxuXHR9XHJcblx0ZWxzZVxyXG5cdHtcclxuXHRcdC8vIGZpdCB0byBib3VuZHNcclxuXHRcdG1hcC5maXRCb3VuZHMoIGJvdW5kcyApO1xyXG5cdH1cclxuXHJcbn1cclxuXHJcbi8qXHJcbiogIGRvY3VtZW50IHJlYWR5XHJcbipcclxuKiAgVGhpcyBmdW5jdGlvbiB3aWxsIHJlbmRlciBlYWNoIG1hcCB3aGVuIHRoZSBkb2N1bWVudCBpcyByZWFkeSAocGFnZSBoYXMgbG9hZGVkKVxyXG4qXHJcbiogIEB0eXBlXHRmdW5jdGlvblxyXG4qICBAZGF0ZVx0OC8xMS8yMDEzXHJcbiogIEBzaW5jZVx0NS4wLjBcclxuKlxyXG4qICBAcGFyYW1cdG4vYVxyXG4qICBAcmV0dXJuXHRuL2FcclxuKi9cclxuLy8gZ2xvYmFsIHZhclxyXG4vL3ZhciBtYXAgPSBudWxsO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuXHJcblx0JCgnLmFjZi1tYXAnKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0Ly8gY3JlYXRlIG1hcFxyXG5cdFx0bWFwID0gbmV3X21hcCggJCh0aGlzKSApO1xyXG5cclxuXHR9KTtcclxuXHJcbn0pO1xyXG5cclxufSkoalF1ZXJ5KTtcclxuXHJcbnZhciBtYXA7XHJcbiIsIi8vIFRoaXMgQ2Fyb3VzZWwgbmVlZHMgZmlyc3QgYW5kIGxhc3QgSXRlbXMgaWRlbnRpY2FscyAvL1xuLy8gdG8gbWFrZSBhbiBpbmZpbml0ZSBsb29wIGVmZmVjdC8vXG5cblxuXG52YXIgY2Fyb3VzZWwgPSB7XG4gICAgd3JhcHBlckNhcm91c2VsIDogd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdibG9jLWNhcm91c2VsJyksXG4gICAgd3JhcHBlckl0ZW1zIDogd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cmFwcGVyLWl0ZW1zLWNhcm91c2VsJyksXG4gICAgbnVtYmVySXRlbXMgOiB3aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI3dyYXBwZXItaXRlbXMtY2Fyb3VzZWwgIC5pdGVtcy1jYXJvdXNlbCcpLmxlbmd0aCxcbiAgICBpdGVtcyA6IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpdGVtcy1jYXJvdXNlbCcpLFxuICAgIGNvdW50IDogMCxcbiAgICBzZXRTaXplSXRlbXMgOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLndyYXBwZXJJdGVtcy5zdHlsZS53aWR0aCA9IHRoaXMubnVtYmVySXRlbXMgKiAxMDAgKyBcIiVcIjsgLy8gU2V0IHRoZSB3cmFwcGVyLWl0ZW1zLWNhcm91c2VsIHdpZHRoXG4gICAgfSxcbiAgICBzbGlkZUxlZnQgOiBmdW5jdGlvbigpe1xuICAgICAgICBpbnRlcnZhbGUgPSBzZXRJbnRlcnZhbChjYXJvdXNlbC5hdXRvU2xpZGUsIDQwMDApOyAvLyAxMDAwID0gMSBzZWNvbmRcbiAgICB9LFxuICAgIGF1dG9TbGlkZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKGNhcm91c2VsLmNvdW50ID09IChjYXJvdXNlbC5udW1iZXJJdGVtcy0xKSl7XG4gICAgICAgICAgICBjYXJvdXNlbC53cmFwcGVySXRlbXMuc3R5bGUubGVmdCA9IFwiLVwiICsgY2Fyb3VzZWwuY291bnQgKiAxMDAgKyBcIiVcIjtcbiAgICAgICAgICAgIC8vIEluZmluaXRlIExvb3BcbiAgICAgICAgICAgIGxhc3RJdGVtID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBjYXJvdXNlbC53cmFwcGVySXRlbXMuc3R5bGUubGVmdCA9IDA7IC8vIFB1dCB3cmFwcGVyLWl0ZW1zLWNhcm91c2VsIGF0IGluaXRpYWwgcG9zaXRpb25cbiAgICAgICAgICAgICAgICBjYXJvdXNlbC53cmFwcGVySXRlbXMuc3R5bGUudHJhbnNpdGlvbiA9IFwibm9uZVwiOyAvLyBEaXNhYmxlZCBUcmFuc2l0aW9uIGVmZmVjdFxuICAgICAgICAgICAgICAgIGluZm9zQ2Fyb3VzZWwuY2hhbmdlSW5mb3MoMCk7IC8vIEFuaW1hdGlvbiBpbmZvcyBibG9jIGNhcm91c2VsXG4gICAgICAgICAgICAgICAgY2Fyb3VzZWwuY291bnQgPSAxOyAvLyBTZXQgQ291bnQgZm9yIHRoZSBzZWNvbmQgSXRlbVxuICAgICAgICAgICAgfSwgNTAwKTtcblxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGNhcm91c2VsLndyYXBwZXJJdGVtcy5zdHlsZS50cmFuc2l0aW9uID0gXCJsZWZ0IDAuNXMsIHBvc2l0aW9uIDAuNXNcIjsgLy8gRW5hYmxlZCBUcmFuc2l0aW9uIGVmZmVjdFxuICAgICAgICAgICAgY2Fyb3VzZWwud3JhcHBlckl0ZW1zLnN0eWxlLmxlZnQgPSBcIi1cIiArIGNhcm91c2VsLmNvdW50ICogMTAwICsgXCIlXCI7XG4gICAgICAgICAgICBpbmZvc0Nhcm91c2VsLmNoYW5nZUluZm9zKGNhcm91c2VsLmNvdW50KTsvLyBBbmltYXRpb24gaW5mb3MgYmxvYyBjYXJvdXNlbFxuICAgICAgICAgICAgY2Fyb3VzZWwuY291bnQrKzsgLy8gQ291bnQgbG9vcFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGFkZENhcm91c2VsTGlzdGVuZXIgOiBmdW5jdGlvbigpe1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBjYXJvdXNlbC5yZXNpemVDYXJvdXNlbCwgZmFsc2UpOyAvLyBSZXNwb25zaXZlXG4gICAgICAgIGNhcm91c2VsLndyYXBwZXJDYXJvdXNlbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCBjYXJvdXNlbC5wYXVzZUhvdmVyLCBmYWxzZSk7IC8vIFN0b3AgTG9vcCBjYXJvdXNlbFxuICAgICAgICBjYXJvdXNlbC53cmFwcGVyQ2Fyb3VzZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgY2Fyb3VzZWwuc2xpZGVMZWZ0LCBmYWxzZSk7IC8vIFJlbG9hZCBMb29wIGNhcm91c2VsXG5cbiAgICAgICAgdmFyIG5leHRMaW5rID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXh0Jyk7XG4gICAgICAgIHZhciBwcmV2TGluayA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJldicpO1xuICAgICAgICBuZXh0TGluay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2Fyb3VzZWxDbGlja0hhbmRsZXIgLCBmYWxzZSk7XG4gICAgICAgIHByZXZMaW5rLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjYXJvdXNlbENsaWNrSGFuZGxlciAsIGZhbHNlKTtcblxuICAgIH0sXG4gICAgcGF1c2VIb3ZlciA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxlKTsgLy8gU3RvcCBMb29wIGNhcm91c2VsXG4gICAgfSxcbiAgICByZXNpemVDYXJvdXNlbCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBjdXJyZW50Vmlld3BvcnRXaWR0aDsgdmFyIG5ld1dpZHRoOyB2YXIgbmV3SGVpZ2h0O1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5pbm5lcldpZHRoICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFZpZXdwb3J0V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDsgLy8gR2V0IFZpZXdwb3J0IFdpZHRoXG4gICAgICAgICAgICB9XG4gICAgICAgIC8vIEFwcGx5IG9ubHkgaWYgdGhlIHZpZXdwb3J0IHdpZHRoIGlzXG4gICAgICAgIC8vIHVuZGVyIGl0cyBpbml0aWFsIHdpZHRoXG5cbiAgICAgICAgaWYoY3VycmVudFZpZXdwb3J0V2lkdGggPCAyMDAwICYmIGN1cnJlbnRWaWV3cG9ydFdpZHRoID4gODAwKXtcbiAgICAgICAgICAgIG5ld1dpZHRoID0gY3VycmVudFZpZXdwb3J0V2lkdGggLSAxNzsgLy8gdmlld3BvcnQgd2lkdGggbWludXMgc2Nyb2xsIGJhciB3aWR0aFxuICAgICAgICAgICAgbmV3SGVpZ2h0ID0gbmV3V2lkdGggLzIuNzMyMjtcbiAgICAgICAgfWVsc2UgaWYoY3VycmVudFZpZXdwb3J0V2lkdGggPCA4MDApe1xuICAgICAgICAgICAgbmV3V2lkdGggPSAwO1xuICAgICAgICAgICAgbmV3SGVpZ2h0ID0gMDtcbiAgICAgICAgfWVsc2V7IC8vIEFwcGx5IGluaXRpYWwgd2lkdGggaW4gb3RoZXIgY2FzZXNcbiAgICAgICAgICAgIG5ld1dpZHRoID0gMjAwMDtcbiAgICAgICAgICAgIG5ld0hlaWdodCA9IDczMjtcbiAgICAgICAgfVxuICAgICAgICBjYXJvdXNlbC53cmFwcGVyQ2Fyb3VzZWwuc3R5bGUud2lkdGggPSBuZXdXaWR0aCArXCJweFwiO1xuICAgICAgICBjYXJvdXNlbC53cmFwcGVyQ2Fyb3VzZWwuc3R5bGUuaGVpZ2h0ID0gbmV3SGVpZ2h0ICtcInB4XCI7XG4gICAgICAgIGZvcihpID0gMDsgaSA8IGNhcm91c2VsLm51bWJlckl0ZW1zOyBpKyspe1xuICAgICAgICAgICAgY2Fyb3VzZWwuaXRlbXNbaV0uc3R5bGUud2lkdGggPSBuZXdXaWR0aCArXCJweFwiO1xuICAgICAgICB9XG4gICAgfSxcblxufTtcblxuZnVuY3Rpb24gY2Fyb3VzZWxDbGlja0hhbmRsZXIoZSl7XG5cbiAgICB2YXIgZGlyZWN0aW9uID0gdGhpcy5pZDsgLy8gR2V0IHRoZSBjdXJyZW50IGl0ZW1cbiAgICB2YXIgbGltaXQgPSBjYXJvdXNlbC5udW1iZXJJdGVtcyAtIDIgOyAvLyBsb29wIGNvbmRpdGlvblxuICAgIGlmIChkaXJlY3Rpb24gPT0gXCJuZXh0XCIpIHtcbiAgICAgICAgaWYgKGNhcm91c2VsLmNvdW50IDwgbGltaXQpIHtcbiAgICAgICAgICAgIGNhcm91c2VsLmNvdW50ICs9IDE7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgY2Fyb3VzZWwuY291bnQgPSAwO1xuICAgICAgICB9XG4gICAgfWVsc2UgaWYoZGlyZWN0aW9uID09IFwicHJldlwiKXtcbiAgICAgICAgaWYgKGNhcm91c2VsLmNvdW50ID4gMCkge1xuICAgICAgICAgICAgY2Fyb3VzZWwuY291bnQgLT0gMTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBjYXJvdXNlbC5jb3VudCA9IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTW9kaWZ5IGl0ZW0gbGVmdCBwb3NpdGlvblxuICAgIGNhcm91c2VsLndyYXBwZXJJdGVtcy5zdHlsZS5sZWZ0ID0gXCItXCIgKyBjYXJvdXNlbC5jb3VudCAqIDEwMCArIFwiJVwiO1xuICAgIGNhcm91c2VsLndyYXBwZXJJdGVtcy5zdHlsZS50cmFuc2l0aW9uID0gXCJsZWZ0IDAuNXMsIHBvc2l0aW9uIDAuNXNcIjtcbiAgICBpbmZvc0Nhcm91c2VsLmNoYW5nZUluZm9zKGNhcm91c2VsLmNvdW50KTsgLy8gQW5pbWF0aW9uIGluZm9zIGJsb2MgY2Fyb3VzZWxcbn1cblxudmFyIGluZm9zQ2Fyb3VzZWwgPSB7XG4gICAgd3JhcHBlckluZm9zIDogd2luZG93LmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyN3cmFwcGVyLWluZm9zLWl0ZW1zIC5pbmZvcy1pdGVtcycpLFxuICAgIGNoYW5nZUluZm9zIDogZnVuY3Rpb24oYWN0aXZlZCl7XG4gICAgICAgIGZvcihpID0gMDsgaSA8IGluZm9zQ2Fyb3VzZWwud3JhcHBlckluZm9zLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGlmKGFjdGl2ZWQgPT0gaSl7XG4gICAgICAgICAgICAgICAgY3VycmVudEluZm9zID0gd2luZG93LmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICBmb3IoaiA9IDA7IGogPCBjdXJyZW50SW5mb3MubGVuZ3RoOyBqKyspe1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5mb3Nbal0uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTsgLy8gUmVtb3ZlIEFsbCBhY3RpdmUgY2xhc3Nlc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbmZvc0Nhcm91c2VsLndyYXBwZXJJbmZvc1tpXS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpOyAvLyBBZGQgYWN0aXZlIGNsYXNzIHRvIHRoZSBJbmZvIEJveFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbn07XG5cbmlmIChjYXJvdXNlbC53cmFwcGVyQ2Fyb3VzZWwgIT09IG51bGwpe1xuXHRjYXJvdXNlbC5yZXNpemVDYXJvdXNlbCgpO1xuXHRjYXJvdXNlbC5zZXRTaXplSXRlbXMoKTtcblx0Y2Fyb3VzZWwuc2xpZGVMZWZ0KCk7XG5cdGNhcm91c2VsLmFkZENhcm91c2VsTGlzdGVuZXIoKTtcblx0Ly9uYXZDYXJvdXNlbC5zbGlkZUNvbW1hbmQoKTtcbn1cbiIsIi8qKlxyXG4gKiBGaWNoaWVyIEpzIHByaW5jaXBhbFxyXG4gKi9cclxualF1ZXJ5KGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigkKSB7XHJcbiAgICAkKFwiLmJ1dHRvbi1jb2xsYXBzZVwiKS5zaWRlTmF2KCk7XHJcblxyXG4gICAgJCgnbmF2Lm1haW4tbmF2IHVsLmRlc2t0b3AgbGknKS5tb3VzZWVudGVyKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoXCJuYXYubWFpbi1uYXYgdWwuZGVza3RvcCBsaSA+IGRpdi5zdWJNZW51XCIpLnNob3coKTtcclxuICAgIH0pO1xyXG4gICAgJCgnbmF2Lm1haW4tbmF2IHVsLmRlc2t0b3AgbGknKS5tb3VzZWxlYXZlKGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgJChcIm5hdi5tYWluLW5hdiB1bC5kZXNrdG9wIGxpID4gZGl2LnN1Yk1lbnVcIikuaGlkZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy9jZW50ZXJNZW51KFwidWwuZGVza3RvcFwiKTtcclxufSk7XHJcblxyXG5cclxuZnVuY3Rpb24gY2VudGVyTWVudShtZW51KXtcclxuICAgIHZhciB1bFdpZHRoID0gJChtZW51KS53aWR0aCgpO1xyXG4gICAgJChtZW51KS5hdHRyKFwid2lkdGhcIiwgdWxXaWR0aCk7XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
