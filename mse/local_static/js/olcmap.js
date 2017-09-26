/* ===========================================================
Shared map variables
 ===========================================================*/
var map;
// var side_bar_html = ""; 
var _layerIndex = 0;
//var _beginDate	= null;
//var _endDate	= null;
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
var currModeIndex = 0; // store globaly for later year additions
var activeLayers = [];
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
var locEventNames = ["none", "na", "spot", "kill-spot", "gam", "na", "spot-gam", "kill-spot-gam", "weather", "na", "spot-weather", "kill-spot-weather", "gam-weather", "na", "spot-gam-weather", "kill-spot-gam-weather", "land", "na", "spot-land", "kill-spot-land", "gam-land", "na", "spot-gam-land", "kill-spot-gam-land", "weather-land", "na", "spot-weather-land", "kill-spot-weather-land", "gam-weather-land", "na", "spot-gam-weather-land", "kill-spot-gam-weather-land"];

var MODE_COL_NAMES = ['all', 'Caught_code', 'Whales_sptd_code', 'gam_code', 'squally_wthr_code', 'anchor_code'];
var MODE_TITLES	= ['All', 'Whales Caught', 'Whales Spotted', 'Gam with Another Ship', 'Foul Weather', 'Ship in Port']; // for no data for year message
var layerYears		= []; // , '1843', '1844' will come from django
var layerIDs		= []; // for compare
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
Shared by all
===========================================================*/
// I think visualization was needed when we were using fusion table layers directly
// new since 7: https://developers.google.com/fusiontables/docs/samples/custom_markers
//google.load('visualization', '1');

/* called once to, well, initialize */
function initialize() {
	// set variables
	// map params defined in HTML header
	fusionTableId = map_params.fusionTableId;
	
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

function writeSidebar(mapType) {
	var side_bar_html = "";
	for (var i = 0; i < activeLayers.length; i++) {
		if (activeLayers[i]) {
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
* Loops through rows of a layer (query) to calling createVoyageMarker (or other)for each.
* @method dropMarkers
* @param {Boolean} doAllActive whether or not to call redrawInMode for the next layer
* @param {int} layerIndex Which layer are we working on
* @param {String} MapType - Voyage, Story, Compare
*/
function dropMarkers(doAllActive, layerIndex, mapType) {
	// Set marker animation speed. 40 was the "original" speed
	// redraws (doAllActive) should be faster
	if (doAllActive) {
		var markerSpeed = 5;
	} else {
		var markerSpeed = 20;
	}
	// test for end of markers
	if(droppedCount === rows.length){ // rows.length
		clearInterval(droppedInterval);

		// "close sidebar" placed here to make sure its after loop is completed
		// close the sidebar ordered list
		sidebarLayers[layerIndex] += '</ol>';
		// wait until one layer is done before starting next in redrawInMode
		// alert('just finised in dropMarkers');
		// increment and repeat if doAllActive and we're not at the end of activeLayers
		layerIndex++;
		if (doAllActive) { // we're redrawing in mode
			if (layerIndex < activeLayers.length) { // there's more in this redraw
				redrawInMode(currModeIndex, layerIndex);				
			} else { // we're done with redraw
				writeSidebar(mapType);
			}
		} else { // we just drew single, done
			writeSidebar(mapType);
			// set global that we're done rendering -- ok to start on subsquent click on a year
			// render_in_progress = false;
			// now that we'er done rendering, reset any diabled controls
			if (mapType=="voyage") {
				enableVoyageControls();
			}
		}
	    return;
	}
	else if(droppedInterval === null) {
		// this creates the loop, setInterval call dropMarkers again and again
		// setInterval syntax: (function-to-call, milliseconds-time, arg, arg)
	    droppedInterval = setInterval(dropMarkers, markerSpeed, doAllActive, layerIndex, mapType);
	}
	var row = rows[droppedCount++];
	// need to refactor this making use of JS functions as objects
	if (mapType === 'voyage') {
		// rows length enables calculation of zIndex for numberd markers
		createVoyageMarker(layerIndex, row);	
	} else if(mapType === 'story'){
		createChapterMarker(layerIndex, row, rows.length);
	}
}

/* deactivateVoyageLayer *
* called by interface checkboxes */
function deactivateVoyageLayer(layerIndex) {
	activeLayers[layerIndex] = false;	
	clearLayer(layerIndex);	
	sidebarLayers[layerIndex] = 'this year deleted'; 
	writeSidebar();
}

/*
* used by voyages and compare
*/
function clearLayer(layerIndex) {
	// only for voyages
	if(infoWindow) {
      infoWindow.close();
    }
	// for compare, in case clear is called while line is still drawing
	//droppedInterval = null;
	// iterate over all of the markers in a given layer
	for (var i = 0; i < segMarkLayers[layerIndex].length; i++ ) {
		// close any info window that might be open
		// alert("marker[i]: " + segMarkLayers[layerIndex][i].marker);
    	// segMarkLayers[layerIndex][i].marker.infowindow.close();
    	segMarkLayers[layerIndex][i].setMap(null);
	}
}
/* ===========================================================
Overlays
===========================================================*/
// patterned after addCompareHandlers
// separate loop for grounds, currents? or just have a number of overlays?
function addOverlayHandlers(overlayform) {	
	for (var k=0; k < 1; k++) { // layerIDs.length
	    (function(k) {
			overlayform.grounds.onclick = function() { // multi: item_chosen[j]
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
} // end addVoyageHandlers


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
		strokeColor: '#' + 'FF5544', // layerColors[layerIndex]
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
		// alert("marker[i]: " + segMarkLayers[layerIndex][i].marker);
    	// segMarkLayers[layerIndex][i].marker.infowindow.close();
    	overLayers[overlayIndex][i].setMap(null);
	}
}


/* ===========================================================
Story maps
===========================================================*/
function init_story() {
	activeLayers[0] = true;	
	// only param, doAllActive, is false, i.e. just draw this single layer
	prepChapterMarkers(0, false);
}


/**
* story scratch. 
* Also initializes marker and sidebar arrays.
* @function prepChapterMarkers 
* assume only one layer, so hardwire to layerIndex 0
*/
function prepChapterMarkers(layerIndex, doAllActive) {
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
	segMarkLayers[layerIndex] = [];
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
		// 2nd param is layerIndex
		dropMarkers(doAllActive, 0, 'story');
	}
}

/**
* Create single marker from fusion row. Add date to sidebar.
* @method createVoyageMarker
* @param {int} layerIndex Which layer are we building
* @param {array} row Result set from query
*/
function createChapterMarker(layerIndex, row, rows_length) {
	//alert('chapter marker');
	// establish marker number 
	// starts off at 0, but length is already one more (get's us to first being 1)
	var markerNum = segMarkLayers[layerIndex].length; 
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
    segMarkLayers[layerIndex].push(marker);	
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
		if(markerNum < (segMarkLayers[layerIndex].length - 1)) {
			iwHtml.push('<a href="javascript:openInfoFromSide(' +
			layerIndex + ', ' + (markerNum + 1) + ')"> &nbsp; next &rsaquo;</a> ');			
		}
		if(markerNum > 0) {
			iwHtml.push('<a href="javascript:openInfoFromSide(' +
			layerIndex + ', ' + (markerNum - 1) + ')"> &lsaquo; previous &nbsp; </a> ');			
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
	sidebarLayers[layerIndex] += '<li>'  + row["fields"]["chap_num"] + '. ' + row["fields"]["date"] + ' - <a href="javascript:openInfoFromSide(' +
	layerIndex + ', ' + (segMarkLayers[layerIndex].length-1) +
	 ')">' + row["fields"]["title"] + '</a> </li>';	   			
}

/* ===========================================================
Comparison map
===========================================================*/
function init_compare() {
	layerIDs = compare_params.layerIDs;
	layerColors = compare_params.layerColors;
	startMapIndex = compare_params.startMapIndex;
	
	addCompareHandlers(document.map_controls);
	
	// activate calling map if valid
	if(startMapIndex > -1){
		addCompareLayer(startMapIndex);
		//$('form[name="map_controls"] input.index(startMapIndex)').prop('checked', true);	
		$('ul.compare_list input').eq(startMapIndex).prop('checked', true);	
	}
	// init voyage call set date layer which initializes active layer
	//activeLayers[0] = true;	
	//prepComparePath();
}

// patterned after addVoyageHandlers
function addCompareHandlers(controlsform) {	
	for (var j=0; j < layerIDs.length; j++) {
	    (function(j) {
			controlsform.item_chosen[j].onclick = function() { 
				if (this.checked) {
					addCompareLayer(j);
				} else { // unchecked
					clearLayer(j);
					// alert('deactivate voyage layer: ' + j);
				}
			} 
	    })(j);
		//alert("j: " + j + "element value: " + controlsform.year_chosen[j].value);
	}
} // end addVoyageHandlers

/* called add a voyage path */
function addCompareLayer(layerIndex) {
	activeLayers[layerIndex] = true;	
	// 3rd param, doAllActive, is false, i.e. just draw this single layer
	// only needed by voyages, not compare
	prepComparePath(layerIndex, getCompareClause(layerIndex), false);
}

/* helper for where clause
* The column that's called voyage_id in Django is called voyageID in the Fusion table
*/
function getCompareClause(layerIndex) {
	var whereClause = " WHERE 'voyageID' = " + layerIDs[layerIndex] ; // + "'"
	return whereClause;
}


/**
* story scratch. 
* Also initializes marker and sidebar arrays.
* @function prepCompare 
* assume only one layer, so hardwire to layerIndex 0
*/
function prepComparePath(layerIndex, whereClause) {
	// (re)initialize
	droppedCount	= 0;
	droppedInterval = null;
	
	//alert('prepComparePath, where: ' + whereClause);
	
	// initialize markerLayer array
	segMarkLayers[layerIndex] = [];
	
	var query = "SELECT 'Latitude', 'Longitude' " +
	"FROM " + fusionTableId + " " + whereClause;
		
	var encodedQuery = encodeURIComponent(query);
	// Construct the URL
	var url = 'https://www.googleapis.com/fusiontables/v1/query';
	url += '?sql=' + encodedQuery;
	// key for access (not the database key)
	//url += '&key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ'; // from g. examp.
	url += '&key=AIzaSyC6-wUwsqatXJp5ubh5Wf9R6-EyQ3q9deU'; // dbutton g apps
	
	// 2nd param, false, is for doAllActive -- relevant for Voyage, but not Compare
	getDataAjax(url, false, layerIndex, startCompareLineDisplay);
	// rows global is now set

}

// rows defined and set globally
// doAllActive along for the ride - to remain compatible with Voyage code
function startCompareLineDisplay(doAllActive, layerIndex)	{
	//alert('startCompareLineDisplay, layerIndex: ' + layerIndex);
	// we already tested for error message, but here we test for undefined
	// again for the case where this is a legit empty layer.
	if (typeof rows === "undefined"){
		alert("no results found for this voyage ID.")
	} else { // we have rows to work with
		// pass on doAllActive (false means draw single layer)
		dropCompareLines(layerIndex);
	}
}

/**
* Recursive timer to animate line segments
* @method dropCompareLines
* @param {layerIndex} which layer are we building
*/
function dropCompareLines(layerIndex) {
	// must be a better place for this
	var markerSpeed = defaultSegSpeed;
	// test for end of markers
	//alert('above if - droppedCount: ' + droppedCount + ' rows.length: ' + rows.length);
	if(droppedCount + defaultSegLength >= rows.length){ 
		// stop timer
		clearInterval(droppedInterval);
		// draw last seg, custom length
		//alert('in if droppedCount: ' + droppedCount + ' rows.length: ' + rows.length);
		addLineSegment(layerIndex, rows.length - droppedCount);		
		
	} else if(droppedInterval === null) { // first time called - init
		// this creates the loop, setInterval call dropMarkers again and again
		// setInterval syntax: (function-to-call, milliseconds-time, arg, arg)
	    droppedInterval = setInterval(dropCompareLines, markerSpeed, layerIndex);
		// draw first segment
		addLineSegment(layerIndex, defaultSegLength);
	} else {
		// add line segement
		// rows is already global
		addLineSegment(layerIndex, defaultSegLength);		
	}
}

function addLineSegment(layerIndex, segLength) { // rows & dropped count global
	// generate google map LatLng from the lat and long cols.
	var segCoords = [];	
	
	for (var k = droppedCount; k < droppedCount + segLength +1; k++ ) {
		// test (sometimes last row is blank)
		if (rows[k] != undefined) {
			// add to array
		    segCoords.push(new google.maps.LatLng(rows[k][0], rows[k][1]));			
		}	
	}

	// draw line for each seg?
	var pathLayerSeg = new google.maps.Polyline({
		path: segCoords,
		geodesic: false,
		strokeColor: '#' + layerColors[layerIndex],
		strokeOpacity: 1.0,
		strokeWeight: 2
	});
	pathLayerSeg.setMap(map);
	// push
	segMarkLayers[layerIndex].push(pathLayerSeg);
	droppedCount+= segLength;
}	


/* ===========================================================
Voyage maps
===========================================================*/
function init_voyage() {
	// map params defined in HTML header
	layerYears = map_params.layerYears;
	// python/django booleans don't pass directly to Javascript
	log_link_type = map_params.log_link_type;
	for (var i=0; i < layerYears.length; i++) {
		activeLayers[i] = false;
	}
	addVoyageHandlers(document.map_controls);
	// render first year
	addDateLayer(0); 
	$('div.map-controls--years input:first').prop('checked', true);	
}

// register logbook event type radio buttons
//   -- Second param, 0, tells redrawInMode to start at the beginning of activeLayers.
// And register year range checkboxes
// assigning functions in a loop requires "closure"
// ref: http://stackoverflow.com/questions/6487366/how-to-generate-event-handlers-with-loop-in-javascript
// the trailing (i) is a "direct" invocation of the preceeding function literal
function addVoyageHandlers(controlsform) {
	for (var i=0; i < MODE_TITLES.length; i++) {
	    (function(i) {
			controlsform.logbook_event_type[i].onclick = function() { redrawInMode(i, 0); };		
	    })(i);
		//alert("i: " + i + "element value: " + controlsform.year_chosen[i].value);
	}
	// handle possibility that there is only on year
	// if so then then there is no "collection" an [ ] indexing won't work
	// alert('layerYears.length: ' + layerYears.length);
	if(layerYears.length > 1) {
		for (var j=0; j < layerYears.length; j++) {
		    (function(j) {
				controlsform.year_chosen[j].onclick = function() { 
					if (this.checked) {
						addDateLayer(j);
					} else { // unchecked
						deactivateVoyageLayer(j);
					}
				} 
		    })(j);
			//alert("j: " + j + "element value: " + controlsform.year_chosen[j].value);
		}		
	} else {
		(function(closed) {
			controlsform.year_chosen.onclick = function() { 
				if (this.checked) {
					addDateLayer(0);
				} else { // unchecked
					deactivateVoyageLayer(0);
				}
			} 
	    })(closed);
	}
} // end addVoyageHandlers

function enableVoyageControls() {
	//document.map_controls.year_chosen[layerIndex].disabled= false;
	if(layerYears.length > 1) {
		for (var j=0; j < layerYears.length; j++) {	
			document.map_controls.year_chosen[j].disabled= false;
		}		
	}
	for (var i=0; i < MODE_TITLES.length; i++) {
		document.map_controls.logbook_event_type[i].disabled= false;				
	}	
}

function disableVoyageControls(layerIndex) {
	//document.map_controls.year_chosen[layerIndex].disabled= false;
	if(layerYears.length > 1) {
		for (var j=0; j < layerYears.length; j++) {
			// don't disable the one we're on	
			if (j!=layerIndex) {
				document.map_controls.year_chosen[j].disabled= true;				
			}
		}		
	}
	for (var i=0; i < MODE_TITLES.length; i++) {
		document.map_controls.logbook_event_type[i].disabled= true;				
	}
	
}

/* called each time a year is added */
function addDateLayer(layerIndex) {
	// disable other years -- if you click on another while rendering then render will be truncated
	disableVoyageControls(layerIndex);
	activeLayers[layerIndex] = true;	
	// 3rd param, doAllActive, is false, i.e. just draw this single layer
	prepVoyageMarkers(layerIndex, getWhereClause(layerIndex), false);		
}

/* helper for where clause
*/
function getWhereClause(layerIndex) {
	var whereClause = " WHERE 'Date' > '01/01/" + layerYears[layerIndex] + "' AND 'Date' < '12/31/" + layerYears[layerIndex] + "'";
	return whereClause;
}

/**
* Erases and redraws active layers in the chosen event-type mode. 
* Draws one layer per call. Calls prepVoyageMarkers with "true" for doAllActive. 
* Should this be some "callback" structure instead?
* @method redrawInMode 
* @param {int} modeIndex - index of mode selected
* @param {int} fromIndex - starting index for search for next activeLayer
*
* note: need to refactor where clause?-- simlar to what's in addDateLayer db 5/16/14
*/
function redrawInMode(modeIndex, fromIndex) {
	this.currModeIndex = modeIndex;
	
	for (var i = fromIndex; i < activeLayers.length; i++) {
		if (activeLayers[i]) {
			clearLayer(i);	
			// 3rd param, doAllActive, is true - tell prepVoyageMarkers to ask for "next" until done
			prepVoyageMarkers(i, getWhereClause(i), true);
			// just one layer at a time. Need to give it time to finish before starting next.
			break;		
		} // endif			
		// need to draw sidebar if we hit end of array and last one is not active
		// if last one is active we won't be called back from	dropMarkers		
		if (i == activeLayers.length -1) { // we're on the last one and it's not active
			// if it was active we have gone to prepVoyageMarkers followed by a break
			writeSidebar();
		}
	} // end for
}

/**
* Performs fusion table query to set array of rows. Calls dropMarkers. 
* Also initializes marker and sidebar arrays.
* @function prepVoyageMarkers 
* @param {int} layerIndex - index of layer (year) to query
* @param {String} whereClause - sql text for start and end dates
* @param {Boolean} doAllActive - true tells dropMarkers to call back, false means single
* @global {int} modeIndex - current mode (also embodied in whereClause - redundant?)
*/
function prepVoyageMarkers(layerIndex, whereClause, doAllActive) {
	// (re)initialize
	droppedCount	= 0;
	droppedInterval = null;
	
	// place Rendering message for this layer while it is doing so
	// using layerYears for layerTitles
	sidebarLayers[layerIndex] = "<h3>" + layerYears[layerIndex] + "</h3><ol class='entry_list'><li>Rendering...</li></ol>";
	writeSidebar();
	
	// initialize this sidebar layer
	sidebarLayers[layerIndex] = "<h3>" + layerYears[layerIndex] + "</h3><ol class='entry_list'>";
	// initialize markerLayer array
	segMarkLayers[layerIndex] = [];
	infoWindow = new google.maps.InfoWindow();
	
	// conditionally add to whereClause depending on global modeIndex
	if (currModeIndex > 0) {
		whereClause += "AND '" + MODE_COL_NAMES[currModeIndex] + "' > 0";
	}
	
	// row[0] = lat, row[1] = long, row[2] = Date, row[3] = logLat text,  row[4] = N_or_S
	// row[5] = Long_logbk, row[6] = E_or_W, row[7] = logEntry, row[8] = locEventIndex, row[9] = weather_notes
	// row[10] = Whales_sptd_code, row[11] = Species, row[12] = quantity_caught, row[13] = Whales_cght_species, row[14] = Tot_Barrels_Sperm,
	// row[15] = run_oil, row[16] = run_days, row[17] = gam_descript, row[18] = squally_wther, row[19] = gam_code
	// row[20] = anchor_code, row[21] = log_page, (row[22] = bib_id)
	
	var query = "SELECT 'Latitude', 'Longitude', 'Date', 'Lat_logbook', North_or_South, " +
	"Long_logbook, East_or_West, Complete_Entries, Code_totals, weather_conditions, " +
	"Whales_sptd_code, Species, quantity_caught, Whales_cght_species, Total_Barrels_Sperm, " +
	"Running_Total, Days_at_sea, gam_description, squally_wthr_code, gam_code, " +
	"anchor_code, log_page";
	// need lobgook bib_id to be conditional, only the designated Fusion tables have that column
	if (log_link_type==1) { 
			query += ", bib_id";
	}

	query += " FROM " + fusionTableId + " " + whereClause;
		
	var encodedQuery = encodeURIComponent(query);
	// Construct the URL
	var url = 'https://www.googleapis.com/fusiontables/v1/query';
	url += '?sql=' + encodedQuery;
	// key for access (not the database key)
	//url += '&key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ'; // from g. examp.
	//url.push('&key=AIzaSyDJQ4Ln8q_rYo7q5opjkNm4bFc5M_ujU2g'); // my generic
	//url.push('&key=AIzaSyAiWZs7ncK7rL2U86DPE4briUVl1XWRyVw'); // created for digiz
	url += '&key=AIzaSyC6-wUwsqatXJp5ubh5Wf9R6-EyQ3q9deU'; // dbutton g apps
	// don't know if callback is needed.
	//url += '&callback=?';

	//alert(url);
	
	getDataAjax(url, doAllActive, layerIndex, startVoyageMarkerDisplay);
	// rows global is now set
}

// rows defined and set globally
// sidebarLayers defined globally 
function startVoyageMarkerDisplay(doAllActive, layerIndex)	{
	// we already tested for error message, but here we test for undefined
	// again for the case where this is a legit empty layer.
	if (typeof rows === "undefined"){
		//alert("no results found for this date range.")
		// assuming this is legit non event vs. error:
		// (do this anyway, even if there was an error - page will look "finished")
		// add note to sidebar and close the sidebar and post ordered list
		// omit title if it's "All" (don't want to say No All events)
		var eventModeTitle = MODE_TITLES[currModeIndex];
		if (eventModeTitle == 'All') {eventModeTitle = ''};
		sidebarLayers[layerIndex] += '<li>No ' + eventModeTitle + ' events for this year.</li></ol>'
		// current year was cleared, but we still need to move on to the next.
		// increment and repeat if doAllActive and we're not at the end of activeLayers
		layerIndex++;
		if (doAllActive) { // we're redrawing in mode
			if (layerIndex < activeLayers.length) { // there's more in this redraw
				redrawInMode(currModeIndex, layerIndex);				
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
		// pass on doAllActive (false means draw single layer)
		dropMarkers(doAllActive, layerIndex, 'voyage');
	}
}

function getDataAjax(url, doAllActive, layerIndex, displayCallback) {
	// Send the JSONP request using jQuery
	$.ajax({
	  url: url,
	  dataType: 'jsonp',
	  success: function (data, textStatus) {
		//alert("textStatus: " + textStatus);
		// set the global rows array for use by dropMarkers()
	    rows = data['rows'];
		// catch lack of results here
		if (typeof rows === "undefined"){
			//alert("no results found for this date range.")
			
			// catch error (as opposed to emtpy result)
			if (typeof data.error === "object" ) {
				alert("error msg: " + (typeof data.error) + data.error.message);				
			}		
		}
		// execute callback function
		displayCallback(doAllActive, layerIndex);
	  }
	});
	
}

/**
* Create single marker from fusion row. Add date to sidebar.
* @method createVoyageMarker
* @param {int} layerIndex Which layer are we building
* @param {array} row Result set from query
*/
function createVoyageMarker(layerIndex, row) {
	// establish marker number 
	// starts off at 0, but length is already one more (get's us to first being 1)
	var markerNum = segMarkLayers[layerIndex].length; 
	// vars for fields used more than once
	var logDate = row[2];	
	var locEventIndex = row[8];
	var locEventName = locEventNames[locEventIndex];
	// generate google map LatLng from the lat and long cols.	
	var coordinate = new google.maps.LatLng(row[0], row[1]);			
	
	marker = new google.maps.Marker({
		map: map,
		position: coordinate,
		icon: new google.maps.MarkerImage('/static/maps/images/map/' + locEventName + '.png')
	});
    // save morker objects for links from side_bar
	// also save for clearing. 
    segMarkLayers[layerIndex].push(marker);	
	// ===================================
	// create infowindow
	google.maps.event.addListener(marker, 'click', function(event) {
		infoWindow.setPosition(coordinate);
		//infoWindow.setContent(logDate + '<br>Lat : ' + logLat + '<br>' + row[7] + 'Don wuz here' + '<br> Oil for day: ' + row[14]);
		var iwHtml = ['<div id="infowindow"><header>'];
		iwHtml.push(' <date><strong>Date:</strong> ' + logDate + '</date> ');
		iwHtml.push('</header> <section> <dl class="noicons">');
		iwHtml.push('   <dt>Location:</dt> <dd>' + row[3] + ' ' + row[4] + ', ' + row[5] + ' ' + row[6] + '</dd> ');
		iwHtml.push('  <dt>Days at Sea:</dt> <dd>' + row[16] + '</dd> ');
		if (countingOil){
			iwHtml.push('  <dt>Total Oil to Date:</dt> <dd>' + row[15] + ' barrels</dd> ');
		}
		iwHtml.push('</dl> ');
		
		if (row[10] > 0){
			iwHtml.push('<dl class="icons"> ');
			iwHtml.push('  <dt><img src="/static/maps/images/infowin/spot.png" height="25" width="25" alt="whales spotted icon"/>Spotted:</dt> ');
			iwHtml.push('  <dd>' + row[11] + '</dd> </dl>');
		}
		if (row[12] > 0){
			iwHtml.push(' <dl class="icons"> ');
			iwHtml.push('  <dt><img src="/static/maps/images/infowin/kill.png" height="25" width="25" alt="whales caught icon"/>Caught:</dt> ');
			iwHtml.push('  <dd>' + row[13] + '</dd> </dl>');
		}
		if (row[14] > 0){
			iwHtml.push(' <dl class="icons"> ');
			iwHtml.push('  <dt><img src="/static/maps/images/infowin/oil.png" height="25" width="25" alt="oil barrel icon"/>Oil:</dt> ');
			iwHtml.push('  <dd>' + row[14] + ' Barrels</dd> </dl>');
		}
		if (row[18] > 0){
			iwHtml.push(' <dl class="icons"> ');
			iwHtml.push('  <dt><img src="/static/maps/images/infowin/weather.png" height="25" width="25" alt="stormy weather icon"/>Weather</dt> ');
			iwHtml.push('  <dd>' + row[9] + '</dd> </dl>');
		}
		if (row[19] > 0){
			iwHtml.push(' <dl class="icons"> ');
			iwHtml.push('  <dt><img src="/static/maps/images/infowin/gam.png" height="25" width="25" alt="gam icon"/>Gam:</dt> ');
			iwHtml.push('  <dd>' + row[17] + '</dd> </dl>');
		}
		if (row[20] > 0){
			iwHtml.push(' <dl class="icons"> ');
			iwHtml.push('  <dt><img src="/static/maps/images/infowin/land.png" height="25" width="25" alt="at anchor icon"/>At Anchor</dt> ');
			iwHtml.push('  <dd>&nbsp;</dd> </dl>');
		}
		
		iwHtml.push('<br clear="left"><h4>Logbook Entry For This Day</h4>');
		if (log_link_type==1) { 

			iwHtml.push('<a href="http://research.mysticseaport.org/item/l0' + 
				row[22] + '/' + row[21] + '/" target="reference">Link to Logbook</a>'); 

		} else if (log_link_type==2) {
			iwHtml.push('<a href="javascript:popBox(&apos;maps&apos; ,&apos;journal&apos; ,&apos;' + 
				short_name + '&apos; ,&apos;' + row[21] + '&apos;)">Link to Journal</a>');
			
		}
		iwHtml.push('<div class="log_entry"><p>' + row[7] + '</p></div> ');
		iwHtml.push('<div class="infonav"> ');

		// Next and Previous links
		if(markerNum < (segMarkLayers[layerIndex].length - 1)) {
			iwHtml.push(' <a href="javascript:openInfoFromSide(' +
			layerIndex + ', ' + (markerNum + 1) + ')"> &nbsp; next &rsaquo;</a>');			
		}
		if(markerNum > 0) {
			iwHtml.push(' <a href="javascript:openInfoFromSide(' +
			layerIndex + ', ' + (markerNum - 1) + ')"> &lsaquo; previous &nbsp; </a> ');			
		}			
		iwHtml.push('</div> </section> </div>'); // div data, section div infoWindow
		
		infoWindow.setContent(iwHtml.join(''));
		
		// alert(iwHtml.join(''));
		
		infoWindow.open(map);
	});
	
	// ==========================
	// add sidebar links	
	// we used to push another entry onto side_bar_html directly here.
	// but now we're adding it to the approprate sidebar array element   
	sidebarLayers[layerIndex] += '<li><a href="javascript:openInfoFromSide(' +
	layerIndex + ', ' + (segMarkLayers[layerIndex].length-1) +
	 ')">' + logDate + '</a> <img src="/static/maps/images/list/' + locEventName + 
	'.png" height="17" alt="event icon"/></li>';	
}


function openInfoFromSide(layerIndex, i) {
	// call the google map infowindow
    google.maps.event.trigger(segMarkLayers[layerIndex][i], "click");
}

// instead of body onload
$(document).ready(function() {
	// use type param to chose which handler init
	initialize();
	if (map_params.map_type === 'Voyage') {
		init_voyage();		
	} else if (map_params.map_type === 'Story') {
		init_story();
	} else if (map_params.map_type === 'Compare') {
		// temp
		init_compare();
		//init_voyage();
	} else {
		alert('no valid map type received');
	}
});
