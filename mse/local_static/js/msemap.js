/* ===========================================================
Shared map variables
 ===========================================================*/
var map;
//var _beginDate	= null;
// line segment or marker layers
var segMarkLayers = [[],[],[],[]]; 
var sidebarLayers = ['year of dates', 'year of dates', 'year of dates', 'year of dates']; 
//var markerNum;
var marker;
var infoWindow;
// for animating markers on
var droppedCount = 0;
var droppedInterval = null;
// multi-voyage
// var fusionTableId ='126iRdCefQcPOdBg_nLXcAvxTnkyPMNBsLDMdheI'; // declare in HTML head
var fusionTableId = '';
// for overlays
var overLayers = [[],[],[],[]]; 
// temp for overlay
var whaleGround = [[[0],[-79]],[[0],[-76]],[[-5],[-76]],[[-5],[-79]]];
var countingOil = false;

/* ===========================================================
Story variables
 ===========================================================*/

/* ===========================================================
Logbook Voyage variables
 ===========================================================*/
var activeEventTypeIndex = 0; // store globaly for later year additions
var activeYearLayers = [];
var activeVoyageLayers = [];
var EVENT_ICON_NAMES = ["none", "kill", "spot", "kill-spot", "gam", "na-5", "spot-gam", "kill-spot-gam", "weather", "kill-weather", "spot-weather", "kill-spot-weather", "gam-weather", "na-13", "spot-gam-weather", "kill-spot-gam-weather", "land", "na-17", "spot-land", "kill-spot-land", "gam-land", "na-21", "spot-gam-land", "kill-spot-gam-land", "weather-land", "na-25", "spot-weather-land", "kill-spot-weather-land", "gam-weather-land", "na-29", "spot-gam-weather-land", "kill-spot-gam-weather-land"];
var EVENT_TYPE_FIELDS = ['all', 'struck_code', 'spotted_code', 'gam_code', 'weather_code', 'anchor_code'];
var EVENT_TYPE_TITLES	= ['All', 'Whales Caught', 'Whales Spotted', 'Gam with Another Ship', 'Foul Weather', 'Ship in Port']; // for no data for year message
var layerYears		= []; // , '1843', '1844' will come from django
var numVoyages		= 0;  // for compare
var layerColors		= []; // for compare
var rows;
// possibly temp for compare
//var coorinateLayers = [[],[],[],[]]; 
//var pathLayers = []; 
var defaultSegLength = 10;
var defaultSegSpeed = 80;
var short_name;
//var render_in_progress = false;

/* ===========================================================
start
===========================================================*/


// instead of body onload
$(document).ready(function() {
	// use type param to chose which handler init
	initialize();
	if (map_params.map_type === 'Voyage') {
		init_voyage();		
	} else if (map_params.map_type === 'Story') {
		init_story();
	} else if (map_params.map_type === 'Compare') {
		init_compare();
	} else {
		alert('no valid map type received');
	}
});

/* ===========================================================
Shared by all
===========================================================*/
// I think visualization was needed when we were using fusion table layers directly
// new since 7: https://developers.google.com/fusiontables/docs/samples/custom_markers
//google.load('visualization', '1');

/* called once to, well, initialize */
function initialize() {
	// set variables
	// map params defined in HTML header

	// fusionTableId = map_params.fusionTableId;

	// voyageId will be intialized by init_voyage
	// var voyageId = map_params.voyageid;
	
	// make and place the map
	var latlng = new google.maps.LatLng(map_params.init_location[0], map_params.init_location[1]);
	var mapOptions = {
		zoom: map_params.init_location[2],
		center: latlng,
		mapTypeControl: true,
		mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
		navigationControl: true,
		navigationControlOptions: {style: google.maps.NavigationControlStyle.DEFAULT},
		streetViewControl: false,
		mapTypeId: google.maps.MapTypeId.SATELLITE
    };
	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);	
	// end map itself
	// init overlays which apply to all map types
	addOverlayHandlers(document.overlay_controls);
	short_name = map_params.short_name;		
}

/* ===========================================================
Shared by Voyage and Story
===========================================================*/

/**
* @method writeSidebar
*/
function writeSidebar(mapType) {
	var side_bar_html = "";
	for (var i = 0; i < activeYearLayers.length; i++) {
		if (activeYearLayers[i]) {
			side_bar_html += sidebarLayers[i];
		} // endif		
	} // end for	
    //document.getElementById("side_bar").innerHTML = side_bar_html;
	if (mapType === 'story') {
		$('#story_nav').html(side_bar_html);				
	} else {
		$('#side_bar').html(side_bar_html);		
	}
}

/**
* Loops through rows of a year layer (query) calling createVoyageMarker (or other) for each.
* @method dropMarkers
* @param {Boolean} isFullReplot whether or not to call prepVoyageMarker for the next layer
* @param {int} yearLayerIndex Which layer are we working on
* @param {String} mapType - Voyage, Story, Compare
* @param {String} voyageId - needed for setInterval for yoyage, story can pass dummy
* (compare doen't drop markers, makes lines)
* called by: startVoyageMarkerDisplay and prepChapterMarkers
*/
function dropMarkers(isFullReplot, yearLayerIndex, mapType, voyageId) {
	// Set marker animation speed. 40 was the "original" speed
	// redraws (isFullReplot) should be faster
	if (isFullReplot) {
		var markerSpeed = 5;
	} else {
		var markerSpeed = 20;
	}
	// test for end of markers
	if(droppedCount === rows.length){ // rows.length
		clearInterval(droppedInterval);

		// "close sidebar" placed here to make sure its after loop is completed
		// close the sidebar ordered list
		sidebarLayers[yearLayerIndex] += '</ol>';
		// wait until one layer is done before starting next in replotYearsEventType
		// alert('just finised in dropMarkers');
		// increment and repeat if isFullReplot and we're not at the end of activeYearLayers
		yearLayerIndex++;
		if (isFullReplot) { // we're replotting based on selected event type
			if (yearLayerIndex < activeYearLayers.length) { // there's more in this redraw
				replotYearsEventType(activeEventTypeIndex, yearLayerIndex, voyageId);				
			} else { // we're done with redraw
				writeSidebar(mapType);
			}
		} else { // we just drew single, done
			writeSidebar(mapType);
			// set global that we're done rendering -- ok to start on subsquent click on a year
			// render_in_progress = false;
			// now that we'er done rendering, reset any diabled controls
			if (mapType=="voyage") {
				enableControls();
			}
		}
	    return;
	}
	else if(droppedInterval === null) {
		// This creates the loop, setInterval calls dropMarkers again and again.
		// setInterval syntax: (function-to-call, milliseconds-time, arg, arg) 
		// This is a built-in JavaScript function
	    droppedInterval = setInterval(dropMarkers, markerSpeed, isFullReplot, yearLayerIndex, mapType, voyageId);
	}
	var row = rows[droppedCount++];
	// need to refactor this making use of JS functions as objects
	if (mapType === 'voyage') {
		// rows length enables calculation of zIndex for numberd markers
		createVoyageMarker(yearLayerIndex, row);	
	} else if(mapType === 'story'){
		createChapterMarker(yearLayerIndex, row, rows.length);
	}
}

/* ===========================================================
Shared by voyages and compare
===========================================================*/

function clearLayer(yearLayerIndex) {
	// only for voyages
	if(infoWindow) {
      infoWindow.close();
    }
	// for compare, in case clear is called while line is still drawing
	//droppedInterval = null;
	// iterate over all of the markers in a given layer
	for (var i = 0; i < segMarkLayers[yearLayerIndex].length; i++ ) {
		// close any info window that might be open
		// alert("marker[i]: " + segMarkLayers[yearLayerIndex][i].marker);
    	// segMarkLayers[yearLayerIndex][i].marker.infowindow.close();
    	segMarkLayers[yearLayerIndex][i].setMap(null);
	}
}

/**
* When animating path we don't want user to change anything else
*/
function disableControls() { // voyageLayerIndex
	$( "[type=checkbox]" ).attr("disabled", true);
	$( "[type=radio]" ).attr("disabled", true);
}

function enableControls() {
	$( "[type=checkbox]" ).attr("disabled", false);
	$( "[type=radio]" ).attr("disabled", false);
}


/* ===========================================================
Overlays
Experimental, not implemented
===========================================================*/
// patterned after addCompareHandlers
// separate loop for grounds, currents? or just have a number of overlays?
function addOverlayHandlers(overlayform) {	
	for (var k=0; k < 1; k++) { 
	    (function(k) {
			overlayform.grounds.onclick = function() { 
				if (this.checked) {
					addGround(k);
					//alert('Activate grounds ');
				} else { // unchecked
					clearOverLayer(k);
					//alert('deactivate grounds ');
				}
			} 
	    })(k);
		//alert("j: " + j + "element value: " + overlayform.year_chosen[j].value);
	} // end for
} 


// temp start to drawing fills
// may be many pieces to the total overlay
// look again at compare line segements for handline multiple
function addGround(overlayIndex) { // rows & dropped count global
	// kml approach
	// test KML layer
	var myKmlOptions = {
		preserveViewport: true
	}
	var ctaLayer = new google.maps.KmlLayer('http://olc.digitalgizmo.com/model/maps/scripts/testground2.kml', myKmlOptions
	); //klayer33.kml
	ctaLayer.setMap(map);
	// store ref for clearance
	overLayers[overlayIndex].push(ctaLayer);
}	

// temp start to drawing fills, lines
function addCurrent(overlayIndex) { // rows & dropped count global
	// generate google map LatLng from the lat and long cols.
	var segCoords = [];	
	
	for (var k = 0; k < 4; k++ ) {
		// add to array
	    segCoords.push(new google.maps.LatLng(whaleGround[k][0], whaleGround[k][1]));			

	}

	// draw line for each seg?
	var groundSeg = new google.maps.Polyline({
		path: segCoords,
		geodesic: false,
		strokeColor: '#' + 'FF5544', // layerColors[yearLayerIndex]
		strokeOpacity: 1.0,
		strokeWeight: 2
	});
	groundSeg.setMap(map);
	// push
	overLayers[overlayIndex].push(pathLayerSeg);
}	
/*
*
*/
function clearOverLayer(overlayIndex) {
	// iterate over all of the pieces in a given overlay
	for (var i = 0; i < overLayers[overlayIndex].length; i++ ) {
		// close any info window that might be open
		// alert("marker[i]: " + segMarkLayers[yearLayerIndex][i].marker);
    	// segMarkLayers[yearLayerIndex][i].marker.infowindow.close();
    	overLayers[overlayIndex][i].setMap(null);
	}
}


/* ===========================================================
Story maps
===========================================================*/
function init_story() {
	activeYearLayers[0] = true;	
	// only param, isFullReplot, is false, i.e. just draw this single layer
	prepChapterMarkers(0, false);
}


/**
* story scratch. 
* Also initializes marker and sidebar arrays.
* @function prepChapterMarkers 
* assume only one layer, so hardwire to yearLayerIndex 0
*/
function prepChapterMarkers(yearLayerIndex, isFullReplot) {
	// (re)initialize
	droppedCount	= 0;
	droppedInterval = null;
	
	// place Rendering message for this layer while it is doing so
	sidebarLayers[0] = "<h3>" + "temp capters" + "</h3><ol class='chapters'><li>Thinking...</li></ol>";
	
	writeSidebar('story');    
	//alert('about to prepChapterMarkers');
	
	
	// initialize this sidebar layer
	sidebarLayers[0] = "<ol class='chapters'>";
	// initialize markerLayer array
	segMarkLayers[yearLayerIndex] = [];
	infoWindow = new google.maps.InfoWindow();
	
	// instead of query we have our temp capter array, 
	// chap_titles[]


	// Send the JSONP request using jQuery
	//$.ajax({
		// get text array/list from django?
	//});
	//rows = chapters['rows'];
	rows = chap_json;
	// chap_json defined in story.html
	//var temp_data = chap_json[0]["fields"]["title"];
	//alert('rows length: ' + rows.length);
    
	// test for success on data
	if (2 === 3) {
		alert('no data');
	} else {
		// 2nd param is yearLayerIndex
		dropMarkers(isFullReplot, 0, 'story', 'dummyVoyageId');
	}
}

/**
* Create single marker from fusion row. Add date to sidebar.
* @method createVoyageMarker
* @param {int} yearLayerIndex Which layer are we building
* @param {array} row Result set from query
*/
function createChapterMarker(yearLayerIndex, row, rows_length) {
	//alert('chapter marker');
	// establish marker number 
	// starts off at 0, but length is already one more (get's us to first being 1)
	var markerNum = segMarkLayers[yearLayerIndex].length; 
	// generate google map LatLng from the lat and long cols.	
	var coordinate = new google.maps.LatLng(row["fields"]["latitude"], row["fields"]["longitude"]);
	
	//var temp_data = chap_json[0]["fields"]["title"];
	// create image for marker in order to specify anchor that take drop shadow into account
	var image = {
	    url: '/static/maps/images/num_markers/story_marker_' + row["fields"]["chap_num"] + '.png',
	    // This marker is 20 pixels wide by 32 pixels tall.
	    size: new google.maps.Size(26, 26),
	    // The origin for this image is 0,0.
	    origin: new google.maps.Point(0,0),
	    // The anchor for this image is the base of the flagpole at 0,32.
	    anchor: new google.maps.Point(13, 4)
	  };
	
	marker = new google.maps.Marker({
		map: map,
		position: coordinate,
		// invert the zIndex so that early chapter is on top of later
		zIndex: rows_length - markerNum,
		//icon: new google.maps.MarkerImage('/static/maps/images/num_markers/story_marker_' + row["fields"]["chap_num"] + '.png')
		icon: image
	});
	// save morker objects for links from side_bar
	// also save for clearing. 
    segMarkLayers[yearLayerIndex].push(marker);	
	// ===================================
	// create infowindow
	google.maps.event.addListener(marker, 'click', function(event) {
		// set zoom as well as re-position
		// any way to make this conditional so that clickFromSide does not set zoom?
		map.setZoom(row["fields"]["zoom_level"]);
		infoWindow.setPosition(coordinate);
		// fields: [2]chapNum, [3]location, [4]date, [5]title, [6]narrative
		// short_name defined in scriptlet in params in story template
		var iwHtml = ['<div id="infowindow">'];
		iwHtml.push(' <header><h4>Chapter ' + row["fields"]["chap_num"] + '</h4></header> ');
		iwHtml.push(' <section><h2>' + row["fields"]["title"] + '</h2> ');
		iwHtml.push(' <p  class="date">' + row["fields"]["date"] + '; ' + row["fields"]["location"] + '</p>');
		
		if (row["fields"]["has_image"]){
			iwHtml.push(' <img class="story" src="/static/maps/chapics/' + short_name + '_' + row["fields"]["chap_num"] + '.jpg" > ');
			iwHtml.push('  <p class="credit">' + row["fields"]["caption"] + 
			'<a href="javascript:popBox(&apos;maps&apos; ,&apos;storylarge&apos; ,&apos;' + short_name + '&apos; ,&apos;' + row["fields"]["chap_num"] + '&apos;)">View larger image</a></p>');
		}
		
		iwHtml.push(' <div class="log_entry">' + row["fields"]["narrative"] + '</div>');
		
		// Next and Previous links
		iwHtml.push('<div class="infonav">');
		if(markerNum < (segMarkLayers[yearLayerIndex].length - 1)) {
			iwHtml.push('<a href="javascript:openInfoFromSide(' +
			yearLayerIndex + ', ' + (markerNum + 1) + ')"> &nbsp; next &rsaquo;</a> ');			
		}
		if(markerNum > 0) {
			iwHtml.push('<a href="javascript:openInfoFromSide(' +
			yearLayerIndex + ', ' + (markerNum - 1) + ')"> &lsaquo; previous &nbsp; </a> ');			
		}
		iwHtml.push('</div>');		
		iwHtml.push('</section></div>'); // div 
		
		infoWindow.setContent(iwHtml.join(''));
		
		infoWindow.open(map);
	});
	
	// ==========================
	// add sidebar links	
	// we used to push another entry onto side_bar_html directly here.
	// but now we're adding it to the approprate sidebar array element   
	sidebarLayers[yearLayerIndex] += '<li>'  + row["fields"]["chap_num"] + '. ' + row["fields"]["date"] + ' - <a href="javascript:openInfoFromSide(' +
	yearLayerIndex + ', ' + (segMarkLayers[yearLayerIndex].length-1) +
	 ')">' + row["fields"]["title"] + '</a> </li>';	   			
}

/* ===========================================================
Comparison map
===========================================================*/
/*
The compare feature is base on a special GeoMap named "compare" has FusionTableId
that points to table with different structure. compare_2dj
Two ways to get to the comparisson map
1. From an active map, say the Morgan. This will automatically plot the map you're
coming from, in this case the Morgan, onto the compare map.
- uses the FusionTableID from this starting-point map
2. From the Comparisson page -- path is initiated by the checkbox.
- class "item_chosen" initiates js
- map chose is identified by id? or value?
*/

function init_compare() {
	// compareLayerIDs = compare_params.layerIDs;
	numVoyages = compare_params.numVoyages; 
	layerColors = compare_params.layerColors;
	// startMapIndex = compare_params.startMapIndex; ??
	startLayerIndex = compare_params.startLayerIndex;
	startMapVoyageId = compare_params.startMapVoyageId;
	
	addCompareHandlers(document.map_controls);
	
	// if startLayerIndex is valid, 0 or greater, then plot that "calling" layer
	// if(startMapIndex > -1){
	if(startLayerIndex > -1){
		addCompareLayer(startLayerIndex, startMapVoyageId);
		//$('form[name="map_controls"] input.index(startMapIndex)').prop('checked', true);	
		$('ul.compare_list input').eq(startLayerIndex).prop('checked', true);	
	}
	// init voyage call set date layer which initializes active layer
	//activeYearLayers[0] = true;	
	//prepComparePath();
}

// patterned after addVoyageHandlers
function addCompareHandlers(controlsform) {	
	// for (var j=0; j < compareLayerIDs.length; j++) {
	for (var j=0; j < numVoyages; j++) {
	    (function(j) {
			controlsform.item_chosen[j].onclick = function() { 
				if (this.checked) {
					// console.log(" -- item_chosen.compare_voyage_id: " + 
						// controlsform.item_chosen[j].value);
					// j is layer index, value is voyage id
					addCompareLayer(j, controlsform.item_chosen[j].value); 
				} else { // unchecked
					clearLayer(j);
					// alert('deactivate voyage layer: ' + j);
				}
			} 
	    })(j);
		//alert("j: " + j + "element value: " + controlsform.year_chosen[j].value);
	}
} 

/* called add a voyage path */
function addCompareLayer(voyageLayerIndex, voyageId) {
	activeYearLayers[voyageLayerIndex] = true;	
	// 3rd param, isFullReplot, is false, i.e. just draw this single layer
	// only needed by voyages, not compare
	console.log(" -- prepComparePath(voyageLayerIndex, voyageId, false): " +
		voyageLayerIndex +", " + voyageId);
	prepComparePath(voyageLayerIndex, voyageId, false);
}

/* helper for where clause
* voyageID is the legacy name, now in Fusion tables, for compare_geomap_id which
is in maps.Compare voyage -- a child list only under the special "compare" geomap.
(compare_geomap_id used to be called voyage_id)
The compareLayerIDs list is populated, via HTML and view, from the Comparevoyage list in the 
compare geomap.
function getCompareClause(voyageLayerIndex) {
	var whereClause = " WHERE 'voyageID' = " + compareLayerIDs[voyageLayerIndex] ; // + "'"
	return whereClause;
}
*/

/**
* story scratch. 
* Also initializes marker and sidebar arrays.
* @function prepCompare 
* assume only one layer, so hardwire to voyageLayerIndex 0
*/
function prepComparePath(voyageLayerIndex, voyageId) {
	// (re)initialize
	droppedCount	= 0;
	droppedInterval = null;
	
	// initialize markerLayer array
	segMarkLayers[voyageLayerIndex] = [];
	
	var url = '/mapdata/voyage/compare/' + voyageId;
	// 2nd param, false, is for isFullReplot -- relevant for Voyage, but not Compare
	getDataAjax(url, false, voyageLayerIndex, 'voyageId n/a for compare', startCompareLineDisplay);
	// rows global is now set
}

/**
* startCompareLineDisplay
* @global - rows defined and set globally
* @param isFullReplot along for the ride - to remain compatible with Voyage code
* @param voyage along for the ride - to remain compatible with Voyage code
*/
function startCompareLineDisplay(isFullReplot, voyageLayerIndex, voyageId)	{
	//alert('startCompareLineDisplay, voyageLayerIndex: ' + voyageLayerIndex);
	// we already tested for error message, but here we test for undefined
	// again for the case where this is a legit empty layer.
	if (typeof rows === "undefined"){
		alert("no results found for this voyage ID.")
	} else { // we have rows to work with
		// disable checkboxes during draw
		disableControls();
		// pass on isFullReplot (false means draw single layer)
		drawCompareLines(voyageLayerIndex, voyageId);
	}
}

/**
* Recursive timer to animate line segments
* @method drawCompareLines
* @param {voyageLayerIndex} which layer are we building
*/
function drawCompareLines(voyageLayerIndex, voyageId) {
	// must be a better place for this
	var markerSpeed = defaultSegSpeed;
	// test for end of markers
	//alert('above if - droppedCount: ' + droppedCount + ' rows.length: ' + rows.length);
	if(droppedCount + defaultSegLength >= rows.length){ 
		// stop timer
		clearInterval(droppedInterval);
		// draw last seg, custom length
		//alert('in if droppedCount: ' + droppedCount + ' rows.length: ' + rows.length);
		addLineSegment(voyageLayerIndex, rows.length - droppedCount);	
		// re-enable controls
		enableControls();
		
	} else if(droppedInterval === null) { // first time called - init
		// this creates the loop, setInterval call dropMarkers again and again
		// setInterval syntax: (function-to-call, milliseconds-time, arg, arg)
	    droppedInterval = setInterval(drawCompareLines, markerSpeed, voyageLayerIndex);
		// draw first segment
		addLineSegment(voyageLayerIndex, defaultSegLength);
	} else {
		// add line segement
		// rows is already global
		addLineSegment(voyageLayerIndex, defaultSegLength);		
	}
}

function addLineSegment(voyageLayerIndex, segLength) { // rows & dropped count global
	// generate google map LatLng from the lat and long cols.
	var segCoords = [];	
	
	for (var k = droppedCount; k < droppedCount + segLength +1; k++ ) {
		// test (sometimes last row is blank)
		if (rows[k] != undefined) {
			// add to array
		    segCoords.push(new google.maps.LatLng(rows[k].lat, rows[k].lon));			
		}	
	}

	// draw line for each seg?
	var pathLayerSeg = new google.maps.Polyline({
		path: segCoords,
		geodesic: false,
		strokeColor: '#' + layerColors[voyageLayerIndex],
		strokeOpacity: 1.0,
		strokeWeight: 2
	});
	pathLayerSeg.setMap(map);
	// push
	segMarkLayers[voyageLayerIndex].push(pathLayerSeg);
	droppedCount+= segLength;
}	

/* ===========================================================
Voyage maps
===========================================================*/
function init_voyage() {
	// map params defined in HTML header
	layerYears = map_params.layerYears;
	var voyageId = map_params.voyageid;
	log_link_type = map_params.log_link_type;
	// python/django booleans don't pass directly to Javascript
	for (var i=0; i < layerYears.length; i++) {
		activeYearLayers[i] = false;
	}
	// probably add voyageid param
	addVoyageHandlers(document.map_controls, voyageId);
	// render first year
	console.log(" -- about to add date layer from init, two params");
	addDateLayer(0, voyageId); 
	// check first year checkbox
	$('div.map-controls--years input:first').prop('checked', true);	
}

/**
* addVoyageHandlers
* @controlsform -- dom element that has checkboxes
* @voyageId
* Register logbook event type radio buttons -- e.g. Caught, Spotted, etc.
* Also register year range checkboxes.
* Asigning functions in a loop requires "closure".
* ref: http://stackoverflow.com/questions/6487366/how-to-generate-event-handlers-with-loop-in-javascript.
* The (i) trailing function is a "direct" invocation of the preceeding function literal.
*/
function addVoyageHandlers(controlsform, voyageId) {
	// Register event type radio buttons.
	for (var i=0; i < EVENT_TYPE_TITLES.length; i++) {
	    (function(i) {
			//   Second param, 0, tells replotYearsEventType to start at the beginning of activeYoyageLayers.
			controlsform.logbook_event_type[i].onclick = function() { 
				replotYearsEventType(i, 0, voyageId); 
			};		
	    })(i);
		//alert("i: " + i + "element value: " + controlsform.year_chosen[i].value);
	}
	// Register year range checkboxes
	// Handle possibility that there is only one year.
	// If so then then there is no "collection" and [ ] indexing won't work.
	// alert('layerYears.length: ' + layerYears.length);
	if(layerYears.length > 1) {
		for (var j=0; j < layerYears.length; j++) {
		    (function(j) {
				controlsform.year_chosen[j].onclick = function() { 
					if (this.checked) {
						console.log(" -- in addVoyageHandlers, years > 1, call addDateLayer(j)");
						addDateLayer(j, voyageId);
					} else { // unchecked
						deactivateVoyageLayer(j);
					}
				} 
		    })(j);
			//alert("j: " + j + "element value: " + controlsform.year_chosen[j].value);
		}		
	} else { // layerYears length is 1
		(function(closed) {
			controlsform.year_chosen.onclick = function() { 
				if (this.checked) {
					console.log(" -- in addVoyageHandlers, years = 1, call addDateLayer(j)");
					addDateLayer(0, voyageId);
				} else { // unchecked
					deactivateVoyageLayer(0);
				}
			} 
	    })(closed);
	}
} // end addVoyageHandlers


/* called each time a year is added */
function addDateLayer(yearLayerIndex, voyageId) {
	// Disable other years -- if you click on another while rendering then render will 
	// be truncated.
	disableControls();
	activeYearLayers[yearLayerIndex] = true;	
	// 3rd param, isFullReplot, is false, i.e. just draw this single layer

	console.log(" -- in addDateLayer,  year: " + layerYears[yearLayerIndex]);

	// prepVoyageMarkers(yearLayerIndex, getWhereClause(yearLayerIndex), false);	
	prepVoyageMarkers(yearLayerIndex, voyageId, false);	

	// NEXT NEXT 

}

/* deactivateVoyageLayer *
* called by interface checkboxes */
function deactivateVoyageLayer(yearLayerIndex) {
	activeYearLayers[yearLayerIndex] = false;	
	clearLayer(yearLayerIndex);	
	sidebarLayers[yearLayerIndex] = 'this year deleted'; 
	writeSidebar();
}

/* helper for where clause
To delete - obsolete with separate year column
function getWhereClause(yearLayerIndex) {
	var whereClause = " WHERE 'Date' > '01/01/" + layerYears[yearLayerIndex] + "' AND 'Date' < '12/31/" + layerYears[yearLayerIndex] + "'";
	return whereClause;
}
*/

/**
* Erases and redraws active layers in the chosen event-type mode. 
* Draws one layer per call. Calls prepVoyageMarkers with "true" for isFullReplot. 
* Should this be some "callback" structure instead?
* @method replotYearsEventType 
* @param {int} eventTypeIndex - index of event type selected
* @param {int} fromYearLayerIndex - starting index for search for next activeLayer
* @param {string} voyageId - needed for call to prepVoyageMarkers
*
* note: need to refactor where clause?-- simlar to what's in addDateLayer db 5/16/14
*/
function replotYearsEventType(eventTypeIndex, fromYearLayerIndex, voyageId) {
	this.activeEventTypeIndex = eventTypeIndex;
	
	for (var i = fromYearLayerIndex; i < activeYearLayers.length; i++) {
		if (activeYearLayers[i]) {
			clearLayer(i);	
			// 3rd param, isFullReplot, is true - tell prepVoyageMarkers to ask for "next" until done


			// prepVoyageMarkers(i, getWhereClause(i), true);
			// temp
			prepVoyageMarkers(i, voyageId, true);


			// just one layer at a time. Need to give it time to finish before starting next.
			break;		
		} // endif			
		// need to draw sidebar if we hit end of array and last one is not active
		// if last one is active we won't be called back from	dropMarkers		
		if (i == activeYearLayers.length -1) { // we're on the last one and it's not active
			// if it was active we have gone to prepVoyageMarkers followed by a break
			writeSidebar();
		}
	} // end for
}

/**
* Access url for our map database to set array of rows. Calls dropMarkers. 
* Also initializes marker and sidebar arrays.
* @function prepVoyageMarkers 
* @param {int} yearLayerIndex - index of layer (year) to query
* @param {String} voyageId - needed to create data url -- circular?
* @param {Boolean} isFullReplot - true tells dropMarkers to call back, false means single
* @global {int} activeEventTypeIndex - current eventType - set by replotYearsEventType
* Fields used:
* lat, lon, day, month, year, 
* dayofweek, spotted_quantity, logbook_entry, code_total, weather_conditions
* spotted_code, spotted_species, struck_quantity, struck_species, barrel_yield
* running_total_oil, days_at_sea, gam_description, weather_code, gam_code, 
* anchor_code, bib_id, logbook_page
*/
// function prepVoyageMarkers(yearLayerIndex, whereClause, isFullReplot) {
function prepVoyageMarkers(yearLayerIndex, voyageId, isFullReplot) {
	// (re)initialize
	droppedCount	= 0;
	droppedInterval = null;
	
	// place Rendering message for this layer while it is doing so
	// using layerYears for layerTitles
	sidebarLayers[yearLayerIndex] = "<h3>" + layerYears[yearLayerIndex] + "</h3><ol class='entry_list'><li>Rendering...</li></ol>";
	writeSidebar();
	
	// initialize this sidebar layer
	sidebarLayers[yearLayerIndex] = "<h3>" + layerYears[yearLayerIndex] + "</h3><ol class='entry_list'>";
	// initialize markerLayer array
	segMarkLayers[yearLayerIndex] = [];
	infoWindow = new google.maps.InfoWindow();
	
	// conditionally add to whereClause depending on global activeEventTypeIndex
	if (activeEventTypeIndex > 0) {
		console.log(" -- have yet to incorporate mode into params");

		// alert(" -- have yet to incorporate mode into params");
		// radio button sends index number. Url translates this to mode column name, e.g. weather_code
		var url = '/mapdata/voyage/' + voyageId + '/' + layerYears[yearLayerIndex] + '/'+ EVENT_TYPE_FIELDS[activeEventTypeIndex] + '/'; 
		console.log("-- prepVoyageMarkers url: " + url);

	} else {
		// var url = '/mapdata/voyage/AV05169/' + String(year) + "/";
		var url = '/mapdata/voyage/' + voyageId + '/' + layerYears[yearLayerIndex] + '/';
	}

	console.log("-- got to before getDataAjax");
	
	getDataAjax(url, isFullReplot, yearLayerIndex, voyageId, startVoyageMarkerDisplay);
	// rows global is now set

	console.log("-- got past getDataAjax");
}

/**
* @method startVoyageMarkerDisplay
* @param isFullReplot - 
* @param yearLayerIndex - 
* @param voyageId - needed for replotYearsEventType
* 
* called by the callback function in getDataAjax which is startVoyageMarkerDisplay
*/
// rows defined and set globally
// sidebarLayers defined globally 
function startVoyageMarkerDisplay(isFullReplot, yearLayerIndex, voyageId)	{
	// we already tested for error message, but here we test for undefined
	// again for the case where this is a legit empty layer.
	if (typeof rows === "undefined"){
		//alert("no results found for this date range.")
		// assuming this is legit non event vs. error:
		// (do this anyway, even if there was an error - page will look "finished")
		// add note to sidebar and close the sidebar and post ordered list
		// omit title if it's "All" (don't want to say No All events)
		var eventTypeTitle = EVENT_TYPE_TITLES[activeEventTypeIndex];
		if (eventTypeTitle == 'All') {eventTypeTitle = ''};
		sidebarLayers[yearLayerIndex] += '<li>No ' + eventTypeTitle + ' events for this year.</li></ol>'
		// current year was cleared, but we still need to move on to the next.
		// increment and repeat if isFullReplot and we're not at the end of activeYearLayers
		yearLayerIndex++;
		if (isFullReplot) { // we're replotting all year layers by type
			if (yearLayerIndex < activeYearLayers.length) { // there's more in this redraw
				replotYearsEventType(activeEventTypeIndex, yearLayerIndex, voyageId);				
			} else { // we're done with redraw
				writeSidebar();
			}
		} else {
			// need to write sidebar anyway, even if just for the no events in this date msg
			writeSidebar();
		}
	} else { // we have rows to work with
		// alert(" barrels in last row: " + rows[rows.length - 1][15]);
		// need to know whether we're counting barrels in this data set or not
		// for condition in the infowindow. look at last row.
		countingOil = false;
		if (rows[rows.length - 1][15] > 0) {countingOil = true;}
		// pass on isFullReplot (false means draw single layer)
		// temp voyageId
		// dropMarkers(isFullReplot, yearLayerIndex, 'voyage', 'AV05169');
		dropMarkers(isFullReplot, yearLayerIndex, 'voyage', voyageId);
	}
}

/**
* getDataAjax
* @param url - generated in prepVoyageMarkers or ___ compare, based on voyageId
* @param isFullReplot - whether to plot all year layers, or just this one
* @param yearLayerIndex - 
* @param voyageId - needed for displayCallback when callback s to startVoyageMarkerDisplay
* 		not needed for compare -- a way to factor it out?
* @param displayCallback - might be startCompareLineDisplay, might be startVoyageMarkerDisplay
* Called by prepComparePath and prepVoyageMarkers
* Note: url is already based on the current voyageId, but we need voyageId explicitly
* in order to pass it on to the displayCallback function (hardwire it here in display callback?)
*/
function getDataAjax(url, isFullReplot, yearLayerIndex, voyageId, displayCallback) {

	$.getJSON(url, function(json) {
	    // console.log(" -- json[0].id: " +json[0].id); 
	    // console.log(" -- json[0].voyageid: " +json[0].voyageid); 

	    // the json returned by mapdata/voyage/ is already a list
	    rows = json;

		// catch lack of results here
		if (typeof rows === "undefined"){
			//alert("no results found for this date range.")
			
			// catch error (as opposed to emtpy result)
			if (typeof data.error === "object" ) {
				alert("error msg: " + (typeof data.error) + data.error.message);				
			}		
		}
		// execute callback function
		displayCallback(isFullReplot, yearLayerIndex, voyageId);

	});
}


/**
* Create single marker from fusion row. Add date to sidebar.
* @method createVoyageMarker
* @param {int} yearLayerIndex Which layer are we building
* @param {array} row Result set from query
*/
function createVoyageMarker(yearLayerIndex, row) {
	// establish marker number 
	// starts off at 0, but length is already one more (get's us to first being 1)
	var markerNum = segMarkLayers[yearLayerIndex].length; 
	// vars for fields used more than once
	var logDate = row.month + "/" + row.day + "/" + row.year;	

	// var locEventIndex = row[8];
	var locEventIndex = row.code_total;

	// console.log(" -- code_total: " + locEventIndex);

	var locEventName = EVENT_ICON_NAMES[locEventIndex];
	// generate google map LatLng from the lat and long cols.	
	var coordinate = new google.maps.LatLng(row.lat, row.lon);			
	
	marker = new google.maps.Marker({
		map: map,
		position: coordinate,
		icon: new google.maps.MarkerImage('/static/maps/images/map/' + locEventName + '.png')
	});
    // save morker objects for links from side_bar
	// also save for clearing. 
    segMarkLayers[yearLayerIndex].push(marker);	
	// ===================================
	// set degrees lat and lon - will derive from decimal values
	var lat_deg = Math.floor(row.lat);
	var lon_deg = Math.floor(row.lon);
	// create infowindow
	google.maps.event.addListener(marker, 'click', function(event) {
		infoWindow.setPosition(coordinate);
		var iwHtml = ['<div id="infowindow"><header>'];
		iwHtml.push(' <date><strong>Date:</strong> ' + logDate + '</date> ');
		iwHtml.push('</header> <section> <dl class="noicons">');
		iwHtml.push('   <dt>Location:</dt> <dd>' + 
			Math.abs(lat_deg ) + '&deg; ' + Math.floor((row.lat - lat_deg) * 60) + 
			'&apos; ' + ((lat_deg > 0) ? 'N' : 'S') + ', ' + 
			Math.abs(lon_deg ) + '&deg; ' + Math.floor((row.lon - lon_deg) * 60) + 
			'&apos; '  + ((lon_deg > 0) ? 'E' : 'W') + '</dd> ');
		if (row.days_at_sea > 0){
			iwHtml.push('  <dt>Days at Sea:</dt> <dd>' + row.days_at_sea + '</dd> ');
		}
		if (countingOil){
			iwHtml.push('  <dt>Total Oil to Date:</dt> <dd>' + row.running_total_oil + ' barrels</dd> ');
		}
		iwHtml.push('</dl> ');
		
		if (row.spotted_code > 0){
			iwHtml.push('<dl class="icons"> ');
			iwHtml.push('  <dt><img src="/static/maps/images/infowin/spot.png" height="25" width="25" alt="whales spotted icon"/>Spotted:</dt> ');
			iwHtml.push('  <dd>' + row.spotted_species + '</dd> </dl>');
		}
		if (row.struck_code > 0){
			iwHtml.push(' <dl class="icons"> ');
			iwHtml.push('  <dt><img src="/static/maps/images/infowin/kill.png" height="25" width="25" alt="whales caught icon"/>Caught:</dt> ');
			iwHtml.push('  <dd>' + row.struck_species + '</dd> </dl>');
		}
		if (row.barrel_yield > 0){
			iwHtml.push(' <dl class="icons"> ');
			iwHtml.push('  <dt><img src="/static/maps/images/infowin/oil.png" height="25" width="25" alt="oil barrel icon"/>Oil:</dt> ');
			iwHtml.push('  <dd>' + row.barrel_yield + ' Barrels</dd> </dl>');
		}
		if (row.weather_code > 0){
			iwHtml.push(' <dl class="icons"> ');
			iwHtml.push('  <dt><img src="/static/maps/images/infowin/weather.png" height="25" width="25" alt="stormy weather icon"/>Weather</dt> ');
			iwHtml.push('  <dd>' + row.weather_conditions + '</dd> </dl>');
		}
		if (row.gam_code > 0){
			iwHtml.push(' <dl class="icons"> ');
			iwHtml.push('  <dt><img src="/static/maps/images/infowin/gam.png" height="25" width="25" alt="gam icon"/>Gam:</dt> ');
			iwHtml.push('  <dd>' + row.gam_description + '</dd> </dl>');
		}
		if (row.anchor_code > 0){
			iwHtml.push(' <dl class="icons"> ');
			iwHtml.push('  <dt><img src="/static/maps/images/infowin/land.png" height="25" width="25" alt="at anchor icon"/>At Anchor</dt> ');
			iwHtml.push('  <dd>&nbsp;</dd> </dl>');
		}
		
		iwHtml.push('<br clear="left"><h4>Logbook Entry For This Day</h4>');
		if (log_link_type==1) { 

			iwHtml.push('<a href="http://research.mysticseaport.org/item/l0' + 
				row.bib_id + '/#' + row.logbook_page + '/" target="reference">Link to Logbook</a>'); 

		} else if (log_link_type==2) {
			iwHtml.push('<a href="javascript:popBox(&apos;maps&apos; ,&apos;journal&apos; ,&apos;' + 
				short_name + '&apos; ,&apos;' + row.logbook_page + '&apos;)">Link to Journal</a>');
			
		}
		iwHtml.push('<div class="log_entry"><p>' + row.logbook_entry + '</p></div> ');
		iwHtml.push('<div class="infonav"> ');

		// Next and Previous links
		if(markerNum < (segMarkLayers[yearLayerIndex].length - 1)) {
			iwHtml.push(' <a href="javascript:openInfoFromSide(' +
			yearLayerIndex + ', ' + (markerNum + 1) + ')"> &nbsp; next &rsaquo;</a>');			
		}
		if(markerNum > 0) {
			iwHtml.push(' <a href="javascript:openInfoFromSide(' +
			yearLayerIndex + ', ' + (markerNum - 1) + ')"> &lsaquo; previous &nbsp; </a> ');			
		}			
		iwHtml.push('</div> </section> </div>'); // div data, section div infoWindow
		
		infoWindow.setContent(iwHtml.join(''));
		
		infoWindow.open(map);
	});
	
	// ==========================
	// add sidebar links	
	// we used to push another entry onto side_bar_html directly here.
	// but now we're adding it to the approprate sidebar array element   
	sidebarLayers[yearLayerIndex] += '<li><a href="javascript:openInfoFromSide(' +
	yearLayerIndex + ', ' + (segMarkLayers[yearLayerIndex].length-1) +
	 ')">' + logDate + '</a> <img src="/static/maps/images/list/' + locEventName + 
	'.png" height="17" alt="event icon"/></li>';	
}


function openInfoFromSide(yearLayerIndex, i) {
	// call the google map infowindow
    google.maps.event.trigger(segMarkLayers[yearLayerIndex][i], "click");
}
