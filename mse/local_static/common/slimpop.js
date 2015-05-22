
/**
 * slimpop.js
 * 
 * adpted from arts and crafts
 * rewritten to use jQuery - Don 6/1/2014
 * currently depends on divs hardwired into the calling page:
 * <div id="lbOverlay" class="hidden" onclick="javascript:hideOverlay(event);"></div>
 * <div id="pop_box" class="hidden"></div>
 * </body>
 */
var ContentDiv;
var WrapperDiv;
//var flashIsPlaying = false;

/* simple hide called by Close link in box, and by hideOverlay, below 
* arts had code to stop flash audio becuse there was a flash audio
* fall-through -- omitted here 
*/
function hideBox() {
	// assume that since window is open ContentDiv must already be defined
	// test for existence of audioPlayer element 
	//if (document.getElementById("audioPlayer")) { 
	//	document.getElementById("audioPlayer").pause();			
	//}		
		
	// empty content div so it won't briefly show old content on new pop
	ContentDiv.html = " ";	
	// hide box.. 
	ContentDiv.removeClass().addClass('hidden');
	// ..and darkening overlay
	OverlayDiv.removeClass().addClass('hidden');
}

function docText(shortName, pageSuffix) {
	//alert("in artifactView");
	ContentDiv = $('#doc_wrapper');
	var theURL = "/documents/" + shortName + "/" + pageSuffix + "/";
	getURL(theURL);
}

function docPage(shortName, pageSuffix, docMode) {
	ContentDiv = $('#doc_wrapper');
	var theURL = "/documents/" + shortName + "/" + pageSuffix + "/" + docMode + "/";
	getURL(theURL);
}

function artifactView(shortName, pageSuffix) {
	ContentDiv = $('#view_wrapper');
	var theURL = "/artifacts/" + shortName + "/" + pageSuffix + "/";
	getURL(theURL);
}

// replace whole slim box rather than just the image and caption
// ajax within ajax created an orphan window
function slideView(shortName, slide_num) { // direction is next or prev
	ContentDiv = $('#ajax_wrapper'); // slide_wrapper
	var theURL = "/connections/slideshow/slide/" + shortName + "/" + slide_num + "/";
	getURL(theURL);
}

function interView(shortName, questionNum) {
	ContentDiv = $('#inter_view_wrapper');
	var theURL = "/scholars/interviews/" + shortName + "/" + questionNum + "/";
	getURL(theURL);
}

function attractView(slide_num) { // direction is next or prev
	ContentDiv = $('.loop'); 
	var theURL = "/connections/attractloop/" + slide_num + "/";
	getURL(theURL);
}


/* adapted from arts. slimSlide, featureSlide, artifactVew deleted from arts copy
*  optional page_num param added to accommocate large chapter images
*/
function popBox(resourceType, connectionType, shortName, page_num) {  
	ContentDiv = $('#ajax_wrapper');
	//WrapperDiv = document.getElementById("wrapper");
	OverlayDiv = $('#lbOverlay');
	// unhide overlay
	OverlayDiv.removeClass().addClass('unhidden');
	// unhide contentDiv
	/* 
	Condition for artifacts/docs in slimbox
	params will be: artifacts/documents, slim, shortName
	*/
	if (connectionType=='slim') {
		ContentDiv.removeClass().addClass('pop_collection'); 
	} else if (connectionType=='slideshow' || connectionType=='storylarge' || connectionType=='journal') {
		ContentDiv.removeClass().addClass('pop_collection');
	} else {
		ContentDiv.removeClass().addClass('pop_connection');
	}
	// no condition
	//ContentDiv.className="pop_connection";
	
	// create url
	var theURL = "/" + resourceType + "/" + connectionType + "/" + shortName  + "/";
    if (typeof(page_num) != "undefined" ) { // add param only if it is passed in
        theURL += page_num + "/";
    }
	
	getURL(theURL);
	
}

// new jQuery approach
function getURL(theURL) {
	ContentDiv.load(theURL);
}

// for attract loop
function fadeURL(theURL) {
	ContentDiv.fadeOut(2000, function(){
	    // We're in the callback of the fadeOut()
	    $(this).load(theURL, 'data', function(){
	        // We're in the callback of the load()
	        $(this).fadeIn(2000);
	    });
	});
	/*
	ContentDiv.fadeOut('slow') // make sure #target starts hidden
	.load(theURL, function() {
		$(this).fadeIn(1000); // when page.html has loaded, fade #target in
	});
	*/
}

$(document).ready(function(){
	$('#lbOverlay').click(function(event){
		//alert('in new overlay hide');
		hideBox();
	});
});
