/* from http://www.simonbattersby.com/blog/simple-jquery-image-crossfade/
Adapted to handle our img being inside of an a tag
*/
function cycleImages(){
	var $active = $('#cycler .active');// this is the img inside a
	//alert("active tagName: " + $active.prop("tagName"));
	//alert("active next tagName: " + $active.parent().next().find("img").prop("tagName"));
	// test can be for the (outer a tag)
	var $next = ($active.parent().next().length > 0) ? $active.parent().next().find("img") : $('#cycler img:first');
	$next.css('z-index',2);//move the next image up the pile
	$active.fadeOut(1500,function(){//fade out the top image
	$active.css('z-index',1).show().removeClass('active');//reset the z-index and unhide the image
	$next.css('z-index',3).addClass('active');//make the next image the top one
	});
}

$(document).ready(function(){
	// run every 7s
	setInterval('cycleImages()', 7000);
})

