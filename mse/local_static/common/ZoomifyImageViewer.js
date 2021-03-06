//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Copyright Zoomify, Inc., 1999-2012. All rights reserved.
// You may use this file on private and public websites, for personal and commercial
// purposes, with or without modifications, so long as this notice is included. Redistribution
// via other means is not permitted without prior permission. Additional terms apply.
// For complete license terms please see the Zoomify License Agreement included with
// this product and available on the Zoomify website at www.zoomify.com.
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


// The functions below are listed in groups in the following order: Initialization, ZoomifyImageViewer,
// ZoomifyViewport, ZoomifyToolbar, ZoomifyNavigator, NetConnector, and Utils.  Within each
// group the functions appear in the order in which they are first called.  Each group serves as a
// component with its own global variables and functions for sizing, positioning, and interaction.
// Shared variables global at the scope of the Zoomify Image Viewer are declared in a single 'Z'
// object which provides easy access while preventing naming conflicts with other code sources.



(function () {
	// Declare global-to-page object to contain global-to-viewer elements.
	var global = (function () { return this; } ).call();
	global.Z = {};
})();


//::::::::::::::: Don Button's testing :::::::::::::

function testAlert(viewerWidth) {
	alert("viewerWidth: " + viewerWidth);
}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::::::::::::::::::::::::::::::::: INIT FUNCTIONS :::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Z.showImage = function (containerID, imagePath, optionalParams) {
	// Ensure needed browser functions exist.
	Z.Utils.addCrossBrowserPrototypes();
	Z.Utils.addCrossBrowserMethods();
	Z.Utils.addCrossBrowserEvents();

	// Declare all global variables in one global object and get web page parameters.
	Z.Utils.declareGlobals();
	Z.pageContainerID = containerID;

	Z.imagePath = Z.Utils.removeTrailingSlashCharacters(imagePath);
	Z.parameters = Z.Utils.parseParameters(optionalParams);

	// Initialize on content load rather than full page load if supported by browser.
	Z.Utils.addEventListener(document, "DOMContentLoaded", Z.initialize);
	Z.Utils.addEventListener(window, "load", Z.initialize);
};

Z.initialize = function () {
	if (!arguments.callee.done) {
		// Ensure initialization occurs only once.
		arguments.callee.done = true;

		// Get browser, parse web page parameters, and create Zoomify Viewer.
		Z.Utils.detectBrowserInfo();
		Z.Utils.setParameters(Z.parameters);
		Z.Viewer = new Z.ZoomifyImageViewer();

		// Display copyright text for user confirmation, if optional parameter present.
		if (!(Z.Utils.isStrVal(Z.copyrightPath))) {
			Z.Viewer.configureViewer();
		} else {
			Z.Utils.enforceCopyright();
		}

		// Present debugging features (trace panel, globals dialog), if zDebug parameter true.
		if (Z.debug) { Z.Utils.trace(Z.Utils.getResource("DEFAULT_TRACEDISPLAYDEBUGINFOTEXT")); }
	}
};



//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::: VIEWER FUNCTIONS :::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Z.ZoomifyImageViewer = function () {
	// Create Viewer display area as application environment for Viewport, Toolbar and Navigator.
	Z.ViewerDisplay = Z.Utils.createContainerElement("div", "ViewerDisplay", "inline-block", "relative", "hidden", "100%", "100%", "0px", "0px", "none", "0px", "transparent none", "0px", "0px", "pointer");
	Z.pageContainer = document.getElementById(Z.pageContainerID);
	
	var containerS = Z.Utils.getElementStyle(Z.pageContainer);
	Z.viewerW = parseFloat(containerS.width);
	Z.viewerH = parseFloat(containerS.height);
	if (isNaN(Z.viewerW)) { Z.viewerW = Z.ViewerDisplay.clientWidth; }
	if (isNaN(Z.viewerH)) { Z.viewerH = Z.ViewerDisplay.clientHeight; }
	
	Z.pageContainer.innerHTML = "";
	Z.pageContainer.appendChild(Z.ViewerDisplay);

	// Create Viewport.
	this.configureViewer = function () { Z.Viewport = new Z.ZoomifyViewport(); };

	// Create Toolbar and Navigator.
	this.configureComponents = function () {
		if (Z.toolbarVisible > 0) { Z.Toolbar = new Z.ZoomifyToolbar(Z.Viewport); }
		if (Z.navigatorVisible > 0) { Z.Navigator = new Z.ZoomifyNavigator(Z.Viewport); }
		if (Z.Navigator) { Z.Navigator.validateNavigatorGlobals(); }
	};

	this.setSizeAndPosition = function (width, height, left, top, update) {
		Z.viewerW = width;
		Z.viewerH = height;
		Z.ViewerDisplay.style.width = width + "px";
		Z.ViewerDisplay.style.height = height + "px";
		if (Z.Viewport && Z.Viewport.getInitialized()) { Z.Viewport.setSizeAndPosition(width, height, left, top); }
		var toolbarTop = (Z.toolbarPosition == 1) ? height - Z.toolbarH : 0;
		if (Z.ToolbarDisplay && Z.Toolbar.getInitialized()) { 
			Z.Toolbar.setSizeAndPosition(width, null, null, toolbarTop); 
			if (Z.toolbarVisible > 1) { Z.Toolbar.show(true); }
		}
		if (Z.NavigatorDisplay && Z.Navigator.getInitialized()) { 
			Z.Navigator.setSizeAndPosition(null, null, left, top, Z.navigatorFit); 
			if (Z.navigatorVisible > 1) { Z.Navigator.setVisibility(true); }
		}
		if (update) { Z.Viewport.updateView(true); }
	};
	
	this.setImagePath = function (imagePath) {
		Z.Viewport.zoomAndPanAllStop(true);		
		Z.imagePath = Z.Utils.removeTrailingSlashCharacters(imagePath);
		var netConnector = new Z.NetConnector();
		Z.Viewport.loadImageProperties(netConnector);
	};
};



//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::: VIEWPORT FUNCTIONS ::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Z.ZoomifyViewport = function () {

	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	//:::::::::::::::::::::::::::::::: INIT FUNCTIONS :::::::::::::::::::::::::::::::::::
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	// Declare variables for viewport internal self-reference and for initialization completion.
	var self = this;
	var isInitialized = false;
	
	// Set viewport constants and static variables from value in Zoomify Image Folder "ImageProperties.xml" file or Zoomify Image File (PFF) header.
	var IMAGE_VERSION = -1;
	var HEADER_SIZE = 0
	var HEADER_SIZE_TOTAL = 0;
	var CHUNK_SIZE = 256;					
	var TILE_COUNT = 0;
	var TILES_PER_FOLDER = 256;
	var TILE_SIZE;
	
	// Set other defaults and calculate other constants.
	var TIERS_MAX_SCALE_UP = parseFloat(Z.Utils.getResource("DEFAULT_TIERSMAXSCALEUP"));
	var TIERS_MAX_SCALE_DOWN = TIERS_MAX_SCALE_UP / 2;
	var TILES_MAX_CACHE = parseInt(Z.Utils.getResource("DEFAULT_TILESMAXCACHE"), 10);
	var tlbrOffset = (Z.toolbarVisible == 1) ? Z.toolbarH : 0;

	// Declare variables for viewport displays.
	var viewportContainer, cD, cS;
	var viewportBackfillDisplay, bD, bS, bCtx;
	var viewportDisplay, vD, vS, vCtx;
	var watermarkDisplay, wD, wS;
	var hotspotsDisplay, hD, hS;

	// Create backfill, viewport, watermark, and hotspot displays within container that can be
	// dragged. Scaling occurs in display canvases directly or in tiles if in non-canvas browser.
	createDisplays();

	// Declare variables and lists for viewport tiers and tiles.
	var tierCount = 1;
	var tierCurrent = 0, tierBackfill = 0;
	var tierScale, tierScalePrior, tierBackfillScale;
	var tilesBackfillLoaded = [], tilesBackfillLoadingNames = [];
	var tierWs = [], tierHs = [], tierWInTiles = [], tierHInTiles = [],  tierTileCounts = [], tilesInCurrentView = [];
	var tilesLoadingNames = [], tilesLoaded = [], tilesLoadedNames = [], tilesPanningNames = [];
	var offsetChunks = [], offsetChunkBegins = [], tilesRetry = [], tilesRetryNames = [], tilesBackfillRetryNames = []; // Support for Zoomify Image File storage (PFF).
	var tilesToLoadTotal = 0;

	// Declare and set backfill threshold variables.
	var backfillTreshold2 = parseInt(Z.Utils.getResource("DEFAULT_BACKFILLTHRESHOLD2"), 10);
	var backfillTreshold1 = parseInt(Z.Utils.getResource("DEFAULT_BACKFILLTHRESHOLD1"), 10);
	var backfillChoice2 = parseInt(Z.Utils.getResource("DEFAULT_BACKFILLCHOICE2"), 10);
	var backfillChoice1 = parseInt(Z.Utils.getResource("DEFAULT_BACKFILLCHOICE1"), 10);
	var backfillChoice0 = parseInt(Z.Utils.getResource("DEFAULT_BACKFILLCHOICE0"), 10);

	// Declare variables for tile caching area and viewport.
	var PAN_BUFFER = parseInt(Z.Utils.getResource("DEFAULT_PANBUFFER"), 10);
	var viewW, viewH, viewL, viewT;
	var displayW, displayH, displayCtrX, displayCtrY, displayL, displayR, displayT, displayB;
	var backfillW, backfillH, backfillL, backfillT;

	// Set initial values for tile selection and caching areas.
	viewW = Z.viewerW;
	viewH = Z.viewerH;
	viewL = viewT = 0;

	// Reset viewport height and top if toolbar visible and static (no hide/show or show/hide).
	viewH -= tlbrOffset;
	if (Z.toolbarPosition == 0) { viewT += tlbrOffset; }

	// Declare variables for viewport mouse support.
	var mouseIsDown = false;
	var mouseOutDownPoint = null;
	
	// Declare variable for gesture support.
	var gestureInterval = null, gestureIntervalPercent = null, wasGesturing = false;
	var GESTURE_TEST_DURATION = parseInt(Z.Utils.getResource("DEFAULT_GESTURETESTDURATION"), 10);
	
	// Declare viewport variables for continuous zoom functions.
	var zoomStep = (parseFloat(Z.Utils.getResource("DEFAULT_ZOOMSTEP")) * Z.zoomSpeed);
	if (Z.mobileDevice) { zoomStep /= 2; }
	var panStep = Math.round(parseFloat(Z.Utils.getResource("DEFAULT_PANSTEP")) * Z.panSpeed);
	var panX = 0, panY = 0, zoom = 0, zapStepCount = 0, zoomPrior = 0;
	var ZAP_STEP_DURATION = parseInt(Z.Utils.getResource("DEFAULT_ZOOMANDPANSTEPDURATION"), 10);
	var zapTimer, zapTierCurrentZoomUnscaledX, zapTierCurrentZoomUnscaledY;
	var fadeInStep = (parseFloat(Z.Utils.getResource("DEFAULT_FADEINSTEP")) * Z.fadeInSpeed);
	var fadeInInterval;
	
	// Declare viewport variables for zoom-to-view functions.
	var ZAPTV_DURATION = parseInt(Z.Utils.getResource("DEFAULT_ZOOMANDPANTOVIEWDURATION"), 10);
	var ZAPTV_STEP_DURATION = parseInt(Z.Utils.getResource("DEFAULT_ZOOMANDPANTOVIEWSTEPDURATION"), 10);
	var zaptvSteps = ZAPTV_DURATION / ZAPTV_STEP_DURATION;
	var zaptvStepX, zaptvStepY, zaptvStepScale, zaptvStepBackfillScale;
	var zaptvTimer, zaptvStepsCount, zaptvDragPtStart;

	// Declare viewport variables for toggleFullPageView function.
	var fpBodW, fpBodH, fpBodO, fpDocO, fpContBC, fpContPos, fpContIdx;
	var buttonFPCancel, buttonFPCancelVisible;

	// Prepare watermark variables and image if optional parameter present.
	if (Z.Utils.isStrVal(Z.watermarkPath)) {
		var watermarkImage, watermarkAlpha;
		var watermarksX = [], watermarksY = [];
	}

	// Set initial dimensions and location of all viewport displays.
	sizeAndPosition(viewW, viewH, viewL, viewT);

	// Load image XML to get image width and height and tile size.
	var netConnector = new Z.NetConnector();
	loadImageProperties(netConnector);
	
	// Initialization on callback after XML load.
	this.initializeViewport = function (iW, iH, tSz, iTileCount, iVersion, iHeaderSize, iHeaderSizeTotal) {
		// Set viewport variables to XML or header values.
		Z.imageW = iW;
		Z.imageH = iH;				
		IMAGE_VERSION = iVersion;
		HEADER_SIZE = iHeaderSize;
		HEADER_SIZE_TOTAL = iHeaderSizeTotal;	
		TILE_COUNT = iTileCount;
		TILE_SIZE = tSz;

		// Record tier dimensions and tile counts for fast access and ensure zoom and pan
		// initial values and limits do not conflict.
		calculateTierValues();
		validateXYZDefaults();

		// Set canvas scale default.
		tierBackfillScale = convertZoomToTierScale(tierBackfill, Z.initialZ);
		tierScale = convertZoomToTierScale(tierCurrent, Z.initialZ);
		tierScalePrior = tierScale;		
		if (Z.useCanvas) { vCtx.scale(tierScale, tierScale); }
		
		// Load watermark, load backfill tiles, and set initial view.
		if (wD) { loadWatermark(); }
		precacheBackfillTiles();
		view(Z.initialX, Z.initialY, Z.initialZ);
		
		// Set initial display to full page if parameter true.
		if (Z.fullPageInit) { self.toggleFullPageView(true); }

		// Enable mouse and keyboard, initialize viewport, configure toolbar and navigator components.
		initializeViewportEventListeners();
		setInitialized(true);
		Z.Viewer.configureComponents();
	};
	
	// Initialization on callback after XML load after change of image path via setImagePath function.
	this.reinitializeViewport = function (iW, iH, tSz, iTileCount, iVersion, iHeaderSize, iHeaderSizeTotal) {		
		// Clear prior image values.
		setInitialized(false);
		clearAll();
		
		// Calculate new image values.
		Z.imageW = iW;
		Z.imageH = iH;			
		IMAGE_VERSION = iVersion;
		HEADER_SIZE = iHeaderSize;
		HEADER_SIZE_TOTAL = iHeaderSizeTotal;	
		TILE_COUNT = iTileCount;
		TILE_SIZE = tSz;
		
		calculateTierValues();
		validateXYZDefaults();		
		tierBackfillScale = convertZoomToTierScale(tierBackfill, Z.initialZ);
		tierScale = convertZoomToTierScale(tierCurrent, Z.initialZ);
		tierScalePrior = tierScale;		
		if (Z.useCanvas) { 
			vCtx.restore();
			vCtx.scale(tierScale, tierScale); 
		}		
		precacheBackfillTiles();
		sizeAndPosition(viewW, viewH, viewL, viewT);
		
		// Clear and reset displays.
		if (bD) { clearDisplay(bD); }
		if (vD) { clearDisplay(vD); }
		if (wD) { clearDisplay(wD); }
		view(Z.initialX, Z.initialY, Z.initialZ);
		setInitialized(true);
		
		// Reinitialize related components.
		if (Z.navigatorVisible > 0) { Z.Navigator.setImagePath(Z.imagePath); }
	};
	
	function clearAll () {
		tierCount = 1;
		tierCurrent = 0; tierBackfill = 0;
		tilesBackfillLoaded = []; tilesBackfillLoadingNames = [];
		tierWs = []; tierHs = []; tierWInTiles = []; tierHInTiles = [];  tierTileCounts = []; tilesInCurrentView = [];
		tilesLoadingNames = []; tilesLoaded = []; tilesLoadedNames = []; tilesPanningNames = [];
		offsetChunks = []; offsetChunkBegins = []; tilesRetry = [], tilesRetryNames = [], tilesBackfillRetryNames = [];
		tilesToLoadTotal = 0;	
	};



	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	//:::::::::::::::::::::::::::: GET & SET FUNCTIONS :::::::::::::::::::::::::::
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	this.getInitialized = function () {
		return getInitialized();
	};

	this.getW = function () {
		return displayW;
	};

	this.getH = function () {
		return displayH;
	};

	this.getTierCount = function () {
		return tierCount;
	};

	this.getTileSize = function () {
		return TILE_SIZE;
	};

	this.getTierCurrent = function () {
		return tierCurrent;
	};

	this.getTierScale = function () {
		return tierScale;
	};

	this.getTierScaleAsZoom = function () {
		var currentZ = convertTierScaleToZoom(tierCurrent, tierScale);
		return currentZ;
	};

	this.getTiersMaxScaleUp = function () {
		return TIERS_MAX_SCALE_UP;
	};

	this.getTiersMaxScaleDown = function () {
		return TIERS_MAX_SCALE_DOWN;
	};

	this.getTilesMaxCache = function () {
		return TILES_MAX_CACHE;
	};

	this.getTierWs = function () {
		return tierWs.join(",");
	};

	this.getTierHs = function () {
		return tierHs.join(", ");
	};

	this.getTierTileCounts = function () {
		return tierTileCounts.join(", ");
	};

	this.getTilesLoadingNames = function () {
		var tilesLoading = (tilesLoadingNames.join(", ") == "") ? "Current view loading complete" : tilesLoadingNames.join(", ");
		return tilesLoading;
	};

	this.setSizeAndPosition = function (width, height, left, top) {
		sizeAndPosition(width, height, left, top);
	};



	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	//:::::::::::::::::::::::::::::::: CORE FUNCTIONS :::::::::::::::::::::::::::::::
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	function getInitialized () {
		return isInitialized;
	};

	function setInitialized (value) {
		isInitialized = value;
	};

	function createDisplays () {
		// Create draggable container for backfill, viewport, watermark, and hotspot displays.
		// Scaling occurs in display canvases directly or in tiles if in non-canvas browser.
		// Set position 'absolute' within parent viewerDisplay container that is set 'relative'.
		viewportContainer = Z.Utils.createContainerElement("div", "viewportContainer", "inline-block", "absolute", "visible", "1px", "1px", "0px", "0px", "none", "0px", "transparent none", "0px", "0px");
		Z.ViewerDisplay.appendChild(viewportContainer);
		cD = viewportContainer;
		cS = cD.style;

		// Create background display to fill gaps between foreground tiles in viewportDisplay.
		viewportBackfillDisplay = Z.Utils.createContainerElement(Z.useCanvas ? "canvas" : "div", "viewportBackfillDisplay", "inline-block", "absolute", "visible", "1px", "1px", "0px", "0px", "none", "0px", "transparent none", "0px", "0px");
		viewportContainer.appendChild(viewportBackfillDisplay);
		bD = viewportBackfillDisplay;
		bS = bD.style;

		// Create canvas or div container for image tiles.
		viewportDisplay = Z.Utils.createContainerElement(Z.useCanvas ? "canvas" : "div", "viewportDisplay", "inline-block", "absolute", "visible", "1px", "1px", "0px", "0px", "none", "0px", "transparent none", "0px", "0px");
		viewportContainer.appendChild(viewportDisplay);
		vD = viewportDisplay;
		vS = vD.style;

		// Create canvas or div container for watermarks.
		if (Z.Utils.isStrVal(Z.watermarkPath)) {
			watermarkDisplay = Z.Utils.createContainerElement("div", "watermarkDisplay", "inline-block", "absolute", "visible", "1px", "1px", "0px", "0px", "none", "0px", "transparent none", "0px", "0px");
			viewportContainer.appendChild(watermarkDisplay);
			wD = watermarkDisplay;
			wS = wD.style;
		}

		// Create canvas or div container for hotspots.
		if (Z.Utils.isStrVal(Z.hotspotPath)) {
			hotspotsDisplay = Z.Utils.createContainerElement("div", "hotspotsDisplay", "inline-block", "absolute", "visible", "1px", "1px", "0px", "0px", "none", "0px", "transparent none", "0px", "0px");
			viewportContainer.appendChild(hotspotsDisplay);
			hD = hotspotsDisplay;
			hS = hD.style;
		}

		// Create canvas access variables.
		if (Z.useCanvas) {
			bCtx = bD.getContext("2d");
			vCtx = vD.getContext("2d");
		} else {
			bD.innerHTML = "";
			vD.innerHTML = "";
		}
		if (wD) { wD.innerHTML = ""; }
		if (hD) { hD.innerHTML = ""; }
	};

	function sizeAndPosition (width, height, left, top) {
		// Set Viewport size and set base values or subsequent gets and sets will fail.
		if (!left) { left = 0; }
		if (!top) { top = 0; }
		viewW = width;
		viewH = height;
		displayW = viewW * PAN_BUFFER;
		displayH = viewH * PAN_BUFFER;
		displayCtrX = displayW / 2;
		displayCtrY = displayH / 2;
		displayL = -((displayW - viewW) / 2) + left;
		displayR = ((displayW - viewW) / 2) + left;
		displayT = -((displayH - viewH) / 2) + top;
		displayB = ((displayH - viewH) / 2) + top;

		cD.width = displayW;
		cD.height = displayH;
		cS.width = displayW + "px";
		cS.height = displayH + "px";

		// Set container position. Viewport, watermark, and hotspot display values are static as
		// they move via the container. Backfill display changes position and size as it scales
		// to support Navigator panning.
		cS.left =  displayL + "px";
		cS.top =  displayT + "px";

		// Sync viewport display size.
		vD.width = displayW;
		vD.height = displayH;

		// Sync watermark display size.
		if (wD) {
			wD.width = displayW;
			wD.height = displayH;
			wS.width = displayW + "px";
			wS.height = displayH + "px";
		}

		// Set drawing origin coordinates to viewport display center.
		if (Z.useCanvas) {
			vCtx.translate(displayCtrX, displayCtrY);
			vCtx.save();
		}
		// No sizeAndPosition steps required here for non-canvas browsers because positioning
		// occurs in drawTileInHTML function based on x and y values passed in by displayTile.
	};

	this.loadImageProperties = function (netCnnctr) {
		loadImageProperties(netCnnctr);
	};
	
	function loadImageProperties (netCnnctr) {
		// Load image properties from Zoomify Image Folder XML file or Zoomify Image File PFF header or other specified tile source.
		if (Z.tileSource == "ZoomifyImageFolder") {
			var imageXMLPath = Z.Utils.cacheProofPath(Z.imagePath + "/" + "ImageProperties.xml");
			netCnnctr.loadXML(imageXMLPath);
		} else if (Z.tileSource == "ZoomifyImageFile") {		
			loadImagePropertiesFromPFF(netCnnctr);
		} else if (Z.tileSource == "OtherTileSource") { 
			loadImagePropertiesFromOtherTileSource(netCnnctr);
		}
	};
	
	function loadImagePropertiesFromPFF (netCnnctr) {
		// Define constants.
		var REQUEST_TYPE = 1; // 1 = header, 2 = offset, 0 = tile.
		var HEADER_START_BYTE = 0;
		var HEADER_END_BYTE = 1060;
		
		// Build data request with query string and send.
		var imgPathNoDot = Z.imagePath.replace(".", "%2E");  // Required for servlet.
		var imageXMLPath = Z.tileHandlerPathFull + "?file=" + imgPathNoDot  + "&requestType=" + REQUEST_TYPE + "&begin=" + HEADER_START_BYTE + "&end=" + HEADER_END_BYTE;
		netConnector.loadXML(imageXMLPath);
	};
	
	function loadImagePropertiesFromOtherTileSource (netCnnctr) {
		// Process other tile source here.
	};
			
	function calculateTierValues () {
		// Determine and record dimensions of each image tier.
		var tempW = Z.imageW;
		var tempH = Z.imageH;
		while (tempW > TILE_SIZE || tempH > TILE_SIZE) {
			tempW = tempW / 2;
			tempH = tempH / 2;
			tierCount++;
		}
		tempW = Z.imageW;
		tempH = Z.imageH;
		for (var t = tierCount - 1; t >= 0; t--) {
			tierWs[t] = tempW;
			tierHs[t] = tempH;
			tierWInTiles[t] = Math.ceil(tierWs[t] / TILE_SIZE);
			tierHInTiles[t] = Math.ceil(tierHs[t] / TILE_SIZE);
			tierTileCounts[t] = tierWInTiles[t] * tierHInTiles[t];
			tempW = tempW / 2;
			tempH = tempH / 2;
		}
	};

	function validateXYZDefaults () {
		// Set pan center point as default if required.
		if (!Z.initialX) { Z.initialX = Z.imageW / 2; }
		if (!Z.initialY) { Z.initialY = Z.imageH / 2; }

		// Calculate zoom to fit image within viewport.
		var currentFitZ = calculateZoomDecimalToFitDisplay();

		// If zoom-to-fit value has changed, clear non-custom defaults to be reset.
		if (Z.fitZ && Z.fitZ != currentFitZ) {
			if (Z.initialZ == Z.fitZ) { Z.initialZ = null; }
			if (Z.minZ == Z.fitZ) { Z.minZ = null; }
			if (Z.maxZ == Z.fitZ) { Z.maxZ = null; }
			Z.fitZ = null;
		}

		// Set defaults if required.
		if (!Z.fitZ) { Z.fitZ = currentFitZ; }
		if (!Z.initialZ) { Z.initialZ = Z.fitZ; }
		if (!Z.minZ) { Z.minZ = Z.fitZ; }
		if (!Z.maxZ) { Z.maxZ = Z.fitZ; }

		// Constrain initial zoom within min and max zoom.
		if (Z.initialZ < Z.minZ) { Z.initialZ = Z.minZ; }
		if (Z.initialZ > Z.maxZ) { Z.initialZ = Z.maxZ; }
	};

	function precacheBackfillTiles () {
		precacheBackfillTileNames(backfillChoice0);
		if (tierCount > backfillTreshold1) {
			precacheBackfillTileNames(backfillChoice1);
			if (tierCount > backfillTreshold2) {
				precacheBackfillTileNames(backfillChoice2);
			}
		}
		tilesBackfillLoadingNames.sort();
		tilesBackfillLoadingNames = Z.Utils.removeDups(tilesBackfillLoadingNames);
		loadNewTiles(tilesBackfillLoadingNames, onTileBackfillLoad, 0, "backfill");
	};

	function precacheBackfillTileNames (tier) {
		var backfillColumnR = tierWInTiles[tier] - 1;
		var backfillRowB = tierHInTiles[tier] - 1;
		for (var rowCntr = 0; rowCntr <= backfillRowB; rowCntr++) {
			for (var columnCntr = 0; columnCntr <= backfillColumnR; columnCntr++) {
				tilesBackfillLoadingNames.push(tier + "-" + columnCntr + "-" + rowCntr);
			}
		}
	};

	function updateViewWhilePanning (stepX, stepY) {
		// Streamlined version of updateView code (which is called in full form on pan end).
		var loadStart = new Date().getTime();

		// Streamlined recentering of container so new tiles drawn in viewport display are in view.
		var deltaX = displayL - parseFloat(cS.left);
		var deltaY = displayT - parseFloat(cS.top);
		cS.left = displayL + "px";
		cS.top = displayT + "px";
		Z.imageX = Z.imageX + (deltaX / Z.imageZ);
		Z.imageY = Z.imageY + (deltaY / Z.imageZ);
		redisplayCachedTiles(bD, tierBackfill, tilesBackfillLoaded, false, false);
		redisplayCachedTiles(vD, tierCurrent, tilesLoaded, false, false);
		redisplayWatermarks();

		// Limit bounds of tile selection to forward edge(s) in pan direction(s).
		var boundsTiles = getViewportBoundingBoxInTiles();
		if (stepX > 0) {
			boundsTiles.right = boundsTiles.left;
		} else if (stepX < 0) {
			boundsTiles.left = boundsTiles.right;
		}
		if (stepY > 0) {
			boundsTiles.bottom = boundsTiles.top;
		} else if (stepY < 0) {
			boundsTiles.top = boundsTiles.bottom;
		}

		// Streamlined tile name caching.
		for (var rowCntr = boundsTiles.top; rowCntr <= boundsTiles.bottom; rowCntr++) {
			for (var columnCntr = boundsTiles.left; columnCntr <= boundsTiles.right; columnCntr++) {
				tilesPanningNames.push(tierCurrent + "-" + columnCntr + "-" + rowCntr);
			}
		}

		// Get array length once for three uses below.
		var namesLength = tilesPanningNames.length;

		// Streamlined tile loading.
		for (var i = 0; i < namesLength; i++) {
			var tileName = tilesPanningNames[i];
			if (tileName) {
				var tile = new Tile(tileName);
				loadTile(tile, loadStart, onTileLoadWhilePanning);
			}
		}

		// Flush panning tiles cache.
		if (namesLength > 30) { tilesPanningNames.splice(namesLength - 30, 30); }
	};

	this.updateView = function (override) {
		// Main drawing function called after every change of view.  First reposition and
		// rescale backfill, viewport and related displays to transfer any panning and/or
		// scaling from container and CSS values to canvas or tile image values.

		// First ensure any action is needed.
		if (tierScale != tierScalePrior || Z.imageZ != zoomPrior || parseFloat(cS.left) != displayL || parseFloat(cS.top) != displayT || override) {
							
			// Recenter position of container of displays and reset any scaling of canvases or
			// tile image elements. This prepares all objects for new content.
			resetDisplays();
						
			// If zooming, change viewport and backfill tiers if necessary.
			zoomPrior = convertTierScaleToZoom(tierCurrent, tierScale);
			var delayClear = false;
			if (tierScale != tierScalePrior || Z.imageZ != zoomPrior || !isInitialized || override) {
				if ((Z.imageZ < zoomPrior) && !override && (TILES_MAX_CACHE > 0)) { delayClear = true; }
				selectTier();
				selectBackfillTier();
				redisplayCachedTiles(bD, tierBackfill, tilesBackfillLoaded, false, false);
			}
			
			// If zooming or panning, refill viewport with cached tiles or load new tiles.
			selectTiles();
			redisplayCachedTiles(vD, tierCurrent, tilesLoaded, true, delayClear);
			loadNewTiles(tilesLoadingNames, onTileLoad, 0); 

			// Update related components.
			syncToolbarSlider();
			syncNavigator();
		}
	};

	function resetDisplays () {
		// If display scaled or panned, reset scale and position to maintain container center
		// point and adjust current tiles to offset change and fill view while new tiles load.
		var redisplayRequired = false;
			
		// Test for scaling to reset.
		if (parseFloat(vS.width) != vD.width) {
		
			if (Z.useCanvas) {
				// Reset viewport display by returning to start values.
				vS.width = vD.width + "px";
				vS.height = vD.height + "px";
				vS.left = "0px";
				vS.top = "0px";

				// Reset viewport canvas then transfer CSS scaling to internal canvas scale.
				vCtx.restore();
				vCtx.save();
				vCtx.scale(tierScale, tierScale);

				// Backfill display does not require resetting here because for canvas browsers
				// its size is set only when the backfill tier changes in the selectBackfillTier 
				// function, and its position is controlled by the container it is in.  Note that 
				// backfill scaling occurs in the scaleTierToZoom or redisplayCachedTiles 
				// functions depending on whether it is implemented as a canvas or not. 
				// Positioning of its container and its offsetting within that container, occur below.
			} 
			// No 'else' clause here for non-canvas browsers because scaling occurs in the
			// drawTileInHTML function based on tierScale passed in by displayTile. The 
			// dimensions of the displays are unimportant as the tiles are drawn to overflow.
			// The positions of the displays are set below where panning changes are reset.

			redisplayRequired = true;
		}

		// Test for panning to reset.  Update imageX and imageY to offset so that
    		// when tiles are redrawn they will be in the same position in the view.
    		if (parseFloat(cS.left) != displayL || parseFloat(cS.top) != displayT) {
    		
    			// Calculate pan change in position.
			var deltaX = parseFloat(cS.left) - displayL;
    			var deltaY = parseFloat(cS.top) - displayT;
    			
    			// Recenter viewport display.
			cS.left = displayL + "px";
			cS.top = displayT + "px";

			// Reset backfill tracking variables and reposition backfill display to offset container
			// recentering. Backfill will not be redrawn in the redisplayRequired clause below.
			backfillL = (parseFloat(bS.left) + deltaX);
			backfillT = (parseFloat(bS.top) + deltaY);
			bS.left = backfillL + "px";
			bS.top = backfillT + "px";

			// Update imageX and imageY values to offset.
			var currentZ = convertTierScaleToZoom(tierCurrent, tierScale);
			Z.imageX = Z.imageX - (deltaX / currentZ);
    			Z.imageY = Z.imageY - (deltaY / currentZ);

			redisplayRequired = true;
		}

		if (redisplayRequired) {
			redisplayCachedTiles(vD, tierCurrent, tilesLoaded, true, false);

			// Sync related displays.
			redisplayWatermarks();
		}
    	};

	function selectTier() {
		// If tier has been scaled translate scaling to zoom tracking variable.
		if (tierScale != tierScalePrior) { Z.imageZ = zoomPrior; }
		if (Z.imageZ < Z.minZ) { Z.imageZ = Z.minZ; } // Prevent infinite loop on constraint failure in case of JS timing errors.

		// Determine best image tier and scale combination for intended zoom.
		var calcZ = TIERS_MAX_SCALE_UP;
		var tierTarget = tierCount;
		while(calcZ / 2 >= Z.imageZ) {
			tierTarget--;
			calcZ /= 2;
		}
		tierTarget = (tierTarget - 1 < 0) ? 0 : tierTarget - 1; // Convert to array base 0.
		var tierScaleTarget = convertZoomToTierScale(tierTarget, Z.imageZ);

		// If zooming, apply new tier and scale calculations.
		if (tierTarget != tierCurrent || tierScaleTarget != tierScale) {
			if (Z.useCanvas) {
				vCtx.restore();
				vCtx.save();
				vCtx.scale(tierScaleTarget, tierScaleTarget);
			}
			// No steps required here for non-canvas browsers because scaling occurs
			// in drawTileInHTML function based on tierScale passed in by displayTile.

			// Reset tier and zoom variables.
			tierCurrent = tierTarget;
			tierScale = tierScaleTarget;
		}
		tierScalePrior = tierScale;
	};

	function selectBackfillTier() {
		// Use high backfill tier behind high frontfill tiers to avoid blurry backfill when panning at full
		// zoom.  Use 0 backfill tier behind low frontfill tiers to avoid tiles gaps lining up.
		tierBackfill = (tierCurrent > backfillTreshold2) ? backfillChoice2 : (tierCurrent > backfillTreshold1) ? backfillChoice1 : backfillChoice0;
		tierBackfillScale = convertZoomToTierScale(tierBackfill, Z.imageZ);
		tierBackfillW = tierWs[tierBackfill];
		tierBackfillH = tierHs[tierBackfill];
		bD.width = tierBackfillW;
		bD.height = tierBackfillH;
		var backfillScaledW = tierBackfillW * tierBackfillScale;
		var backfillScaledH = tierBackfillH * tierBackfillScale;

		// Convert current pan position from image values to tier values.
		var deltaX = Z.imageX * Z.imageZ;
		var deltaY = Z.imageY * Z.imageZ;

		// Set backfill globals for use during fast scaling.
		backfillW = backfillScaledW;
		backfillH = backfillScaledH;	
		backfillL = (displayCtrX - deltaX);
		backfillT = (displayCtrY - deltaY);
		
		// Set backfill display dimensions and position.
		if (Z.useCanvas) {
			bS.width = backfillW + "px";
			bS.height = backfillH + "px";
		}
		bS.left = backfillL + "px";
		bS.top = backfillT + "px";
	};

	function selectTiles() {
		// Calculate tiles at edges of viewport for current view then store names of tiles in view.
		var boundsTiles = getViewportBoundingBoxInTiles();
		for (var rowCntr = boundsTiles.top, tB = boundsTiles.bottom; rowCntr <= tB; rowCntr++) {
			for (var columnCntr = boundsTiles.left, tR = boundsTiles.right; columnCntr <= tR; columnCntr++) {
				tilesLoadingNames.push(tierCurrent + "-" + columnCntr + "-" + rowCntr);
			}
		}

		// Identify required tiles that have not been previously loaded.
		tilesLoadedNames.sort();
		tilesLoadingNames.sort();
		tilesLoadedNames = Z.Utils.removeDups(tilesLoadedNames);
		tilesLoadingNames = Z.Utils.removeDups(tilesLoadingNames);

		// Identify tiles needed for current view that have been previously loaded.
		var tilesLoadingLoadedIntersection = Z.Utils.intersect(tilesLoadingNames, tilesLoadedNames);

		// Remove previously loaded tile names to allow redisplay rather than reload.
		tilesLoadingNames = Z.Utils.subtract(tilesLoadingNames, tilesLoadedNames);

		// Update progress display.
		tilesToLoadTotal = tilesLoadingNamesLength = tilesLoadingNames.length;
		if (Z.ToolbarDisplay && Z.Toolbar.getInitialized()) { Z.Toolbar.showProgress(tilesToLoadTotal, tilesLoadingNamesLength); }

		// Remove and re-add previously loaded tile names to promote so as to avoid clearing on cache validation.
		tilesLoadedNames = Z.Utils.subtract(tilesLoadedNames, tilesLoadingLoadedIntersection);
		tilesLoadedNames = tilesLoadedNames.concat(tilesLoadingLoadedIntersection);

		// Clear collection of tiles in current view before it is refilled in onTileLoad function.
		if (tilesLoadingNamesLength != 0) { tilesInCurrentView = []; }
	};

	function redisplayCachedTiles (display, tier, cacheArray, centerOut, delayClear) {
		// First clear tiles previously drawn.
		if (!delayClear) { clearDisplay(display); }
		
		// Redraw tiles previously loaded. 
		if (centerOut) {
			// Draw from middle sorted array up & down to approximate drawing from center of view out.
			var arrayMidpoint = Math.floor(cacheArray.length / 2);
			for (var i = arrayMidpoint, j = cacheArray.length; i < j; i++) {
				var tile = cacheArray[i];
				if (tile && tile.t == tier) {
					displayTile(display, tier, tile);
				}
				if (cacheArray.length-i-1 != i) {
					var tile = cacheArray[cacheArray.length-i-1];
					if (tile && tile.t == tier) {
						displayTile(display, tier, tile);
					}
				}
			}
		} else {
			// Draw simple, first to last.
			for (var i = 0, j = cacheArray.length; i < j; i++) {
				var tile = cacheArray[i];
				if (tile && tile.t == tier) {
					displayTile(display, tier, tile);
				}
			}		
		}
	};

	function loadNewTiles (tileNamesArray, loadHandler, centerOut, requester) {
		// Request required tiles not previously loaded.  
		if (tileNamesArray.length > 0 ) {
			var loadStart = new Date().getTime();
			if (centerOut) {
				// Draw from middle sorted array up & down to approximate drawing from center of view out.
				var arrayMidpoint = Math.floor(tileNamesArray.length / 2);
				for (var i = arrayMidpoint, j = tileNamesArray.length; i < j; i++) {
					var tileName = tileNamesArray[i];
					if (tileName) {
						var tile = new Tile(tileName, requester);
						loadTile(tile, loadStart, loadHandler);
					}
					if (tileNamesArray.length-i-1 != i) {
						var tileName = tileNamesArray[tileNamesArray.length-i-1];
						if (tileName) {
							var tile = new Tile(tileName, requester);
							loadTile(tile, loadStart, loadHandler);
						}
					}
				}
			} else {
				// Draw simple, first to last.
				for (var i = 0, j = tileNamesArray.length; i < j; i++) {
					var tileName = tileNamesArray[i];
					if (tileName) {
						var tile = new Tile(tileName, requester);
						loadTile(tile, loadStart, loadHandler);
					}
				}
			}
		}
	};

	function clearDisplay (display) {
		// Completely clear viewport including prior tiles better than backfill. Subsequent redraw
		// of new tiles will leave gaps with backfill showing rather than tiles from prior view.
		if (display) {
			if (Z.useCanvas && display.tagName == "CANVAS") {
				var displayCtx = display.getContext("2d");
				displayCtx.save();
				displayCtx.setTransform(1,0,0,1,0,0);
				displayCtx.clearRect(0,0,displayCtx.canvas.width,displayCtx.canvas.height);
				displayCtx.restore();
			} else {
				if (display.hasChildNodes()) {
					while (display.childNodes.length >= 1 ) {
						display.removeChild(display.firstChild );
					}
				}
			}
		}
	};

	function syncToolbarSlider () {
		// Set toolbar slider button position.
		if (Z.ToolbarDisplay && Z.Toolbar.getInitialized()) {
			var currentZoom = convertTierScaleToZoom(tierCurrent, tierScale);
			Z.Toolbar.syncSliderToViewport(currentZoom);
		}
	};

	function syncNavigator () {
		// Set navigator rectangle size and position.
		if (Z.Navigator && Z.Navigator.getInitialized()) {
			Z.Navigator.syncToViewport();
		}
	};

	function getViewportBoundingBoxInTiles () {
		// Get bounding box in image tiles for current view.
		return new BoundingBoxInTiles(getViewportBoundingBoxInPixels(), tierCurrent);
	};

	function getViewportBoundingBoxInPixels () {
		// Get bounding box coordinates in image pixels for current view.

		// Allow for pan in progress via movement of display.
		var canvasOffsetL = parseFloat(cS.left) - displayL;
		var canvasOffsetT = parseFloat(cS.top) - displayT;

		// Allow for CSS scaling calculations.
		if (Z.useCanvas) {
			var cssScale = parseFloat(cS.width) / cD.width;
			canvasOffsetL /= cssScale;
			canvasOffsetT /= cssScale;
		}

		// Convert offset pixels of any pan in progress to image pixels.
		var currentZ = convertTierScaleToZoom(tierCurrent, tierScale);
		if (canvasOffsetL != 0) { canvasOffsetL /= currentZ; }
		if (canvasOffsetT != 0) { canvasOffsetT /= currentZ; }

		return new BoundingBoxInPixels(Z.imageX - canvasOffsetL, Z.imageY - canvasOffsetT, -(viewW / 2), (viewW / 2), -(viewH / 2), (viewH / 2), currentZ);
	};

	function getViewportDisplayBoundingBoxInPixels () {
		// Get bounding box coordinates in image pixels for current view plus pan buffer border area.

		// Allow for pan in progress via movement of display.
		var canvasOffsetL = parseFloat(cS.left) - displayL;
		var canvasOffsetT = parseFloat(cS.top) - displayT;

		// Allow for CSS scaling calculations.
		if (Z.useCanvas) {
			var cssScale = parseFloat(cS.width) / cD.width;
			canvasOffsetL /= cssScale;
			canvasOffsetT /= cssScale;
		}

		// Convert offset pixels of any pan in progress to image pixels.
		var currentZ = convertTierScaleToZoom(tierCurrent, tierScale);
		if (canvasOffsetL != 0) { canvasOffsetL /= currentZ; }
		if (canvasOffsetT != 0) { canvasOffsetT /= currentZ; }

		return new BoundingBoxInPixels(Z.imageX - canvasOffsetL, Z.imageY - canvasOffsetT, -(displayW / 2), (displayW / 2), -(displayH / 2), (displayH / 2), currentZ);
	};

	function BoundingBoxInTiles (pixelsBoundingBox, tCurr) {
		// Caculate edges of view in image tiles of the current tier.
		var tierCurrentZoomUnscaled = convertTierScaleToZoom(tCurr, 1);
		var viewTileL = Math.floor(pixelsBoundingBox.left * tierCurrentZoomUnscaled / TILE_SIZE);
		var viewTileR = Math.floor(pixelsBoundingBox.right * tierCurrentZoomUnscaled / TILE_SIZE);
		var viewTileT = Math.floor(pixelsBoundingBox.top * tierCurrentZoomUnscaled / TILE_SIZE);
		var viewTileB = Math.floor(pixelsBoundingBox.bottom * tierCurrentZoomUnscaled / TILE_SIZE);
		
		// Constrain edge tile values to existing columns and rows.
		if (viewTileL < 0) { viewTileL = 0; }
		if (viewTileR > tierWInTiles[tierCurrent] - 1) { viewTileR = tierWInTiles[tierCurrent] - 1; }
		if (viewTileT < 0) { viewTileT = 0; }
		if (viewTileB > tierHInTiles[tierCurrent] - 1) { viewTileB = tierHInTiles[tierCurrent] - 1; }

		this.left = viewTileL;
		this.right = viewTileR;
		this.top = viewTileT;
		this.bottom = viewTileB;
	};

	function BoundingBoxInPixels (x, y, vpPixelsLeft, vpPixelsRight, vpPixelsTop, vpPixelsBottom, zoom) {
		// Convert any bounding box from viewport pixels to image pixels.
		this.left = x + (vpPixelsLeft / zoom);
		this.right = x + (vpPixelsRight / zoom);
		this.top = y + (vpPixelsTop / zoom);
		this.bottom = y + (vpPixelsBottom / zoom);
	};

	function convertTierScaleToZoom (tier, scale) {
		var zoom = scale * (tierWs[tier] / Z.imageW);
		return zoom;
	};

	function convertZoomToTierScale (tier, zoom) {
		var scale = zoom / (tierWs[tier] / Z.imageW);
		return scale;
	};

	function convertPageCoordsToViewportCoords (pagePixelX, pagePixelY) {
		var vpPixelX = pagePixelX - Z.Utils.getElementPosition(Z.ViewerDisplay).x;
		var vpPixelY = pagePixelY - Z.Utils.getElementPosition(Z.ViewerDisplay).y;
		return new Z.Utils.Point(vpPixelX, vpPixelY);
	};

	function convertViewportCoordsToImageCoords (viewportX, viewportY) {
		// Calculate current viewport center.
		var viewportCtrX = parseFloat(cS.left) + displayCtrX;
		var viewportCtrY = parseFloat(cS.top) + displayCtrY;

		// Calculate delta of input values from viewport center.
		var viewportDeltaX = viewportX - viewportCtrX;
		var viewportDeltaY = viewportY - viewportCtrY;

		// Scale delta to convert from viewport to image coordinates.
		var imageDeltaX = viewportDeltaX / Z.imageZ;
		var imageDeltaY = viewportDeltaY / Z.imageZ;

		// Combine with current image position to get image coordinates.
		var imageX = Z.imageX + imageDeltaX;
		var imageY = Z.imageY + imageDeltaY;

		return new Z.Utils.Point(imageX, imageY);
	};

	function convertImageCoordsToViewportCoords (imageX, imageY) {
		// Calculate delta of input values from current image position.
		var imageDeltaX = Z.imageX - imageX;
		var imageDeltaY = Z.imageY - imageY;

		// Scale delta to convert from image to viewport coordinates.
		var viewportDeltaX = imageDeltaX * Z.imageZ;
		var viewportDeltaY = imageDeltaY * Z.imageZ;

		// Convert viewport display center to viewport center.
		var viewportCtrX = parseFloat(cS.left) + displayCtrX;
		var viewportCtrY = parseFloat(cS.top) + displayCtrY;

		// Combine to get viewport coordinates.
		var viewportX = viewportCtrX - viewportDeltaX;
		var viewportY = viewportCtrY - viewportDeltaY;

		return new Z.Utils.Point(viewportX, viewportY);
	};

	function Tile (name, requester) {
		// Values used by drawTileOnCanvas and drawTileInHTML.
		this.name = name;
		this.t = parseInt(name.substring(0, name.indexOf("-")), 10);
		this.c = parseInt(name.substring(name.indexOf("-") + 1, name.lastIndexOf("-")), 10);
		this.r = parseInt(name.substring(name.lastIndexOf("-") + 1), 10);
		this.x = Math.floor(this.c * TILE_SIZE);
		this.y = Math.floor(this.r * TILE_SIZE);
		this.image = null;
		this.alpha = 0;
		this.url = self.formatTilePath(this.t, this.c, this.r, requester);

		// Values used only by drawTileInHTML.
		this.elmt = null;
		this.style = null;
	};

	this.formatTilePath = function (t, c, r, requester) {
		var tilePath;
		if (Z.tileSource == "ZoomifyImageFolder") {	
			// URI for each tile includes image folder path, tile group subfolder name, and tile filename.
			var offset = r * tierWInTiles[t] + c;
			for (var i = 0; i < t; i++) { offset += tierTileCounts[i]; }
			var tileGroupNum = Math.floor(offset / TILES_PER_FOLDER);
			tilePath = Z.imagePath + "/" + "TileGroup" + tileGroupNum + "/" + t + "-" + c + "-" + r + ".jpg";
			if (TILES_MAX_CACHE == 0) { tilePath = Z.Utils.cacheProofPath(tilePath); }
		} else if (Z.tileSource == "ZoomifyImageFile") {
			// Tile path is actual tile request to servlet or other server-side helper application.
			// Tile request is set to "offsetLoading" if new header offset chunk must be loaded from PFF.
			// Tile request otherwise includes image file path, request type, begin byte, end byte, image version, and header size.
			// Request types include: 1 = image file header, 2 = header offset chunk, 0 = image tile.
					
			var currentOffsetIndex = 0;
			var currentOffsetIndexBegin = 0;
			var currentOffsetChunk;
			var currentOffsetChunkBegin;
			var offsetChunkIndex;
			var offsetChunkIndexBegin;
			var offsetChunkBeginByte;
			var offsetChunkEndByte;
			var offsetChunkBeginBeginByte;
			var offsetChunkBeginEndByte;
			var tilePath = "offsetLoading";

			for (var tierCntr = tierCount - 1; tierCntr > t; tierCntr--) {
				currentOffsetIndex += tierTileCounts[tierCntr];
			}
			
			currentOffsetIndex += r * tierWInTiles[t] + c;
			currentOffsetChunk = Math.floor(currentOffsetIndex / CHUNK_SIZE);
			currentOffsetIndexBegin = (currentOffsetIndex - 1 == -1) ? 0 : currentOffsetIndex - 1;
			currentOffsetChunkBegin = Math.floor(currentOffsetIndexBegin / CHUNK_SIZE);

			if(offsetChunks[currentOffsetChunk] == undefined || offsetChunks[currentOffsetChunk] == "offsetLoading" || offsetChunks[currentOffsetChunkBegin] == undefined || offsetChunks[currentOffsetChunkBegin] == "offsetLoading") {
				var chunk = calculateChunk(t, c, r);
				tilesRetry.push(chunk + "," + t +"," + c +"," + r + "," + requester);

				// Debug options:
				//Z.Utils.trace("formatTilePath-currentOffsetChunk: " + currentOffsetChunk);
				//Z.Utils.trace("formatTilePath-currentOffsetChunkBegin: " + currentOffsetChunkBegin);
				//Z.Utils.trace("formatTilePath-tierTileCounts.toString(): " + tierTileCounts.toString());
				//Z.Utils.trace("formatTilePath-t, tierWInTiles[t]: " + t + ", " + tierWInTiles[t]);
				//Z.Utils.trace("formatTilePath-path, offset, t-c-r: " + Z.imagePath + ", " + offset + ", " + t + "-" + c + "-" + r);
				//Z.Utils.trace("formatTilePath-tilesRetry.toString(): " + tilesRetry.toString());
				
				// No redundant offset loads if call already in progress (element would be 'offsetLoading', not undefined).
				if (offsetChunks[currentOffsetChunk] == undefined) {
					offsetChunks[currentOffsetChunk] = "offsetLoading";
					offsetChunkBeginByte = HEADER_SIZE_TOTAL + CHUNK_SIZE * currentOffsetChunk * 8;
					offsetChunkEndByte = offsetChunkBeginByte + CHUNK_SIZE * 8;
					loadOffsetChunk(offsetChunkBeginByte, offsetChunkEndByte, chunk);
				}
				// No redundant offset loads if this chunk would be same as above (element would be 'offsetLoading', not undefined).
				if (offsetChunks[currentOffsetChunkBegin] == undefined) {
					offsetChunks[currentOffsetChunkBegin] = "offsetLoading";
					offsetChunkBeginBeginByte = HEADER_SIZE_TOTAL + CHUNK_SIZE * currentOffsetChunkBegin * 8;
					offsetChunkBeginEndByte = offsetChunkBeginBeginByte + CHUNK_SIZE * 8;
					loadOffsetChunk(offsetChunkBeginBeginByte, offsetChunkBeginEndByte, chunk);
				} 
			} else {
				var absoluteBeginning = Math.floor(offsetChunks[currentOffsetChunk][0]);
				var absoluteBeginningBegin = Math.floor(offsetChunks[currentOffsetChunkBegin][0]);
				var offsetString = offsetChunks[currentOffsetChunkBegin][1];
				var offsetString2 = offsetChunks[currentOffsetChunk][1];
				offsetChunkIndexBegin = 9 * (currentOffsetIndexBegin % CHUNK_SIZE);
				var tempInt = Math.floor(parseFloat(offsetString.substring(offsetChunkIndexBegin, offsetChunkIndexBegin + 9)));
				offsetChunkIndex = 9 * (currentOffsetIndex % CHUNK_SIZE);
				var tempInt2 = Math.floor(parseFloat(offsetString2.substring(offsetChunkIndex, offsetChunkIndex + 9)));
				var sByte = (currentOffsetIndex == 0) ? HEADER_SIZE_TOTAL + TILE_COUNT * 8 : absoluteBeginningBegin + tempInt;
				var eByte = absoluteBeginning + tempInt2;
				tilePath = Z.tileHandlerPathFull + "?file=" + Z.imagePath + "&requestType=0&begin=" + sByte.toString() + "&end=" + eByte.toString() + "&vers=" + IMAGE_VERSION.toString() + "&head=" + HEADER_SIZE.toString();
				
				// Debug options:
				//Z.Utils.trace("formatTilePath-currentOffsetIndex-currentOffsetChunk-currentOffsetChunkBegin: " + currentOffsetIndex + ", " + currentOffsetChunk + ", " + currentOffsetChunkBegin);
				//Z.Utils.trace("formatTilePath-begin-end-beginbegin-beginend: " + offsetChunkBeginByte + "," + offsetChunkEndByte + "," + offsetChunkBeginBeginByte + "," + offsetChunkBeginEndByte);
				//Z.Utils.trace("formatTilePath-offsetChunks last value: " + offsetChunks[offsetChunks.length-1]);
				//Z.Utils.trace("formatTilePath-tilePath: " + tilePath);
			}			
		//} else if (Z.tileSource == "OtherTileSource") { 
			// DEV NOTE: Process other tile source here.
		}		
		return tilePath;
	};
	
	function calculateChunk (t, c, r) {
		var currentOffsetIndex = 0;
		for (var tierCntr = tierCount - 1; tierCntr >= t; tierCntr--) { currentOffsetIndex += tierTileCounts[tierCntr]; }
		currentOffsetIndex += r * tierWInTiles[t] + c;
		var chunk = Math.floor(currentOffsetIndex / CHUNK_SIZE);
		return chunk;
	};

	function loadOffsetChunk (offsetStartByte, offsetEndByte, chunk) {				
		offsetChunkBegins[offsetStartByte] = chunk;
		var REQUEST_TYPE = 2; // 1 = header, 2 = offset, 0 = tile.
		
		// Build data request with query string and send.
		var imgPathNoDot = Z.imagePath.replace(".", "%2E");  // Required for servlet.
		var offsetChunkPath = Z.tileHandlerPathFull + "?file=" + imgPathNoDot + "&requestType=" + REQUEST_TYPE + "&begin=" + offsetStartByte + "&end=" + offsetEndByte;
		var netConnector = new Z.NetConnector();			
		netConnector.loadXML(offsetChunkPath);
	};

	this.parseOffsetChunk = function (xmlDoc) {	
		var begin = parseInt(xmlDoc.documentElement.getAttribute("BEGIN"));
		var replyData = xmlDoc.documentElement.getAttribute("REPLYDATA");		
		var chunk = offsetChunkBegins[begin];
		var offsetOfCurrentChunkBegin = Math.floor(((begin - HEADER_SIZE_TOTAL) / 8) / CHUNK_SIZE);
		offsetChunks[offsetOfCurrentChunkBegin] = new Array();
		offsetChunks[offsetOfCurrentChunkBegin] = replyData.split(",", 2);	
		loadTilesRetry(chunk);
	
		// Debug options:
		//Z.Utils.trace("parseOffsetChunk-begin: " + begin);
		//Z.Utils.trace("parseOffsetChunk-replyData: " + replyData);
		//Z.Utils.trace("parseOffsetChunk-offsetOfCurrentChunkBegin: " + offsetOfCurrentChunkBegin);
		//Z.Utils.trace("parseOffsetChunk-offsetChunks[offsetOfCurrentChunkBegin][0] & [1]: " + offsetChunks[offsetOfCurrentChunkBegin][0] + ", " + offsetChunks[offsetOfCurrentChunkBegin][1]);
	};	
	
	function loadTilesRetry (chunk) {
		for(var i = 0, j = tilesRetry.length; i < j; i++) {	
			var tilesRetryElements = tilesRetry[i].split(',');
			if (tilesRetryElements[0] == chunk) {					
				if (tilesRetryElements[4] != undefined && tilesRetryElements[4] != "backfill") {
					tilesRetryNames.push(tilesRetryElements[1] + "-" + tilesRetryElements[2] + "-" + tilesRetryElements[3]); // t,c,r
				} else {
					tilesBackfillRetryNames.push(tilesRetryElements[1] + "-" + tilesRetryElements[2] + "-" + tilesRetryElements[3]); // t,c,r
				}
				tilesRetry.splice(i, 1);
				i--;
				j--;
			}
		}
		if (tilesRetryNames.length > 0) { loadNewTiles(tilesRetryNames, onTileLoad, 0); }
		if (tilesBackfillRetryNames.length > 0) { loadNewTiles(tilesBackfillRetryNames, onTileBackfillLoad, 0, "backfill"); }
	};

	function loadTile (tile, time, loadHandler) {
		// Asynchronously load tile and ensure handler function is called upon loading.
		if (tile.url != "offsetLoading") {
			tile.loading = netConnector.loadTileImage(tile.url, Z.Utils.createCallback(null, loadHandler, tile, time));
		}
	};

	function onTileBackfillLoad (tile, time, image) {
		if (tile && time && image) {
			tile.image = image;
			var tilename = tile.name;

			// Move tile name from loading list to loaded list.
			tilesBackfillLoaded.push(tile);
			var index = tilesBackfillLoadingNames.indexOf(tilename);
			if (index != -1) { tilesBackfillLoadingNames.splice(index, 1); }
			if (Z.tileSource == "ZoomifyImageFile") { 
				index = tilesBackfillRetryNames.indexOf(tilename);
				if (index != -1) { tilesBackfillRetryNames.splice(index, 1); } 
			}
			
			// No backfill fade-in necessary. Tiles precached and load behind main display or outside view area.
			tile.alpha = 1; 
			
			// Draw tile if in current backfill tier, otherwise it will be drawn from cache when needed.
			if (tile.t == tierBackfill ) { displayTile(bD, tierBackfill, tile); }
		}
	};

	function onTileLoadWhilePanning (tile, time, image) {
		if (tile && time && image) {
			tile.image = image;
			var tilename = tile.name;
			displayTile(vD, tierCurrent, tile);
		}
	};

	function onTileLoad (tile, time, image) {
		if (tile && time && image) {
			tile.image = image;
			var tilename = tile.name;

			// Move tile name from loading list to loaded list.
			if (TILES_MAX_CACHE > 0) {
				tilesLoaded.push(tile);
				tilesLoadedNames.push(tilename);
			}
			var index = tilesLoadingNames.indexOf(tilename);
			if (index != -1) { tilesLoadingNames.splice(index, 1); }
			if (Z.tileSource == "ZoomifyImageFile") { 
				index = tilesRetryNames.indexOf(tilename);
				if (index != -1) { tilesRetryNames.splice(index, 1); } 
			}
					
			// Also create current view tile collection for faster zoomAndPanToView function.
			tilesInCurrentView.push(tile);
			
			// Draw tile with fade-in.
			if (!fadeInInterval) { fadeInInterval = window.setInterval(fadeInIntervalHandler, 50); }
					
			// Determine if all new tiles have loaded.
			var tilesLoadingNamesLength = tilesLoadingNames.length;			
			if(tilesLoadingNamesLength == 0) { 		
				
				// Fully clear and redraw viewport display if canvas in use.
				if (Z.useCanvas && (TILES_MAX_CACHE > 0)) { redisplayCachedTiles(vD, tierCurrent, tilesLoaded, true, false); }
				
				// Verify tiles cached in loaded list are under allowed maximum.
				if(tilesLoadedNames.length > TILES_MAX_CACHE) { validateCache(); }
			
				// Update value for toolbar progress display.
				tilesToLoadTotal = 0; 
			}
			
			// Update progress display if enabled.
			if (Z.ToolbarDisplay && Z.Toolbar.getInitialized()) { Z.Toolbar.showProgress(tilesToLoadTotal, tilesLoadingNamesLength); }
		}
	};

	function displayTile (display, tier, tile) {
		// Draw tile on screen using canvas or image elements as appropriate to browser support.  Apply
		// zoom of current tier to imageX and Y but do not apply scale of current tier as that scaling is function
		// of the context or container object.  Option: add tile.c to x and tile.r to y to display tile borders.
		var x = tile.x;
		var y = tile.y;	
		var tierCurrentZoomUnscaled = convertTierScaleToZoom(tier, 1);
		if (Z.useCanvas) {
			if (display == vD) {
				x -= (Z.imageX * tierCurrentZoomUnscaled);
				y -= (Z.imageY * tierCurrentZoomUnscaled);			
			} 
			drawTileOnCanvas(display, tile, x, y);
		} else {
			var scale;
			if (display == vD) {
				x -= ((Z.imageX * tierCurrentZoomUnscaled) - (displayCtrX / tierScale));
				y -= ((Z.imageY * tierCurrentZoomUnscaled) - (displayCtrY / tierScale));
				scale = tierScale;
			} else {
				scale = tierBackfillScale;
			}
			drawTileInHTML(display, tile, x, y, scale);
		}
	};

	function drawTileOnCanvas (container, tile, x, y) {
		var containerCtx = container.getContext("2d");
		if (Z.alphaSupported && tile.alpha < 1) { 
			containerCtx.globalAlpha = tile.alpha; 
			containerCtx.drawImage(tile.image, x, y);
			containerCtx.globalAlpha = 1;
		} else {
			containerCtx.drawImage(tile.image, x, y);
		}
	};

	function drawTileInHTML (container, tile, x, y, scale) {
		if (!tile.elmt) { // Simple test is OK because tile.elmt will not be numeric and thus not 0.
			tile.elmt = Z.Utils.createContainerElement("img");
			tile.elmt.onmousedown = Z.Utils.preventDefault; // Disable individual tile mouse-drag.
			Z.Utils.addEventListener(tile.elmt, "contextmenu", Z.Utils.preventDefault);
			tile.elmt.src = tile.url;
			tile.style = tile.elmt.style;
			tile.style.position = "absolute";
			Z.Utils.renderQuality (tile, Z.renderQuality);
			if (Z.cssTransformsSupported) { tile.style[Z.cssTransformProperty + "Origin"] = "0px 0px"; }
		}
		if (tile.elmt.parentNode != container) { container.appendChild(tile.elmt); }
		var tS = tile.style;
		
		// Speed redraw by hiding tile to avoid drawing on each change (width, height, left, top).
		tS.display = "none"; 
		
		if (Z.cssTransformsSupported) {
			// Backfill in non-IE browsers.
			tS[Z.cssTransformProperty] = ['matrix(', (tile.image.width / tile.elmt.width * scale).toFixed(8), ',0,0,', (tile.image.height / tile.elmt.height * scale).toFixed(8), ',', (x * scale).toFixed(8), Z.cssTransformNoUnits ? ',' : 'px,', (y * scale).toFixed(8), Z.cssTransformNoUnits ? ')' : 'px)'].join('');
		} else {
			// Backfill and frontfill in IE without canvas support.
			tS.width = (tile.image.width * scale) + "px";
			tS.height = (tile.image.height * scale) + "px";
			tS.left = (x * scale) + "px";
			tS.top = (y * scale) + "px";
		}
		
		// Unhide tile.
		tS.display = "inline-block";
					
		// Set alpha to fade-in tile if supported.
		Z.Utils.setOpacity(tile, tile.alpha);

		// Uncomment to display tile borders.
		//tile.elmt.style.borderStyle = "solid";
		//tile.elmt.style.borderWidth = "1px";
	};
		
	function fadeInIntervalHandler(event) {
		var completeCount = 0;
		for (var i = 0, j = tilesInCurrentView.length; i < j; i++) {
			var tile = tilesInCurrentView[i];
			if (tile.t == tierCurrent) { 
				if (tile.alpha < 1) {
					if (fadeInStep == 0) { tile.alpha = 1; }
					tile.alpha += fadeInStep;
					if (tile.alpha > 1) { tile.alpha = 1; }
					displayTile(vD, tierCurrent, tile); 
				} else {
					completeCount++;
					if (completeCount >= j) {
						window.clearInterval(fadeInInterval);
						fadeInInterval = null;
					}
				}
			}
		}	
	};		
	
	function validateCache () {
		// Clear cached tile names and tiles until under allowed maximum, allowing for different array orders.
		while (tilesLoadedNames.length > TILES_MAX_CACHE && tilesLoaded.length > 0) {
			j = tilesLoadedNames.indexOf(tilesLoaded[0].name);
			if (j != -1) { tilesLoadedNames.splice(j, 1); }
			tilesLoaded.splice(0, 1);
		}
	};

	function calculateZoomDecimalToFitDisplay () {
		// Determine zoom to exactly fit image within viewport.
		return (Z.imageW / Z.imageH > viewW / viewH) ? viewW / Z.imageW : viewH / Z.imageH;
	};

	function constrainPanByImageCoordinates (newCtrX, newCtrY) {
		// Preemptively limit new coordinates to ensure image will not be panned out of view.
		// This function is used when coordinates are directly set using the view function.
		if (Z.constrainPan) {
			var vpBoundsInImagePixels = new BoundingBoxInPixels(newCtrX, newCtrY, -(viewW / 2), (viewW / 2), -(viewH / 2), (viewH / 2), Z.imageZ);
			var viewL = vpBoundsInImagePixels.left;
			var viewR = vpBoundsInImagePixels.right;
			var viewT = vpBoundsInImagePixels.top;
			var viewB = vpBoundsInImagePixels.bottom;
			if (Z.imageW * Z.imageZ > viewW) {
				if (viewL < 0) {
					newCtrX = viewW / 2 / Z.imageZ;   // Zoomed in, limit pan right.
				} else if (viewR > Z.imageW) {
					newCtrX = Z.imageW - viewW / 2 / Z.imageZ;   // Zoomed in, limit pan left.
				}
			} else {
				newCtrX = Z.imageW / 2;  // Zoomed out, center image.
			}
			if (Z.imageH * Z.imageZ > viewH) {
				if (viewT < 0) {
					newCtrY = viewH / 2 / Z.imageZ;   // Zoomed in, limit pan down.
				} else if (viewB > Z.imageH) {
					newCtrY = Z.imageH - viewH / 2 / Z.imageZ;   // Zoomed in, limit pan up.
				}
			} else {
				newCtrY = Z.imageH / 2;    // Zoomed out, center image.
			}
		}
		return new Z.Utils.Point(newCtrX, newCtrY);
	};

	function constrainPanByViewportDisplayCoordinates (newL, newT) {
		// Modify new viewer display position to ensure image is in view. This function is used
		// during zoom-out to ensure display scaling is centered within view area.  Repositioning
		// of the display occurs within the viewport container at its current size and position.
		// Container and display size and and position are then reset in the resetDisplays
		// function in the updateView function, after zoom-out ends.
		if (Z.constrainPan) {
			// Calculate current zoom as scaling progresses. Note that no adjustment to 
			// imageX and imageY values is needed as in other constrainPan functions 
			// because this function is used when view is being scaled, not panned.
			var currentZ = convertTierScaleToZoom(tierCurrent, tierScale);
			var newImageCtrX = Z.imageX;
			var newImageCtrY = Z.imageY;
			
			var vpBoundsInImagePixels = new BoundingBoxInPixels(newImageCtrX, newImageCtrY, -(viewW / 2), (viewW / 2), -(viewH / 2), (viewH / 2), currentZ);
			var viewL = vpBoundsInImagePixels.left;
			var viewR = vpBoundsInImagePixels.right;
			var viewT = vpBoundsInImagePixels.top;
			var viewB = vpBoundsInImagePixels.bottom;
			if (Z.imageW * currentZ > viewW) {
				if (viewL < 0) {
					newL += viewL * currentZ;   // Zoomed in, limit pan right.
				} else if (viewR > Z.imageW) {
					newL -= (Z.imageW - viewR) * currentZ;   // Zoomed in, limit pan left.
				}
			} else {
				newL += (newImageCtrX - Z.imageW / 2) * currentZ;  // Zoomed out, center image.
			}
			if (Z.imageH * currentZ > viewH) {
				if (viewT < 0) {
					newT += viewT * currentZ;   // Zoomed in, limit pan down.
				} else if (viewB > Z.imageH) {
					newT -= (Z.imageH - viewB) * currentZ;   // Zoomed in, limit pan up.
				}
			} else {
				newT += (newImageCtrY - Z.imageH / 2) * currentZ;  // Zoomed out, center image.
			}
		}
		return new Z.Utils.Point(newL, newT);
	};

	function constrainPanByViewportContainerCoordinates (newL, newT) {
		// Modify new viewer displays container position to ensure image is in view. This
		// function is used during panning using the mouse, touch, key, or navigator.
		if (Z.constrainPan) {
			var newImageCtrX = Z.imageX - ((newL - displayL) / Z.imageZ);
			var newImageCtrY = Z.imageY - ((newT - displayT) / Z.imageZ);
			var vpBoundsInImagePixels = new BoundingBoxInPixels(newImageCtrX, newImageCtrY, -(viewW / 2), (viewW / 2), -(viewH / 2), (viewH / 2), Z.imageZ);
			var viewL = vpBoundsInImagePixels.left;
			var viewR = vpBoundsInImagePixels.right;
			var viewT = vpBoundsInImagePixels.top;
			var viewB = vpBoundsInImagePixels.bottom;
			if (Z.imageW * Z.imageZ > viewW) {
				if (viewL < 0) {
					newL += viewL * Z.imageZ;   // Zoomed in, limit pan right.
				} else if (viewR > Z.imageW) {
					newL -= (Z.imageW - viewR) * Z.imageZ;   // Zoomed in, limit pan left.
				}
			} else {
				newL += (newImageCtrX - Z.imageW / 2) * Z.imageZ;  // Zoomed out, center image.
			}
			if (Z.imageH * Z.imageZ > viewH) {
				if (viewT < 0) {
					newT += viewT * Z.imageZ;   // Zoomed in, limit pan down.
				} else if (viewB > Z.imageH) {
					newT -= (Z.imageH - viewB) * Z.imageZ;   // Zoomed in, limit pan up.
				}
			} else {
				newT += (newImageCtrY - Z.imageH / 2) * Z.imageZ;  // Zoomed out, center image.
			}
		}
		return new Z.Utils.Point(newL, newT);
	};

	function constrainZoom (z) {
		// Ensure image is not zoomed beyond specified min and max values.
		if (z > Z.maxZ) {
			z = Z.maxZ;
		} else if (z < Z.minZ) {
			z = Z.minZ;
		}
		return z;
	};

	function loadWatermark() {
		watermarkImage = new Image();
		watermarkAlpha = parseFloat(Z.Utils.getResource("DEFAULT_WATERMARKALPHA"));
		watermarkImage.url = Z.watermarkPath;
		watermarkImage.onload = displayWatermarks;
		watermarkImage.onerror = watermarkLoadingFailed;
		watermarkImage.src = Z.watermarkPath;
	};

	function displayWatermarks () {
		if (wD) {
			var markMinScale = parseFloat(Z.Utils.getResource("DEFAULT_WATERMARKMINSCALE"));
			var markSpanW = parseFloat(Z.Utils.getResource("DEFAULT_WATERMARKSPANW"));
			var markSpanH = parseFloat(Z.Utils.getResource("DEFAULT_WATERMARKSPANH"));
			var currentZ = convertTierScaleToZoom(tierCurrent, tierScale);
			var displayOffsetL = ((Z.imageW * currentZ) - wD.width) / 2;
			var displayOffsetT = ((Z.imageH * currentZ) - wD.height) / 2;
			var imageOffsetL = ((Z.imageW / 2) - Z.imageX) * currentZ;
			var imageOffsetT = ((Z.imageH / 2) - Z.imageY) * currentZ;

			var markScale = (currentZ < markMinScale) ? markMinScale : currentZ;
			var marksAcross = Math.round(Z.imageW / markSpanW);
			var marksDown = Math.round(Z.imageH / markSpanH);
			var bounds = getViewportDisplayBoundingBoxInPixels();
			wiScaledW = watermarkImage.width * markScale;
			wiScaledH = watermarkImage.height * markScale;
			var wicLPrior = 0, wicTPrior = 0;

			// Create rows and columns of watermarks, without overlap, within current view.
			for (var i = 1; i <= marksAcross; i++) {
				for (var j = 1; j <= marksDown; j++) {
					var x = Math.round(Z.imageW / (marksAcross + 1) * i);
					var y = Math.round(Z.imageH / (marksDown + 1) * j);
					if (x > bounds.left && x < bounds.right && y > bounds.top && y < bounds.bottom) {
						var wicL = Math.round((x * currentZ) - (wiScaledW / 2) - displayOffsetL + imageOffsetL);
						var wicT = Math.round((y * currentZ) - (wiScaledH / 2) - displayOffsetT + imageOffsetT);

						// Skip row/column if too close to row/column at left or above.
						if(Z.imageW > 4000) {
							var wicLTarget = wicLPrior + 100;
							var wicTTarget = wicTPrior + 100;
							if (wicL < wicLTarget && wicT < wicTTarget) { continue; }
							wicLPrior = wicL;
							wicTPrior = wicT;
						}

						var wI = watermarkImage.cloneNode(true);
						Z.Utils.setOpacity(wI, watermarkAlpha);
						wI.width = wiScaledW;
						wI.height = wiScaledH;
						var wiContainer = Z.Utils.createContainerElement("div", "wiC", "inline-block", "absolute", "hidden", wiScaledW + "px", wiScaledH + "px", wicL + "px", wicT + "px", "none", "0px", "transparent none", "0px", "0px");
						wiContainer.appendChild(wI);
						wD.appendChild(wiContainer);
						Z.Utils.addEventListener(wI, "contextmenu", Z.Utils.preventDefault);
						Z.Utils.addEventListener(wI, "mousedown", Z.Utils.preventDefault);
					}
				}
			}
		}
	};

	function redisplayWatermarks () {
		if (wD) {
			// First clear watermarks previously drawn.
			clearDisplay(wD);

			// Redraw watermarks at new scale.
			displayWatermarks();
		}
	};

	function watermarkLoadingFailed() {
		Z.Utils.showMessage(Z.Utils.getResource("ERROR_WATERMARKPATHINVALID") + this.url);
	};



	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	//:::::::::::::::::::::::::::: INTERACTION FUNCTIONS :::::::::::::::::::::::
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	this.setView =  function (x, y, z) {
		if (x == undefined || x == null) { x = (Z.imageW / 2); }
		if (y == undefined || y == null) { y = (Z.imageH / 2); }
		if (z == undefined || z == null) { 
			z = Z.fitZ; 
		} else if (z > 1) {
			z = z / 100;
		}
		view(x, y, z);
	};

	function view (x, y, z) {
		// View assignment function.
		self.zoomAndPanAllStop();
		Z.imageZ = constrainZoom(z);
		var constrainedPt = constrainPanByImageCoordinates(x, y);
		Z.imageX = constrainedPt.x;
		Z.imageY = constrainedPt.y;
		self.updateView(true);
	};

	this.zoom =  function (zoomDir) {
		switch(zoomDir) {
			case "out" :
				if (zoom >= 0) { zoom -= zoomStep; }
				break;
			case "in" :
				if (zoom <= 0) { zoom += zoomStep; }
				break;
			case "stop" :
				zoom = 0;
				break;
		}
		Z.zooming = (zoom == 0) ? "stop" : ((zoom > 0) ? "in" : "out");
		
		if (zoom !=0) {
			if (!zapTimer) {
				if (((zoom < 0) && (Z.imageZ > Z.minZ)) || ((zoom > 0) && (Z.imageZ < Z.maxZ))) {
					self.toggleWatermarks(false); 
				}
				if (!Z.useCanvas) { clearDisplay(wD); }
				zapTimer = window.setTimeout(zoomAndPanContinuousStep, ZAP_STEP_DURATION);
			}
		} else {
			self.zoomAndPanAllStop();
			self.toggleWatermarks(true);
		}
	};

	this.pan =  function (panDir) {
		// Pan direction refers to the pan of the view - the opposite of the movement of the image.
		switch(panDir) {
			case "left" :
				if (panX <= 0) { panX += panStep; }
				break;
			case "up" :
				if (panY <= 0) { panY += panStep; }
				break;
			case "down" :
				if (panY >= 0) { panY -= panStep; }
				break;
			case "right" :
				if (panX >= 0) { panX -= panStep; }
				break;
			case "horizontalStop" :
				panX = 0;
				break;
			case "verticalStop" :
				panY = 0;
				break;
			case "stop" :
				panX = 0;
				panY = 0;
				break;
		}
		Z.panningX = (panX == 0) ? "stop" : ((panX > 0) ? "left" : "right");
		Z.panningY = (panY == 0) ? "stop" : ((panY > 0) ? "up" : "down");
		zapTierCurrentZoomUnscaledX = Z.imageX * convertTierScaleToZoom(tierCurrent, 1);
		zapTierCurrentZoomUnscaledY = Z.imageY * convertTierScaleToZoom(tierCurrent, 1);
		
		if (panX !=0 || panY != 0) {
			if (!zapTimer) {
				self.toggleWatermarks(true);
				if (!Z.useCanvas) { clearDisplay(wD); }
				zapTimer = window.setTimeout(zoomAndPanContinuousStep, ZAP_STEP_DURATION);
			}
		} else {
			self.zoomAndPanAllStop();
			self.toggleWatermarks(true);
		}
	};

	function zoomAndPanContinuousStep () {
		if (zapTimer) {
			// If interval has not been cleared, pan and/or zoom one step.
			zoomAndPan(panX, panY, zoom, false);
			if (panX !== 0 || panY !== 0 || zoom !== 0) {
				// If pan and zoom variables have not been cleared, recall timer.				
				zapTimer = window.setTimeout(zoomAndPanContinuousStep, ZAP_STEP_DURATION);
			}
		}
	};

	this.zoomAndPanToView = function (targetImageX, targetImageY, targetImageZ) {
		// Transition smoothly to new view. Image coordinates input, converted to viewport coordinates,
		// then zoom and pan, then updateView to convert changes back to image coordinates.

		//First stop any zoom or pan in progress.
		self.zoomAndPanAllStop();
		
		// Do not apply zoom and pan constraints here. Will have to apply in zoomAndPan function 
		// regardless as permitted pan will change as zoom-in occurs.
		
		// Convert target pan values from image to viewport to viewport edge coordinates.
		var targetViewportPt = convertImageCoordsToViewportCoords(targetImageX, targetImageY);
		var cSTargetL = displayCtrX - targetViewportPt.x;
		var cSTargetT = displayCtrY - targetViewportPt.y;

		// Convert target zoom value from image to tier coordinates.
		var targetTierScale = convertZoomToTierScale(tierCurrent, targetImageZ);
		var targetBackfillTierScale = convertZoomToTierScale(tierBackfill, targetImageZ);

		// Calculate spans to travel.
		var spanX = parseFloat(cS.left) + cSTargetL;
		var spanY = parseFloat(cS.top) + cSTargetT;
		var spanScale = targetTierScale - tierScale;
		var spanBackfillScale = targetBackfillTierScale - tierBackfillScale;

		// Calculate steps to travel by.
		zaptvStepX = spanX / zaptvSteps;
		zaptvStepY = spanY / zaptvSteps;
		zaptvStepScale = spanScale / zaptvSteps;
		zaptvStepBackfillScale = spanBackfillScale / zaptvSteps;

		// Hide watermarks for fast, smooth zoom.
		self.toggleWatermarks(false);

		// Set global tracking variables and begin steps to target view.
		zaptvStepsCount = 0;
		zaptvTimer = window.setTimeout(zoomAndPanToViewStep, ZAPTV_STEP_DURATION);
	};

	function zoomAndPanToViewStep () {
		// If steps count is less than total needed, step.
		if (zaptvStepsCount < zaptvSteps) {		
			// Zoom and pan one step.
			zoomAndPan(zaptvStepX, zaptvStepY, zaptvStepScale, true);

			// Incremement steps count and request another step.
			zaptvStepsCount++;
			zaptvTimer = window.setTimeout(zoomAndPanToViewStep, ZAPTV_STEP_DURATION);
		} else {
			// Ensure exact finish.
			tierScale =(zaptvStepsCount * zaptvStepScale) + convertZoomToTierScale(tierCurrent, Z.imageZ);
			
			self.zoomAndPanAllStop();
			self.toggleWatermarks(true);
		}
	};

	function zoomAndPan (stepX, stepY, stepZ, zaptv) {
		// Pan constraint is applied separately to direct pan and to the indirect pan that
		// occurs when zooming out if image off-center. This enables prevention rather
		// than correction of dissallowed pan and avoids jitter at boundary conditions.

		var constrainedL, constrainedT, constrainedZoom;
		var viewPanned = false;
		var syncSlider = false;
		var syncNav = false;
		
		if (stepZ != 0) {
			// Calculate change to scale of tier.  For zoom buttons and keys, meter progress by
			// increasing weight of each step as tier scale grows and decreasing as scale shrinks.
			var targetScale = tierScale *  (1 + stepZ);
			
			// For click-zoom and other zooming to a target view, progress is metered by
			// calculation of step value in calling function such as zoomAndPanToView.
			if (zaptv) { targetScale = tierScale + stepZ; }	
			
			// Calculate target zoom for current step based on target scale for current step.
			var targetZoom = convertTierScaleToZoom(tierCurrent, targetScale);
			
			// Constrain target zoom.
			constrainedZoom = constrainZoom(targetZoom);
			if (constrainedZoom != Z.imageZ) {
			
				// Scale the viewport display to implement zoom step.
				var sync = scaleTierToZoom(constrainedZoom);
				
				if (sync) {	
					//if (zaptv) {
						// Adjust container position to offset X,Y change due to viewport scaling.
						// DEV NOTE: Code removed for beta.
					//}
					
					// Sync related displays and components.
					syncSlider = true;
					syncNav = true;
				}
			}
		} 
		
		if (stepX != 0 || stepY != 0) {				
			// Calculate new container position.
			var newL = parseFloat(cS.left) + stepX;
			var newT = parseFloat(cS.top) + stepY;
				
			// Calculate constrained new position.
			var constrainedNewPosition = constrainPanByViewportContainerCoordinates(newL, newT)
			constrainedL = constrainedNewPosition.x;
			constrainedT = constrainedNewPosition.y;
			
			// Set new viewport display position.
			cS.left = constrainedL + "px";
			cS.top = constrainedT + "px";
			
			viewPanned = true;
			syncNav = true;
		}

		// Sync related displays, toolbar slider, and navigator every other step,
		// if visible and if update required.
		var syncStep = (zapStepCount % 2 == 0);
		if (syncStep) {
			redisplayWatermarks();
			if (syncSlider) { syncToolbarSlider(); }
			if (syncNav)  { syncNavigator(); }
		}

		// Load new tiles as needed during panning (not zooming).
		if (viewPanned) {
			var canvasScale = (Z.useCanvas) ? (parseFloat(vS.width) / vD.width) : 1;
			var loadThreshold = Math.round(TILE_SIZE / panStep * tierScale * canvasScale);
			var loadStep = (zapStepCount % loadThreshold == 0 && zapStepCount != 0);

			// DEV NOTE: Updating tiles while panning disabled. Requires optimization.
			//if (loadStep) { updateViewWhilePanning(stepX, stepY); }
		}
	};

	this.zoomAndPanAllStop =  function (override) {
		zoomAndPanContinuousStop();
		zoomAndPanToViewStop();
		if (!override) { self.updateView(); }
	};

	function zoomAndPanContinuousStop () {
		if (zapTimer) {
			window.clearTimeout(zapTimer);
			zapTimer = null;
		}
		panX = 0;
		panY = 0;
		zoom = 0;
		zapStepCount = 0;
	};

	function zoomAndPanToViewStop () {
		// Call when completing zoomAndPanToView steps, when interrupting them, and when
		// beginning user interaction that would conflict with continued zoom and pan steps.
		if (zaptvTimer) {
			window.clearTimeout(zaptvTimer);
			zaptvTimer = null;
		}
	};

	this.scaleTierToZoom = function (imageZoom) {
		var sync = scaleTierToZoom(imageZoom);
		if (sync) {
			// Sync related displays and components.
			redisplayWatermarks();
			syncNavigator();
		}
	};

	function scaleTierToZoom (imageZoom) {
		// Main function implementing zoom through current tier scaling.  Used by zoomAndPan
		// function of zoom buttons and keys, sliderSlide and sliderSnap functions of slider, and
		// zoomAndPanToView function of Reset key and mouse-click and alt-click zoom features.
		// Note that it uses CSS scaling in canvas contexts and image element scaling otherwise.

		// Track whether function has scaled values so other components will be updated.
		var sync = false;

		// Calculate target tier scale from zoom input value.
		var targetTierScale = convertZoomToTierScale(tierCurrent, imageZoom);
	
		// If input zoom requires a change in scale, continue.
		if (targetTierScale != tierScale) {
			
			// Update tracking variables.
			tierScale = targetTierScale;
			tierBackfillScale = convertZoomToTierScale(tierBackfill, imageZoom);
			
			// Calculate scale adjusting for current scale previously applied to canvas or tiles.		
			var newScale = targetTierScale / tierScalePrior;
						
			// Calculate new size and position - X and Y from panning are applied when 
			// drawing tiles or, for backfill, below.
			var newW = displayW * newScale;
			var newH = displayH * newScale;
			var newL = (displayW - newW) / 2;
			var newT = (displayH - newH) / 2;

			// Constrain pan during zoom-out. 
			if (targetTierScale < tierScalePrior) {
				var constrainedPt = constrainPanByViewportDisplayCoordinates(newL, newT);
				cS.left = (displayL + constrainedPt.x - newL) + "px";
				cS.top = (displayT + constrainedPt.y - newT) + "px";
			}

			// Apply new scale to displays.
			if (Z.useCanvas) {				
				// Redraw display using CSS scaling.
				vS.width = newW + "px";
				vS.height = newH + "px";
				vS.left = newL + "px";
				vS.top = newT + "px";
				
				// Sync backfill display. Different size and position because backfill
				// is sized to content not viewport, to support Navigator panning.
				newW = backfillW * newScale;
				newH = backfillH * newScale;
				newL = backfillL + ((Z.imageX  * (1 - newScale)) * Z.imageZ);
				newT = backfillT + ((Z.imageY * (1 - newScale)) * Z.imageZ);
				
				bS.width = newW + "px";
				bS.height = newH + "px";
				bS.left = newL + "px";
				bS.top = newT + "px";
			} else {				
				// In non-canvas context, scaling of each tile image is required.
				redisplayCachedTiles(vD, tierCurrent, tilesLoaded, true, false);
				
				// Repositioning of backfill display is required due to sizing by tier and positioning by image X and Y values.
				tierBackfillW = tierWs[tierBackfill];
				tierBackfillH = tierHs[tierBackfill];
				bD.width = tierBackfillW;
				bD.height = tierBackfillH;
				var backfillScaledW = tierBackfillW * tierBackfillScale;
				var backfillScaledH = tierBackfillH * tierBackfillScale;
				var deltaX = Z.imageX * imageZoom;
				var deltaY = Z.imageY * imageZoom;
				backfillL = (displayCtrX - deltaX);
				backfillT = (displayCtrY - deltaY);
				
				bS.left = backfillL + "px";
				bS.top = backfillT + "px";
				
				// And scaling of each tile is also required for backfill display.
				redisplayCachedTiles(bD, tierBackfill, tilesBackfillLoaded, false, false);
			}			
			sync = true;
		}
		return sync;
	};

	this.reset =  function () {
		self.zoomAndPanToView(Z.initialX, Z.initialY, Z.initialZ);
	};

	this.toggleFullPageViewExternal = function () {
		// Assumes call from external toolbar and internal toolbar hidden. Sets flag to cause display
		// Cancel button over viewport in full page mode when external toolbar is hidden under viewport.
		buttonFPCancelVisible = true;
		self.toggleFullPageView();
	};

	this.toggleFullPageView =  function (override) {
		self.zoomAndPanAllStop();

		// If override is false (called by Escape key) set false, otherwise, set to opposite of current state.
		Z.fullPage = (override) ? override : !Z.fullPage;

		// Declare and set document references.
		var fpB = document.body;
		var fpbS = fpB.style;
		var fpdS = document.documentElement.style;
		var fpcS = Z.ViewerDisplay.style;

		var width = null;
		var height = null;

		// Update page display values.
		if (Z.fullPage) {
			// Record non-full-page values.
			fpBodW = fpbS.width;
			fpBodH = fpbS.height;
			fpBodO = fpbS.overflow;
			fpDocO = fpdS.overflow;
			fpContBC = fpcS.backgroundColor;
			fpContPos = fpcS.position;
			fpContIdx = fpcS.zIndex;

			// Apply full page values.
			var winDimensions;
			if (!Z.mobileDevice) {
				fpbS.width = "100%";
				fpbS.height = "100%";
			} else { 
				winDimensions = Z.Utils.getWindowSize();
				fpbS.width = winDimensions.x;
				fpbS.height = winDimensions.y;
			}
			fpbS.overflow = "hidden";
			fpdS.overflow = "hidden";
			fpcS.backgroundColor = Z.Utils.getResource("DEFAULT_FULLPAGEBACKCOLOR");
			fpcS.position = "fixed";
			fpcS.zIndex = "99999999";

			winDimensions = Z.Utils.getWindowSize();
			width = winDimensions.x;
			height = winDimensions.y;
		} else {
			// Reset recorded non-full-page values.
			fpbS.width = fpBodW;
			fpbS.height = fpBodH;
			fpbS.overflow = fpBodO;
			fpdS.overflow = fpDocO;
			fpcS.backgroundColor = fpContBC;
			fpcS.position = "relative";
			fpcS.zIndex = fpContIdx;

			var containerS = Z.Utils.getElementStyle(Z.pageContainer);
			width = parseFloat(containerS.width);
			height = parseFloat(containerS.height);
			if (isNaN(width)) { width = Z.ViewerDisplay.clientWidth; }
			if (isNaN(height)) { height = Z.ViewerDisplay.clientHeight; }
			
			buttonFPCancelVisible = false;
		}
		
		// Update global viewer size values.
		Z.viewerW = width;
		Z.viewerH = height;
		
		// Update viewport size and position values.
		sizeAndPosition(width, height);
		
		// If using external toolbar in page, display cancel button over viewport.		
		showButtonFPCancel(buttonFPCancelVisible);
		
		// Update component size and position values.
		if (Z.ToolbarDisplay && Z.Toolbar.getInitialized()) { 
			Z.toolbarCurrentW = (Z.toolbarW == -1) ? width : Z.toolbarW;
			var toolbarTop = (Z.toolbarPosition == 1) ? Z.viewerH - Z.toolbarH : 0;
			Z.Toolbar.setSizeAndPosition(Z.toolbarCurrentW, null, null, toolbarTop); 
		}
		if (Z.NavigatorDisplay && Z.Navigator.getInitialized()) { Z.Navigator.setSizeAndPosition(Z.navigatorW, Z.navigatorH, Z.navigatorL-1, Z.navigatorT-1); }

		// Update viewer min and max defaults for resized viewport. Note that zoom-to-fit will be
		// applied if required when changing to full page mode, but not when returning from it.
		validateXYZDefaults();

		// Apply constraints to new view.
		Z.imageZ = constrainZoom(Z.imageZ);
		if (Z.constrainPan) {
			var x = parseFloat(cS.left);
			var y = parseFloat(cS.top);
			var constrainedPt = constrainPanByViewportContainerCoordinates(x, y);
			cS.left = constrainedPt.x + "px";
			cS.top = constrainedPt.y + "px";
		}

		self.updateView(true);
	};
	
	function showButtonFPCancel (value) {
		if (value) {
			if (!buttonFPCancel) { configureButtonFPCancel(); }
			buttonFPCancel.elmt.style.display = "inline-block";
		} else {
			if (buttonFPCancel) { buttonFPCancel.elmt.style.display = "none"; }
		}
	};
	
	function configureButtonFPCancel () {
		var btnTxt = Z.Utils.getResource("DEFAULT_FPCANCELBUTTONTEXT");
		var btnW = 34;
		var btnH = 34;
		var btnMargin = 20;
		var btnL = parseFloat(Z.viewerW) - (btnW + btnMargin);
		var btnT = parseFloat(Z.viewerH) - (btnH + btnMargin);
		var btnColor = Z.Utils.getResource("DEFAULT_FPCANCELBUTTONCOLOR");
		buttonFPCancel = new Z.Utils.Button("buttonFPCancel", btnTxt, null, null, null, null, btnW + "px", btnH + "px", btnL + "px", btnT + "px", "mousedown", buttonFPCancelHandler, "TIP_CANCELFULLPAGE", "solid", "1px", btnColor, "0px", "0px");
		Z.ViewerDisplay.appendChild(buttonFPCancel.elmt);	
	};
	
	function buttonFPCancelHandler () {
		self.toggleFullPageView(false);
	};
	
	this.toggleBackfill = function () {
		var bS = Z.ViewerDisplay.firstChild.childNodes[0].style;
		bS.display = (bS.display == "none") ? "inline-block" : "none";
	};

	this.toggleDisplay = function () {
		var vS = Z.ViewerDisplay.firstChild.childNodes[1].style;
		vS.display = (vS.display == "none") ? "inline-block" : "none";
	};
	
	this.toggleWatermarks = function (override) {
		if (wS) {
			var setMarksVisible = (override) ? override : !(wS.display == "inline-block");
			wS.display = (setMarksVisible) ? "inline-block" : "none";
		}
	};

	this.toggleConstrainPan = function () {
		Z.constrainPan = !Z.constrainPan;
		if (Z.constrainPan) {
			var x = parseFloat(vS.left);
			var y = parseFloat(vS.top);
			var constrainedPt = constrainPanByViewportContainerCoordinates(x, y);
			cS.left = constrainedPt.x + "px";
			cS.top = constrainedPt.y + "px";
			self.updateView();
		}
	};

	this.getClickZoomCoords3D = function (evnt, drgPtEnd, tCurrent, tScale) {
		// Set condition for zooming in or out by more than one tier.
		var tierSkipThreshold = parseFloat(Z.Utils.getResource("DEFAULT_CLICKZOOMTIERSKIPTHRESHOLD"));

		// Calculate image coordinates of click and set default target zoom.
		var viewportClickPt = convertPageCoordsToViewportCoords(drgPtEnd.x, drgPtEnd.y);
		var imageClickPt = convertViewportCoordsToImageCoords(viewportClickPt.x, viewportClickPt.y);
		var targetZ = convertTierScaleToZoom(tCurrent, tScale);

 		// Calculate target zoom for next or prior tier. If very close to next tier, skip over it.
		if (!evnt.altKey) {  // Zooming in.
			if (tScale < 1 - tierSkipThreshold) {
				targetZ = convertTierScaleToZoom(tCurrent, 1);
			} else if (tCurrent < tierCount - 1) {
				targetZ = convertTierScaleToZoom(tCurrent + 1, 1);
			}
		} else {  // Zooming out.
			if (tScale > 1 + tierSkipThreshold) {
				targetZ = convertTierScaleToZoom(tCurrent, 1);
			} else if (tCurrent > 0) {
				targetZ = convertTierScaleToZoom(tCurrent - 1, 1);
			}
			// If nearly to zoom-to-fit, set to zoom-to-fit.
			if ((targetZ - Z.fitZ) <  tierSkipThreshold) { targetZ = Z.fitZ; }
		}

		return new Z.Utils.Point3D(imageClickPt.x, imageClickPt.y, targetZ);
	};

	this.syncToNavigator = function (currentX, currentY) {
		// Sync viewport display to navigator rectangle.
		var deltaScaledX = -(currentX - Z.imageX);
		var deltaScaledY = -(currentY - Z.imageY);
		var deltaX = deltaScaledX * Z.imageZ;
		var deltaY = deltaScaledY * Z.imageZ;
		var newX = deltaX + displayL;
		var newY = deltaY + displayT;
		var constrainedPt = constrainPanByViewportContainerCoordinates(newX, newY)
		cS.left = constrainedPt.x + "px";
		cS.top = constrainedPt.y + "px";
	};

	this.calculateCurrentCenterCoordinates = function (constPt) {
		if (!constPt) { var constPt = new Z.Utils.Point(parseFloat(cS.left), parseFloat(cS.top)); }
		var deltaX = constPt.x - displayL;
		var deltaY = constPt.y - displayT;
		var deltaScaledX = deltaX / Z.imageZ;
		var deltaScaledY = deltaY / Z.imageZ;
		var currentX = Z.imageX - deltaScaledX;
		var currentY = Z.imageY - deltaScaledY;
		return new Z.Utils.Point(currentX, currentY);
	};


	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	//:::::::::::::::::::::::::::::::::: EVENT FUNCTIONS ::::::::::::::::::::::::::::
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	function initializeViewportEventListeners() {
		// Handle viewport mouse and keyboards events.
		Z.Utils.addEventListener(document, "keydown", keyDownHandler);
		Z.Utils.addEventListener(document, "keyup", keyUpHandler);
		if (!Z.mobileDevice) {
			// Event handlers for browser contexts with mouse support.
			Z.Utils.addEventListener(Z.ViewerDisplay, "mouseover", viewerDisplayMouseOverHandler);
			Z.Utils.addEventListener(Z.ViewerDisplay, "mouseout", viewerDisplayMouseOutHandler);
			Z.Utils.addEventListener(Z.ViewerDisplay, "mousemove", Z.Utils.preventDefault);
			Z.Utils.addEventListener(cD, "mousedown", viewportDisplayMouseDownHandler);
			Z.Utils.addEventListener(cD, "mousemove", Z.Utils.preventDefault);
		} else {
			// Event handlers for mobile devices.
			Z.Utils.addEventListener(cD, "touchstart", viewerDisplayTouchStartHandler);
			Z.Utils.addEventListener(cD, "touchmove", viewerDisplayTouchMoveHandler);
			Z.Utils.addEventListener(cD, "touchend", viewerDisplayTouchEndHandler);
			Z.Utils.addEventListener(cD, "touchcancel", viewerDisplayTouchCancelHandler);
			Z.Utils.addEventListener(cD, "gesturestart", viewerDisplayGestureStartHandler);
			Z.Utils.addEventListener(cD, "gesturechange", viewerDisplayGestureChangeHandler);
			Z.Utils.addEventListener(cD, "gestureend", viewerDisplayGestureEndHandler);
			
			// The following handler assignment approach is necessary for iOS to properly respond.
			document.getElementsByTagName("body")[0].onorientationchange = orientationChangeHandler;
			//Z.Utils.addEventListener(document, "onresize", orientationChangeHandler);
		}		
		
		// Disable right-click / control-click / click-hold menu.
		Z.Utils.addEventListener(bD, "contextmenu", Z.Utils.preventDefault);
		Z.Utils.addEventListener(vD, "contextmenu", Z.Utils.preventDefault);
		if (wD) { Z.Utils.addEventListener(wD, "contextmenu", Z.Utils.preventDefault); }
		if (hD) { Z.Utils.addEventListener(hD, "contextmenu", Z.Utils.preventDefault); }
	};

	function viewerDisplayMouseOverHandler (event) {
		// Block if moving within viewer display or subelements.
		var targetIsInViewer = Z.Utils.nodeIsInViewer(Z.Utils.target(Z.Utils.event(event)));
		var relatedTargetIsInViewer = Z.Utils.nodeIsInViewer(Z.Utils.relatedTarget(event));
		if (!(targetIsInViewer && relatedTargetIsInViewer)) {
			// Mouse-over bubbles from navigator or toolbar blocked by stop propagation handlers. Mouse-overs not
			// needed on return from outside viewer as components would be hidden if toolbar mode enables hiding.
			if (Z.ToolbarDisplay && (Z.toolbarVisible > 1)) { Z.Toolbar.show(true); }
			if (Z.NavigatorDisplay && Z.navigatorVisible > 1) { Z.Navigator.setVisibility(true); }
			mouseOutDownPoint = null;
		}
	};

	function viewportDisplayMouseDownHandler (event) {
		if (Z.Utils.isRightMouseButton(event)) { return; } // Prevent zoom on right-click.
		mouseIsDown = true;
		var mPt = Z.Utils.getMousePosition(event);
		zaptvDragPtStart = new Z.Utils.Point(mPt.x, mPt.y);
		cD.mouseXPrior = mPt.x;
		cD.mouseYPrior = mPt.y;
		Z.Utils.addEventListener(document, "mousemove", viewerDisplayMouseMoveHandler);
		Z.Utils.addEventListener(cD, "mouseup", viewerDisplayMouseUpHandler);
		Z.Utils.addEventListener(document, "mouseup", viewerDisplayMouseUpHandler);
		return false;
	};

	function viewerDisplayMouseMoveHandler (event) {
		if (!Z.mousePan) { return; }  // Disallow mouse panning if parameter false.

		// Calculate change in mouse position.
		var event = Z.Utils.event(event);
		var mPt = Z.Utils.getMousePosition(event);
		var xPos = mPt.x - cD.mouseXPrior;
		var yPos = mPt.y - cD.mouseYPrior;

		if (!isNaN(xPos) && !isNaN(yPos)) {
			// Calculate new position of displays container.
			var newL = parseFloat(cS.left) + xPos;
			var newT = parseFloat(cS.top) + yPos;

			// Constrain new position.
			var constrainedPt = constrainPanByViewportContainerCoordinates(newL, newT);
			cS.left = constrainedPt.x + "px";
			cS.top = constrainedPt.y + "px";

			// Update stored page coordinates for next call to this function.
			cD.mouseXPrior = mPt.x;
			cD.mouseYPrior = mPt.y;

			if (Z.Navigator) {
				// Sync navigator rectangle if visible.
				var currentCenterPt = self.calculateCurrentCenterCoordinates(constrainedPt);
				Z.Navigator.syncNavigatorRectanglePosition(currentCenterPt);
			}
		}

		return false;
	};

	function viewerDisplayMouseUpHandler (event) {
		mouseIsDown = false;
		document.mousemove = null;
		document.mouseup = null;
		Z.Utils.removeEventListener(document, "mousemove", viewerDisplayMouseMoveHandler);
		Z.Utils.removeEventListener(cD, "mouseup", viewerDisplayMouseUpHandler);
		Z.Utils.removeEventListener(document, "mouseup", viewerDisplayMouseUpHandler);

		var event = Z.Utils.event(event);
		var mPt = Z.Utils.getMousePosition(event);
		var dragEndPt;
		if (!mouseOutDownPoint) {
			dragEndPt = new Z.Utils.Point(mPt.x, mPt.y);
		} else {
			dragEndPt = mouseOutDownPoint;
		}

		var dragDist = Math.sqrt(Math.pow(zaptvDragPtStart.x - dragEndPt.x, 2) + Math.pow(zaptvDragPtStart.y - dragEndPt.y, 2));
		if (dragDist < 4) {
			var clickZoomPt = self.getClickZoomCoords3D(event, dragEndPt, tierCurrent, tierScale);
			if (Z.clickZoom) {
				//view(clickZoomPt.x, clickZoomPt.y, clickZoomPt.z); // Debugging option.
				self.zoomAndPanToView(clickZoomPt.x, clickZoomPt.y, clickZoomPt.z);
			} else if (Z.clickPan) {
				self.zoomAndPanToView(clickZoomPt.x, clickZoomPt.y, Z.imageZ);
			}
		} else {
			if (Z.mousePan) { self.updateView(); }
		}

		// If mouse-dragged out of viewer display rather than mousing out, hide components.
		if (mouseOutDownPoint) {
			if (Z.ToolbarDisplay && Z.toolbarVisible > 1) { Z.Toolbar.show(false); }
			if (Z.NavigatorDisplay && Z.navigatorVisible > 1) { Z.Navigator.setVisibility(false); }
		}
	};

	function viewerDisplayMouseOutHandler (event) {
		// Block if moving within viewer display or subelements.
		var targetIsInViewer = Z.Utils.nodeIsInViewer(Z.Utils.target(event));
		var relatedTargetIsInViewer = Z.Utils.nodeIsInViewer(Z.Utils.relatedTarget(Z.Utils.event(event)));
		if (!(targetIsInViewer && relatedTargetIsInViewer)) {
			if (!mouseIsDown) {
				if (Z.ToolbarDisplay && (Z.toolbarVisible > 1)) { Z.Toolbar.show(false); }
				if (Z.NavigatorDisplay && Z.navigatorVisible > 1) { Z.Navigator.setVisibility(false); }
			} else {
				var mPt = Z.Utils.getMousePosition(event);
				mouseOutDownPoint = new Z.Utils.Point(mPt.x, mPt.y);
			}
		}
	};

	function viewerDisplayTouchStartHandler (event) {
		var touch = Z.Utils.getFirstTouch(event);
		if (touch && !gestureInterval) {
			wasGesturing = false;
			var target = touch.target;
			var mPt = new Z.Utils.Point(touch.pageX, touch.pageY);
			zaptvDragPtStart = new Z.Utils.Point(mPt.x, mPt.y);
			cD.mouseXPrior = mPt.x;
			cD.mouseYPrior = mPt.y;
		}
	};

	function viewerDisplayTouchMoveHandler (event) {
		event.preventDefault(); // Prevent page dragging.
		if (!Z.mousePan) { return; }  // Disallow mouse panning if parameter false.

		// Note that touches are prevented when gesturing, as well as when in process of
		// ending gesture by lifting fingers - even when fingers are lifted separately.
		var touch = Z.Utils.getFirstTouch(event);
		if (touch && !gestureInterval && !wasGesturing) {
			// Calculate change in touch position.
			var target = touch.target;
			var mPt = new Z.Utils.Point(touch.pageX, touch.pageY);
			var xPos = mPt.x - cD.mouseXPrior;
			var yPos = mPt.y - cD.mouseYPrior;

			if (!isNaN(xPos) && !isNaN(yPos)) {
				// Calculate new position of displays container.
				var newL = parseFloat(cS.left) + xPos;
				var newT = parseFloat(cS.top) + yPos;

				// Constrain new position.
				var constrainedPt = constrainPanByViewportContainerCoordinates(newL, newT);
				cS.left = constrainedPt.x + "px";
				cS.top = constrainedPt.y + "px";

				// Update stored page coordinates for next call to this function.
				cD.mouseXPrior = mPt.x;
				cD.mouseYPrior = mPt.y;

				if (Z.Navigator) {
					// Sync navigator rectangle if visible.
					var currentCenterPt = self.calculateCurrentCenterCoordinates(constrainedPt);
					Z.Navigator.syncNavigatorRectanglePosition(currentCenterPt);
				}
			}
		}

		return false;
	};

	function viewerDisplayTouchEndHandler (event) {
		if (!gestureInterval && !wasGesturing) {
			var updateRequired = false;
			var touch = Z.Utils.getFirstTouch(event);
			if (touch) {
				var target = touch.target;
				var mPt = new Z.Utils.Point(touch.pageX, touch.pageY);
				var dragEndPt = new Z.Utils.Point(mPt.x, mPt.y);
				var dragDist = Math.sqrt(Math.pow(zaptvDragPtStart.x - dragEndPt.x, 2) + Math.pow(zaptvDragPtStart.y - dragEndPt.y, 2));
				if (dragDist < 4) {
					var clickZoomPt = self.getClickZoomCoords3D(event, dragEndPt, tierCurrent, tierScale);
					if (Z.clickZoom) {
						self.zoomAndPanToView(clickZoomPt.x, clickZoomPt.y, clickZoomPt.z);
					} else if (Z.clickPan) {
						self.zoomAndPanToView(clickZoomPt.x, clickZoomPt.y, Z.imageZ);
					}
				} else {
					updateRequired = true;
				}
			} else {
				updateRequired = true;
			}
			if (updateRequired && Z.mousePan) { self.updateView(); }
		}
	};

	function viewerDisplayTouchCancelHandler (event) {
		if (!gestureInterval && !wasGesturing) {
			var updateRequired = false;
			var touch = Z.Utils.getFirstTouch(event);
			if (touch) {
				var target = touch.target;
				var mPt = new Z.Utils.Point(touch.pageX, touch.pageY);
				var dragEndPt = new Z.Utils.Point(mPt.x, mPt.y);
				var dragDist = Math.sqrt(Math.pow(zaptvDragPtStart.x - dragEndPt.x, 2) + Math.pow(zaptvDragPtStart.y - dragEndPt.y, 2));
				if (dragDist < 4) {
					var clickZoomPt = self.getClickZoomCoords3D(event, dragEndPt, tierCurrent, tierScale);
					if (Z.clickZoom) {
						self.zoomAndPanToView(clickZoomPt.x, clickZoomPt.y, clickZoomPt.z);
					} else if (Z.clickPan) {
						self.zoomAndPanToView(clickZoomPt.x, clickZoomPt.y, Z.imageZ);
					}
				} else {
					updateRequired = true;
				}
			} else {
				updateRequired = true;
			}
			if (updateRequired && Z.mousePan) { self.updateView(); }
		}
	};

	function viewerDisplayGestureStartHandler (event) {
		var event = Z.Utils.event(event);
		viewerDisplayGestureChangeHandler(event); // Run once so values are defined at first movement.
		if (!gestureInterval) { gestureInterval = window.setInterval(zoomGesture, GESTURE_TEST_DURATION); }
	};

	function viewerDisplayGestureChangeHandler (event) {
		var event = Z.Utils.event(event);
		event.preventDefault();
		gestureIntervalPercent = Math.round(event.scale * 100) / 100;
	};

	function viewerDisplayGestureEndHandler (event) {
		if (gestureInterval) {
			window.clearInterval(gestureInterval);
			wasGesturing = true;
			gestureInterval = null;
		}				
		if (Z.mousePan) { self.updateView(); }
	};

	function zoomGesture (event) {
		if (!Z.mousePan) { return; }  // Disallow touch panning if parameter false.
		
		var gestureZoom = calculateGestureZoom(tierCurrent, tierScalePrior, gestureIntervalPercent);
		var gestureZoomConstrained = constrainZoom(gestureZoom);
		if (gestureZoom != Z.imageZ) { scaleTierToZoom(gestureZoomConstrained); }
	};

	function calculateGestureZoom (tier, scale, gesturePercent) {
		var newScale = scale * gesturePercent;
		var gestureZ = convertTierScaleToZoom(tier, newScale);
		return gestureZ;
	};
	
	function orientationChangeHandler (event) {
		if (Z.fullPage) { 
			if (Z.ToolbarDisplay && Z.toolbarVisible > 1) { Z.Toolbar.show(false); }
			if (Z.NavigatorDisplay && Z.navigatorVisible > 1) { Z.Navigator.setVisibility(false); }
			self.toggleFullPageView(false);
			self.toggleFullPageView(true);
			if (Z.ToolbarDisplay && (Z.toolbarVisible > 1)) { Z.Toolbar.show(true); }
			if (Z.NavigatorDisplay && Z.navigatorVisible > 1) { Z.Navigator.setVisibility(true); }
		}
	};

	function keyDownHandler (event) {
		// Disallow keyboard control if parameter false.
		if (!Z.keys) { return; }
		var event = Z.Utils.event(event);
		switch (event.keyCode) {
			case 90: // z
				self.zoom("out");
				break;
			case 17: // control
				self.zoom("out");
				break;
			case 65: // a
				self.zoom("in");
				break;
			case 16: // shift
				self.zoom("in");
				break;
			case 37: // left arrow
				self.pan("left");
				break;
			case 38: // up arrow
				self.pan("up");
				break;
			case 40: // down arrow
				self.pan("down");
				break;
			case 39: // right arrow
				self.pan("right");
				break;
			case 27: // escape
				if (!Z.fullPage) {
					self.reset();
				} else {
					self.toggleFullPageView(false);
				}
				break;
		}
	};

	function keyUpHandler (event) {
		// Disallow keyboard control if parameter false.
		if (!Z.keys) { return; }
		var event = Z.Utils.event(event);
		var kc = event.keyCode;
		if (kc == 90 || kc == 17 || kc == 65 || kc == 16) {  // z, ctrl, a, and shift keys
			self.zoom("stop");
		} else if (kc == 37 || kc == 39) {  // left and right arrow keys
			self.pan("horizontalStop");
		} else if (kc == 38 || kc == 40) {  // up and down arrow keys
			self.pan("verticalStop");
		}
	};
};



//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::: TOOLBAR FUNCTIONS ::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Z.ZoomifyToolbar = function (tbViewport) {

	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	//:::::::::::::::::::::::::::::::::: INIT FUNCTIONS :::::::::::::::::::::::::::::::::
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	// Declare variables for toolbar internal self-reference and for initialization completion.
	var self = this;
	var isInitialized = false;
	
	// Load toolbar skins XML file and determine selection mode setting for optional support of
	// small screen devices with large graphic files. Build names list for 39 skin files of the toolbar.
	var netConnector = new Z.NetConnector();
	Z.skinPath = Z.Utils.removeTrailingSlashCharacters(Z.skinPath);
	netConnector.loadXML(Z.skinPath + "/" + Z.Utils.getResource("DEFAULT_SKINXMLFILE"));

	// Declare variables for Toolbar and slider.
	var tlbrH, tbS, trS, trsS, btS, btsS;
	var toolbarDimensions = []
	var SLIDER_TEST_DURATION = parseInt(Z.Utils.getResource("DEFAULT_SLIDERTESTDURATION"), 10);
	var buttonSliderDown = false;
	var sliderInterval = null, sliderIntervalMousePt = null;
	var progressInterval = null;
	var overrideSlider, overrideProgress, overrideLogo;

	this.initializeToolbar = function (tlbrSknDims, tlbrSknArr) {
		// Create Toolbar display area for Toolbar buttons and set size and position.
		Z.ToolbarDisplay = Z.Utils.createContainerElement("div", "ToolbarDisplay", "inline-block", "absolute", "hidden", "1px", "1px", "0px", "1px", "none", "0px", "transparent none", "0px", "0px", "default");
		tbS = Z.ToolbarDisplay.style;

		var background = new Z.Utils.Graphic("background", Z.skinPath, tlbrSknArr[0], "1px", "1px", "0px", "0px");
		Z.ToolbarDisplay.appendChild(background.elmt);

		// Create toolbar global array to hold skin sizes from XML but use placeholders here
		// and apply actual sizes in drawLayout function called in sizeAndPosition function.
		toolbarSkinSizes = tlbrSknDims;

		if (Z.logoVisible) {
			var toolbarLogo;
			if(!(Z.Utils.isStrVal(Z.logoCustomPath))) {
				toolbarLogo = new Z.Utils.Graphic("toolbarLogo", Z.skinPath, tlbrSknArr[1], "1px", "1px", "1px", "1px");
			} else {
				var logoPath = Z.Utils.cacheProofPath(Z.logoCustomPath);
				toolbarLogo = new Z.Utils.Graphic("toolbarLogo", logoPath, null, "1px", "1px", "1px", "1px");
			}
			Z.ToolbarDisplay.appendChild(toolbarLogo.elmt);

			if (Z.toolbarVisible == 0 || Z.toolbarVisible == 1) {
				var logoDivider = new Z.Utils.Graphic("logoDivider", Z.skinPath, tlbrSknArr[2], "1px", "1px", "1px", "1px");
				Z.ToolbarDisplay.appendChild(logoDivider.elmt);
			}
		}

		// Add button container to handle background mouseover events instead of button mouseout events.
		var buttonContainer = Z.Utils.createContainerElement("div", "buttonContainer", "inline-block", "absolute", "visible", "1px", "1px", "0px", "0px", "none", "0px", "transparent none", "0px", "0px", "default");
		Z.ToolbarDisplay.appendChild(buttonContainer);
		if (!Z.mobileDevice) {
			Z.Utils.addEventListener(buttonContainer, "mousedown", Z.Utils.preventDefault);
			Z.Utils.addEventListener(buttonContainer, "mouseover", backgroundEventsHandler);
		} else {
			Z.Utils.addEventListener(buttonContainer, "touchstart", Z.Utils.preventDefault);
		}

		// Add background graphic to button container to ensure IE events fire.
		var buttonBackground = new Z.Utils.Graphic("buttonBackground", Z.skinPath, tlbrSknArr[0], "1px", "1px", "0px", "0px");
		buttonContainer.appendChild(buttonBackground.elmt);
		
		if ((Z.toolbarVisible != 0 && Z.toolbarVisible != 1) || Z.mobileDevice) {
			var buttonMinimize = new Z.Utils.Button("buttonMinimize", null, Z.skinPath, tlbrSknArr[3], tlbrSknArr[4], tlbrSknArr[5], "1px", "1px", "1px", "1px", "mouseover", buttonEventsHandler, "TIP_MINIMIZE");
			Z.ToolbarDisplay.appendChild(buttonMinimize.elmt);
			var buttonExpand = new Z.Utils.Button("buttonExpand", null, Z.skinPath, tlbrSknArr[6], tlbrSknArr[7], tlbrSknArr[8], "1px", "1px", "1px", "1px",  "mouseover",buttonEventsHandler, "TIP_EXPAND");
			Z.ToolbarDisplay.appendChild(buttonExpand.elmt);
		}

		var buttonZoomOut = new Z.Utils.Button("buttonZoomOut", null, Z.skinPath, tlbrSknArr[9], tlbrSknArr[10], tlbrSknArr[11], "1px", "1px", "1px", "1px",  "mouseover",buttonEventsHandler, "TIP_ZOOMOUT");
		buttonContainer.appendChild(buttonZoomOut.elmt);

		if (Z.sliderVisible) {
			var trackSlider = new Z.Utils.Graphic("trackSlider", Z.skinPath, tlbrSknArr[12], "1px", "1px", "0px", "0px");
			buttonContainer.appendChild(trackSlider.elmt);
			Z.Utils.addEventListener(trackSlider.elmt, "mousedown", buttonEventsHandler);
			Z.Utils.addEventListener(trackSlider.elmt, "touchstart", buttonEventsHandler);
			var buttonSlider = new Z.Utils.Button("buttonSlider", null, Z.skinPath, tlbrSknArr[14], tlbrSknArr[15], tlbrSknArr[16], "1px", "1px", "1px", "1px",  "mouseover",buttonEventsHandler, "TIP_SLIDER");
			buttonContainer.appendChild(buttonSlider.elmt);
		}

		var buttonZoomIn = new Z.Utils.Button("buttonZoomIn", null, Z.skinPath, tlbrSknArr[17], tlbrSknArr[18], tlbrSknArr[19], "1px", "1px", "1px", "1px",  "mouseover",buttonEventsHandler, "TIP_ZOOMIN");
		buttonContainer.appendChild(buttonZoomIn.elmt);

		var panDivider = new Z.Utils.Graphic("panDivider", Z.skinPath, tlbrSknArr[20], "1px", "1px","1px", "1px");
		buttonContainer.appendChild(panDivider.elmt);
		var buttonPanLeft = new Z.Utils.Button("buttonPanLeft", null, Z.skinPath, tlbrSknArr[21], tlbrSknArr[22], tlbrSknArr[23], "1px", "1px", "1px", "1px", "mouseover", buttonEventsHandler, "TIP_PANLEFT");
		buttonContainer.appendChild(buttonPanLeft.elmt);
		var buttonPanUp = new Z.Utils.Button("buttonPanUp", null, Z.skinPath, tlbrSknArr[24], tlbrSknArr[25], tlbrSknArr[26], "1px", "1px", "1px", "1px", "mouseover", buttonEventsHandler, "TIP_PANUP");
		buttonContainer.appendChild(buttonPanUp.elmt);
		var buttonPanDown = new Z.Utils.Button("buttonPanDown", null, Z.skinPath, tlbrSknArr[27], tlbrSknArr[28], tlbrSknArr[29], "1px", "1px", "1px", "1px", "mouseover", buttonEventsHandler, "TIP_PANDOWN");
		buttonContainer.appendChild(buttonPanDown.elmt);
		var buttonPanRight = new Z.Utils.Button("buttonPanRight", null, Z.skinPath, tlbrSknArr[30], tlbrSknArr[31], tlbrSknArr[32], "1px", "1px", "1px", "1px", "mouseover", buttonEventsHandler, "TIP_PANRIGHT");
		buttonContainer.appendChild(buttonPanRight.elmt);
		var buttonReset = new Z.Utils.Button("buttonReset", null, Z.skinPath, tlbrSknArr[33], tlbrSknArr[34], tlbrSknArr[35], "1px", "1px", "1px", "1px", "mouseover", buttonEventsHandler, "TIP_RESET");
		buttonContainer.appendChild(buttonReset.elmt);

		if (Z.fullPageVisible) {
			var fullPageDivider = new Z.Utils.Graphic("fullPageDivider", Z.skinPath, tlbrSknArr[36], "1px", "1px", "1px", "1px");
			buttonContainer.appendChild(fullPageDivider.elmt);
			var buttonFullPage = new Z.Utils.Button("buttonFullPage", null, Z.skinPath, tlbrSknArr[37], tlbrSknArr[38], tlbrSknArr[39], "1px", "1px", "1px", "1px", "mouseover", buttonEventsHandler, "TIP_TOGGLEFULLPAGE");
			buttonContainer.appendChild(buttonFullPage.elmt);
		}

		if(Z.progressVisible) {
			// Create with placeholder size and position until drawLayout.
			var progressTextBox = Z.Utils.createContainerElement("div", "progressTextBox", "inline-block", "absolute", "hidden", "1px", "1px", "1px", "1px", "none", "0px", "transparent none", "0px", "0px");
			var progressFontSize=toolbarSkinSizes[16] + "px";
			buttonContainer.appendChild(progressTextBox);
			var progressTextNode = document.createTextNode(Z.Utils.getResource("DEFAULT_PROGRESSTEXT"));
			progressTextBox.appendChild(Z.Utils.createCenteredElement(progressTextNode));
			Z.Utils.setTextStyle(progressTextNode, "black", "verdana", progressFontSize, "none", "normal", "normal", "normal", "normal", "1em", "left", "none");

			// Prevent text selection and context menu.
			Z.Utils.addEventListener(progressTextBox, "contextmenu", Z.Utils.preventDefault);
			Z.Utils.disableTextInteraction(progressTextNode);
		}

		// Add toolbar to viewer display..
		Z.ViewerDisplay.appendChild(Z.ToolbarDisplay);

		// Set toolbar size, position, and visibility.
		Z.toolbarW = toolbarSkinSizes[0];
		Z.toolbarCurrentW = (Z.toolbarW == -1) ? Z.viewerW : Z.toolbarW;
		Z.toolbarH = tlbrH = toolbarSkinSizes[1];
		var toolbarTop = (Z.toolbarPosition == 1) ? Z.viewerH - tlbrH : 0;
		sizeAndPosition(Z.toolbarCurrentW, Z.toolbarH, 0, toolbarTop);

		if (Z.Viewport && Z.Viewport.getInitialized()) {
			var currentZoom = Z.Viewport.getTierScaleAsZoom();
			syncSliderToViewport(currentZoom);
		}

		show(Z.toolbarVisible == 1 || Z.toolbarVisible == 2 || Z.toolbarVisible == 4);
		
		Z.Utils.addEventListener(Z.ToolbarDisplay, "mouseover", Z.Utils.stopPropagation);

		setInitialized(true);
	};



	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	//:::::::::::::::::::::::::::: GET & SET FUNCTIONS :::::::::::::::::::::::::::
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	this.getInitialized = function () {
		return getInitialized();
	};

	this.setSizeAndPosition = function (width, height, left, top) {
		sizeAndPosition(width, height, left, top);
	};

	this.show = function (value) {
		show(value);
	};
	
	this.setVisibility = function (visible) {
		visibility(visible);
	};
	
	this.minimize = function (value) {
		minimize(value);
	};

	this.showProgress = function (total, current) {
		if (Z.progressVisible) {
			if (progressInterval) { window.clearInterval(progressInterval); }
			var percentComplete;
			var ptn = document.getElementById("progressTextBox").firstChild.firstChild.firstChild.firstChild;
			if (ptn) {
				if (total == 0 || current == 0) {
					ptn.nodeValue = "llllllllll"
					progressInterval = window.setInterval(progressClear, parseInt(Z.Utils.getResource("DEFAULT_PROGRESSDURATION")), 10);
				} else {
					percentComplete = Math.round(100 - (current / total) * 100);
					ptn.nodeValue = "l".multiply(Math.round(percentComplete / 10));
				}
			}
		}
	};

	function progressClear () {
		window.clearInterval(progressInterval);
		progressInterval = null;
		var ptn = document.getElementById("progressTextBox").firstChild.firstChild.firstChild.firstChild;
		if (ptn) { ptn.nodeValue = ""; }
	};



	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	//:::::::::::::::::::::::::::::::: CORE FUNCTIONS :::::::::::::::::::::::::::::::
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	function getInitialized () {
		return isInitialized;
	};

	function setInitialized (value) {
		isInitialized = value;
	};

	function sizeAndPosition (width, height, left, top) {
		if (!width) { width = (Z.toolbarVisible > 0) ? Z.toolbarCurrentW : 0; }
		if (!height) { height = (Z.toolbarVisible > 0) ? tlbrH : 0; }
		if (!left) { left = 0; }
		if (!top) { top = (Z.toolbarPosition == 1) ? Z.viewerH - tlbrH : 0; }
		var tbS = Z.ToolbarDisplay.style;
		tbS.width = width + "px";
		tbS.height = height + "px";
		tbS.left = left + "px";
		tbS.top = top + "px";
		drawLayout(width, height);
	};

	function drawLayout (width, height) {
		// Set toolbar width and height as specified in the call to this function by the
		// sizeAndPosition function.  That function tests for null assignments and uses
		// preset values from the Skins XML file if appropriate.
		var toolbarW = width;
		var toolbarH = height;

		 // Set remaining values to the values in the Skins XML file.
		var logoW = toolbarSkinSizes[2];
		var logoH = toolbarSkinSizes[3];
		var dvdrW = toolbarSkinSizes[4];
		var dvdrH = toolbarSkinSizes[5];
		var btnW = toolbarSkinSizes[6];
		var btnH = toolbarSkinSizes[7];
		var btnSpan = toolbarSkinSizes[8];
		var sldrBtnW = toolbarSkinSizes[9];
		var sldrBtnH = toolbarSkinSizes[10];
		var sldrTrkW = toolbarSkinSizes[11];
		var sldrTrkH = toolbarSkinSizes[12];
		var sldrSpan = toolbarSkinSizes[13];
		var prgW = toolbarSkinSizes[14];
		var prgH = toolbarSkinSizes[15];

		// Calculate positioning values.
		var dx = 0;
		var logoTOffset = (toolbarH - logoH) / 2 + 1;
		var dvdrTOffset = (toolbarH - dvdrH) / 2;
		var btnTOffset = (toolbarH - btnH) / 2;
		var btnMinExpTOffset = (btnTOffset * 1.3);
		var sldrTrkTOffset = btnTOffset + 4;
		var btnSldrTOffset = btnTOffset + 2;
		var btnMinSpan = (Z.logoVisible == 1) ? 0 : btnSpan / 2;
		var btnExpSpan = (Z.logoVisible == 1) ? 0 : btnSpan / 2;
		var dvdrSpan = btnSpan - (btnW - dvdrW);
		var btnCount = (Z.fullPageVisible) ? 8 : 7;
		var btnContainerMargin = 20;
		var btnSetW = (btnCount * btnSpan) + (2 * dvdrSpan);
		if (Z.sliderVisible) { btnSetW += sldrSpan; }

		// Validate toolbar contents fit within toolbar width. If not, implement overrides. First
		// hide slider and recalculate. Next hide, progress display.  Finally, hide logo and
		// minimize and maximize buttons.
		overrideSlider = overrideProgress = overrideLogo = false;
		var logoOffset = (Z.logoVisible == 1) ? logoW + 2 : 0;
		var minBtnOffset = (Z.toolbarVisible != 0 && Z.toolbarVisible != 1) ? btnSpan : 0;
		var logoButtonSetW = logoOffset + minBtnOffset;
		var toolbarContentsW = logoButtonSetW + btnContainerMargin + btnSetW + btnContainerMargin + prgW;
		if (toolbarContentsW > toolbarW) {
			overrideSlider = true;
			if ((toolbarContentsW - sldrSpan) > toolbarW) {
				overrideProgress = true;
				if ((toolbarContentsW - sldrSpan - prgW) > toolbarW) {
					overrideLogo = true;
					logoButtonSetW = 0;
				}
				prgW = 0;
			}
			btnSetW -= sldrSpan;
		}

		// Calculate position for main button set between logo and progress display.
		var btnSetL = logoButtonSetW + ((((toolbarW - prgW) - logoButtonSetW) - btnSetW) / 2);

		// Set the sizes and positions of the toolbar contents.
		var bG = document.getElementById("background");
		bG.style.width = toolbarW + "px";
		bG.firstChild.style.width = (toolbarW + 400) + "px"; // DEV NOTE: Oversizing temporary adjustment for background misplacment after setSizeAndPosition called.
		bG.style.height = toolbarH + "px";
		bG.firstChild.style.height = toolbarH + "px";

		var bC = document.getElementById("buttonContainer");
		bC.style.width = (btnSetW + (btnContainerMargin * 2)) + "px";
		bC.style.height = toolbarH + "px";
		bC.style.left = (btnSetL - btnContainerMargin) + "px";

		var bB = document.getElementById("buttonBackground");
		Z.Utils.graphicSize(bB, parseFloat(bC.style.width), parseFloat(bC.style.height));
		bB.style.left = "0px";

		var tbL = document.getElementById("toolbarLogo");
		if (tbL) {
			var tblS = tbL.style;
			if (tblS) {
				if (!overrideLogo) {
					tblS.display = "inline-block";
					Z.Utils.graphicSize(tbL, logoW, logoH);
					tblS.left = dx + "px";
					tblS.top = logoTOffset + "px";
					dx += logoW + 2;
					var logoD = document.getElementById("logoDivider");
					if (logoD) {
						Z.Utils.graphicSize(logoD, dvdrW, dvdrH);
						var ldS = logoD.style;
						ldS.left = dx + "px";
						ldS.top = dvdrTOffset + "px";
					}
				} else {
					tblS.display = "none";
				}
			}
		}

		if (Z.toolbarVisible != 0 && Z.toolbarVisible != 1) {
			var bM = document.getElementById("buttonMinimize");
			var bE = document.getElementById("buttonExpand");
			if (bM && bE) {
				var bmS = bM.style;
				var beS = bE.style;
				if (bmS && beS) {
					if (!overrideLogo) {
						bmS.display = "inline-block";
						beS.display = "inline-block";
						Z.Utils.buttonSize(bM, btnW, btnH);
						Z.Utils.buttonSize(bE, btnW, btnH);
						bmS.left = dx + btnMinSpan + "px";
						bmS.top = btnMinExpTOffset + "px";
						beS.left = dx + btnExpSpan + "px";
						beS.top = btnMinExpTOffset + "px";
					} else {
						bmS.display = "none";
						beS.display = "none";
					}
				}
			}
		}

		dx = btnContainerMargin; // Reset to adjust for placement within buttonContainer which is offset.

		var bZO = document.getElementById("buttonZoomOut");
		Z.Utils.buttonSize(bZO, btnW, btnH);
		var bzoS = bZO.style;
		bzoS.left = dx + "px";
		bzoS.top = btnTOffset + "px";
		dx += btnSpan;

		var trS = document.getElementById("trackSlider");
		var btS = document.getElementById("buttonSlider");
		if (trS && btS) {
			var trsS = trS.style;
			var btsS = btS.style;
			if (trsS && btsS) {
				if (!overrideSlider) {
					trsS.display = "inline-block";
					btsS.display = "inline-block";
					Z.Utils.graphicSize(trS, sldrTrkW, sldrTrkH);
					trsS.left = (dx - 2) + "px";
					trsS.top = sldrTrkTOffset + "px";
					Z.Utils.buttonSize(btS, sldrBtnW, sldrBtnH);
					btsS.left = parseFloat(trsS.left) + "px";
					btsS.top = btnSldrTOffset + "px";
					dx += sldrSpan;
				} else {
					trsS.display = "none";
					btsS.display = "none";
				}
			}
		}

		var bZI = document.getElementById("buttonZoomIn");
		Z.Utils.buttonSize(bZI, btnW, btnH);
		var bziS = bZI.style;
		bziS.left = dx + "px";
		bziS.top = btnTOffset + "px";
		dx += btnSpan + 1;

		var pD = document.getElementById("panDivider");
		Z.Utils.graphicSize(pD, dvdrW, dvdrH);
		var pdS = pD.style;
		pdS.left = dx + "px";
		pdS.top = dvdrTOffset + "px";
		dx += dvdrSpan;
		var bPL = document.getElementById("buttonPanLeft");
		Z.Utils.buttonSize(bPL, btnW, btnH);
		var bplS = bPL.style;
		bplS.left = dx + "px";
		bplS.top = btnTOffset + "px";
		dx += btnSpan;
		var bPU = document.getElementById("buttonPanUp");
		Z.Utils.buttonSize(bPU, btnW, btnH);
		var bpuS = bPU.style;
		bpuS.left = dx + "px";
		bpuS.top = btnTOffset + "px";
		dx += btnSpan;
		var bPD = document.getElementById("buttonPanDown");
		Z.Utils.buttonSize(bPD, btnW, btnH);
		var bpdS = bPD.style;
		bpdS.left = dx + "px";
		bpdS.top = btnTOffset + "px";
		dx += btnSpan;
		var bPR = document.getElementById("buttonPanRight");
		Z.Utils.buttonSize(bPR, btnW, btnH);
		var bprS = bPR.style;
		bprS.left = dx + "px";
		bprS.top = btnTOffset + "px";
		dx += btnSpan;
		var bR = document.getElementById("buttonReset");
		Z.Utils.buttonSize(bR, btnW, btnH);
		var brS = bR.style;
		brS.left = dx + "px";
		brS.top = btnTOffset + "px";
		dx += btnSpan + 1;

		var fpD = document.getElementById("fullPageDivider");
		if (fpD) {
			Z.Utils.graphicSize(fpD, dvdrW, dvdrH);
			var fpdS = fpD.style;
			fpdS.left = dx + "px";
			fpdS.top = dvdrTOffset + "px";
			dx += dvdrSpan;
			var bFP = document.getElementById("buttonFullPage");
			Z.Utils.buttonSize(bFP, btnW, btnH);
			var bfpS = bFP.style;
			bfpS.left = dx + "px";
			bfpS.top = btnTOffset + "px";
		}

		var ptB = document.getElementById("progressTextBox");
		if (ptB) {
			var ptbS = ptB.style;
			if (ptbS) {
				if (!overrideProgress) {
					ptbS.display = "inline-block";
					ptbS.width = prgW + "px";
					ptbS.height = prgH + "px";
					ptbS.left = (toolbarW - parseFloat(bC.style.left) - parseFloat(ptbS.width)) + "px";
					ptbS.top = ((toolbarH - parseFloat(ptbS.height)) / 2) + "px";
				} else {
					ptbS.display = "none";
				}
			}
		}
	};

	function show (value) {
		if (Z.toolbarVisible < 4 && !Z.mobileDevice) {
			visibility(value);
		} else {
			minimize(!value);
		}
	};

	function visibility (visible) {
		if (tbS) {
			if (visible) {
				tbS.display = "inline-block";
			} else {
				tbS.display = "none";
			}
		}
	};

	function minimize (value) {
		if (tbS) {
			var bC = document.getElementById("buttonContainer");
			var bG = document.getElementById("background");
			var bM = document.getElementById("buttonMinimize");
			var bE = document.getElementById("buttonExpand");
			var logoD = document.getElementById("logoDivider");
			var minW = 0;
			if (!overrideLogo) { minW = parseFloat(bE.style.left) + parseFloat(bE.style.width) + 4; }
			var expW = Z.toolbarCurrentW;
			if (value) {
				bC.style.display = "none";
				if (!overrideLogo) {
					if (logoD) { logoD.style.display = "none"; }
					bM.style.display = "none";
					bE.style.display = "inline-block";
				}
				tbS.width = minW + "px";
				bG.style.width = minW + "px";
			} else {
				bC.style.display = "inline-block";
				if (!overrideLogo) {
					if (logoD) { logoD.style.display = "inline-block"; }
					bM.style.display = "inline-block";
					bE.style.display = "none";
				}
				tbS.width = expW + "px";
				bG.style.width = expW + "px";
			}
		}
	};

	this.syncSliderToViewport = function (imageZoom) {
		syncSliderToViewport(imageZoom);
	};

	function syncSliderToViewport (imageZoom) {
		if (Z.sliderVisible) {
			if (!trS) { trS = document.getElementById("trackSlider"); }
			if (!trsS) { trsS = trS.style; }
			if (!btS) { btS = document.getElementById("buttonSlider"); }
			if (!btsS) { btsS = btS.style; }
			if (trsS && btsS) {
				var imageSpan = Z.maxZ - Z.minZ;
				var sliderPercent = (imageZoom - Z.minZ) / imageSpan;
				trackL = parseFloat(trsS.left);
				trackR = parseFloat(trsS.left) + parseFloat(trsS.width) - parseFloat(btsS.width);
				var trackSpan = trackR - trackL;
				var sliderPosition = (sliderPercent * trackSpan) + trackL;
				btsS.left = sliderPosition + "px";
			}
		}
	};

	function sliderSnap (event) {
		if (!trS) { trS = document.getElementById("trackSlider"); }
		if (!trsS) { trsS = trS.style; }
		if (trS && trsS) {
			var sliderClick;
			var tsPt = Z.Utils.getElementPosition(trS);
			if (!Z.mobileDevice) {
				sliderClick = event.clientX - tsPt.x;
			} else {
				sliderClick = Z.Utils.getMousePosition(event).x - tsPt.x;
			}
			var sliderZoom = calculateSliderZoom(sliderClick, 0, parseFloat(trsS.width));
			if (sliderZoom < Z.minZ + 0.1) { sliderZoom = Z.minZ; }
			if (sliderZoom > Z.maxZ - 0.1) { sliderZoom = Z.maxZ; }
			tbViewport.scaleTierToZoom(sliderZoom);
			tbViewport.updateView();
		}
	};

	function sliderSlideStart (event) {
		buttonSliderDown = true;
		if (!btS) { btS = document.getElementById("buttonSlider"); }
		if (btS) {
			var mPt = Z.Utils.getMousePosition(event);
			btS.mouseXPrior = mPt.x;
			btS.mouseYPrior = mPt.y;
		}
	};

	function sliderSlide (event) {
		if (!trS) { trS = document.getElementById("trackSlider"); }
		if (!trsS) { trsS = trS.style; }
		if (!btS) { btS = document.getElementById("buttonSlider"); }
		if (!btsS) { btsS = btS.style; }
		if (trsS && btS && btsS) {
			trackL = parseFloat(trsS.left);
			trackR = parseFloat(trsS.left) + parseFloat(trsS.width) - parseFloat(btsS.width);
			var sliderPosition = parseFloat(btsS.left) + (sliderIntervalMousePt.x - btS.mouseXPrior);
			if (sliderPosition < trackL) { 
				sliderPosition = trackL;		
			} else if (sliderPosition > trackR) { 
				sliderPosition = trackR; 
			} else {					
				btS.mouseXPrior = sliderIntervalMousePt.x;
			}
			btsS.left = sliderPosition + "px";
			var sliderZoom = calculateSliderZoom(sliderPosition, trackL, trackR);
			tbViewport.scaleTierToZoom(sliderZoom); 
		}
	};

	function sliderSlideEnd () {
		buttonSliderDown = false;
		tbViewport.updateView();
	};

	function calculateSliderZoom (sliderPosition, trackL, trackR) {
		var trackSpan = trackR - trackL;
		var sliderPercent = (sliderPosition - trackL) / trackSpan;
		var imageSpan = Z.maxZ - Z.minZ;
		var sliderZoom = Z.minZ + (imageSpan * sliderPercent);
		return sliderZoom;
	};



	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	//:::::::::::::::::::::::::::::::::: EVENT FUNCTIONS ::::::::::::::::::::::::::::
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	function backgroundEventsHandler(event) {
		// Handle all button mouseout events as background mouseover events to simplify
		// management of button image swap events and crossbrowser compatibility.
		var event = Z.Utils.event(event);
		var relatedTarget = Z.Utils.relatedTarget(Z.Utils.event(event));
		if (!buttonSliderDown && relatedTarget) {
			var targetBtn = relatedTarget.parentNode;
			buttonHandlerAndGraphicsReset(targetBtn);
		}
	};

	function buttonEventsHandler(event) {
		// Handle all events and button graphics states by clearing all event handlers on exit
		// and resetting this handler as event broker. Prevent right mouse button use. Note that
		// call to buttonsAllReset is redundant vs call by background mouseover handler only if
		// move slowly between buttons, not if move fast or if move directly off toolbar.
		if (Z.mobileDevice) { event.preventDefault(); }  // Prevent copy menu in mobile OS browsers.
		var event = Z.Utils.event(event);
		var target = Z.Utils.target(event);
		var relatedTarget = Z.Utils.relatedTarget(event);

		// Clear all button event handlers and graphics when any button event occurs - unless
		// sliding slider and accidentally mouse or touch over other button. Then set current
		// event and graphics states for current button.
		if (target) {
			var targetParent = target.parentNode;
			if (targetParent) { targetParentID = targetParent.id; }
		}
		if (relatedTarget) { 
			var relatedTargetParent = relatedTarget.parentNode;
			if (relatedTargetParent) { relatedTargetParentID = relatedTargetParent.id; }
		}
		if (!buttonSliderDown || event.type == "mouseup" || event.type == "touchend" || event.type == "touchcancel") {
			buttonsAllReset(); 
			if (target && !Z.Utils.isRightMouseButton(event)) {
				if (targetParentID && targetParentID != "trackSlider" && event.type != "mousemove") {
					buttonEventHandlersRemove(event);
					buttonGraphicsUpdate(event);
				}
				buttonEventHandlersUpdate(event);
			}
		}
	};

	function buttonHandlerAndGraphicsReset(targetBtn) {
		// Reset button state if mouse-out or mouse-drag-out.
		if (tbViewport) {
			tbViewport.zoomAndPanAllStop();
		}
		if (targetBtn.id && targetBtn.id.indexOf("button") != -1) {
			buttonEventHandlersReset(targetBtn);
			buttonGraphicsReset(targetBtn);
		} else if (targetBtn.id && targetBtn.id.indexOf("background") != -1) {
			buttonsAllReset();
		}
	};

	function buttonEventHandlersReset (targetBtn) {
		Z.Utils.removeEventListener(targetBtn, "mousedown", buttonEventsHandler);
		Z.Utils.removeEventListener(targetBtn, "mouseup", buttonEventsHandler);
		Z.Utils.removeEventListener(targetBtn, "mouseout", buttonEventsHandler);
		Z.Utils.addEventListener(targetBtn, "mouseover", buttonEventsHandler);
	};

	function buttonGraphicsReset (targetBtn) {
		var iU = document.getElementById(targetBtn._imgUpID);
		var iO = document.getElementById(targetBtn._imgOverID);
		var iD = document.getElementById(targetBtn._imgDownID);
		if (iU) { iU.style.visibility = "visible"; }
		if (iO) { iO.style.visibility = "hidden"; }
		if (iD) { iD.style.visibility = "hidden"; }
	};

	function buttonsAllReset () {
		var toolbarChildren = Z.ToolbarDisplay.childNodes;
		var toolbarChild = null;
		for (var i = 0, j = toolbarChildren.length; i < j; i++) {
			toolbarChild =  toolbarChildren[i];
			if (toolbarChild.id && toolbarChild.id.indexOf("button") != -1) {
				if (toolbarChild.id != "buttonContainer") {
					buttonEventHandlersReset(toolbarChild);
					buttonGraphicsReset(toolbarChild);
				} else {
					var toolbarSubchildren = toolbarChild.childNodes;
					var toolbarSubchild = null;
					for (var k = 0, m = toolbarSubchildren.length; k < m; k++) {
						toolbarSubchild = toolbarSubchildren[k];
						if (toolbarSubchild.id && toolbarSubchild.id.indexOf("button") != -1) {
							buttonEventHandlersReset(toolbarSubchild);
							buttonGraphicsReset(toolbarSubchild);
						}
					}
				}
			}
		}
	};

	function buttonEventHandlersRemove (event) {
		var target = Z.Utils.target(event);
		if (target) {
			var targetBtn = target.parentNode;
			if (targetBtn) {
				if (!Z.mobileDevice) {
					Z.Utils.removeEventListener(targetBtn, "mouseover", buttonEventsHandler);
					Z.Utils.removeEventListener(targetBtn, "mousedown", buttonEventsHandler);
					Z.Utils.removeEventListener(targetBtn, "mouseup", buttonEventsHandler);
					Z.Utils.removeEventListener(targetBtn, "mouseout", buttonEventsHandler);
				} else {
					Z.Utils.removeEventListener(targetBtn, "touchstart", buttonEventsHandler);
					Z.Utils.removeEventListener(targetBtn, "touchend", buttonEventsHandler);
					Z.Utils.removeEventListener(targetBtn, "touchcancel", buttonEventsHandler);
				}
			}
		}
	};

	function buttonGraphicsUpdate (event) {
		var target = Z.Utils.target(event);
		if (target) {
			var targetBtn = Z.Utils.target(event).parentNode;
			if (targetBtn) {
				if(!targetBtn._imgUpID) {
					buttonHandlerAndGraphicsReset(targetBtn);
				} else {
					var iU = document.getElementById(targetBtn._imgUpID);
					var iO = document.getElementById(targetBtn._imgOverID);
					var iD = document.getElementById(targetBtn._imgDownID);
					if (iU && iO && iD) {
						var iuS = iU.style;
						var ioS = iO.style;
						var idS = iD.style;
						iuS.visibility = "hidden";
						ioS.visibility = "hidden";
						idS.visibility = "hidden";
						switch (event.type) {
							case "mouseover" :
								ioS.visibility = "visible";
								break;
							case "mousedown" :
								idS.visibility = "visible";
								break;
							case "mousemove" :
								idS.visibility = "visible";
								break;
							case "mouseup" :
								ioS.visibility = "visible";
								break;
							case "mouseout" :
								iuS.visibility = "visible";
								break;
							case "touchstart" :
								idS.visibility = "visible";
								break;
							case "touchend" :
								iuS.visibility = "visible";
								break;
							case "touchcancel" :
								iuS.visibility = "visible";
								break;
						}
					}
				}
			}
		}
	};

	function buttonEventHandlersUpdate (event) {
		var targetBtn = Z.Utils.target(event).parentNode;
		if (targetBtn) {
			var tID = targetBtn.id;
			switch(event.type) {
				case "mouseover" :
					Z.Utils.addEventListener(targetBtn, "mousedown", buttonEventsHandler);
					break;
				case "mousedown" :
					Z.Utils.addEventListener(targetBtn, "mouseup", buttonEventsHandler);
					if (tbViewport) {
						switch (tID) {
							case "buttonMinimize" :
								self.minimize(true);
								Z.Navigator.setVisibility(false);
								break;
							case "buttonExpand" :
								self.minimize(false);
								Z.Navigator.setVisibility(true);
								break;
							case "buttonZoomOut" :
								tbViewport.zoom("out");
								break;
							case "buttonSlider" :
								sliderSlideStart(event);
								sliderMouseMoveHandler(event); // Run once so values are defined at first movement.
								Z.Utils.addEventListener(document, "mousemove", sliderMouseMoveHandler);
								if (!sliderInterval) { sliderInterval = window.setInterval(sliderSlide, SLIDER_TEST_DURATION); }
								Z.Utils.addEventListener(document, "mouseup", buttonEventsHandler);
								break;
							case "trackSlider" :
								sliderSnap(event);
								break;
							case "buttonZoomIn" :
								tbViewport.zoom("in");
								break;
							case "buttonPanLeft" :
								tbViewport.pan("left");
								break;
							case "buttonPanUp" :
								tbViewport.pan("up");
								break;
							case "buttonPanDown" :
								tbViewport.pan("down");
								break;
							case "buttonPanRight" :
								tbViewport.pan("right");
								break;
							case "buttonReset" :
								tbViewport.reset();
								break;
						}
					}
					break;
				case "mouseup" :
					Z.Utils.addEventListener(targetBtn, "mousedown", buttonEventsHandler);
					if (tbViewport) {
						if (tID == "buttonSlider" || buttonSliderDown) {
							if (sliderInterval) {
								window.clearInterval(sliderInterval);
								sliderInterval = null;
							}				
							sliderSlideEnd();			
							Z.Utils.removeEventListener(document, "mousemove", sliderMouseMoveHandler);
							Z.Utils.removeEventListener(document, "mouseup", buttonEventsHandler);
							buttonsAllReset();
						} else if (tID == "buttonZoomOut" || tID == "buttonZoomIn") {
							tbViewport.zoom("stop");
						} else if (tID == "buttonPanLeft" || tID == "buttonPanRight") {
							tbViewport.pan("horizontalStop");
						} else if (tID == "buttonPanUp" || tID == "buttonPanDown") {
							tbViewport.pan("verticalStop");
						} else if (tID == "buttonFullPage") {
							tbViewport.toggleFullPageView();
						}
					}
					break;
				case "mouseout" :
					Z.Utils.addEventListener(targetBtn, "mouseover", buttonEventsHandler);
					if (tbViewport) {
						if (tID == "buttonZoomOut" || tID == "buttonZoomIn") {
							tbViewport.zoom("stop");
						} else if (tID == "buttonPanLeft" || tID == "buttonPanRight") {
							tbViewport.pan("horizontalStop");
						} else if (tID == "buttonPanUp" || tID == "buttonPanDown") {
							tbViewport.pan("verticalStop");
						}
					}
					break;
				case "touchstart" :
					Z.Utils.addEventListener(targetBtn, "touchend", buttonEventsHandler);
					Z.Utils.addEventListener(targetBtn, "touchcancel", buttonEventsHandler);
					if (tbViewport) {
						switch (tID) {
							case "buttonMinimize" :
								self.minimize(true);
								Z.Navigator.setVisibility(false);
								break;
							case "buttonExpand" :
								self.minimize(false);
								Z.Navigator.setVisibility(true);
								break;
							case "buttonZoomOut" :
								tbViewport.zoom("out");
								break;
							case "buttonSlider" :
								sliderSlideStart(event);
								sliderTouchMoveHandler(event); // Run once so values are defined at first movement.
								Z.Utils.addEventListener(document, "touchmove", sliderTouchMoveHandler);
								if (!sliderInterval) { sliderInterval = window.setInterval(sliderSlide, SLIDER_TEST_DURATION); }
								Z.Utils.addEventListener(targetBtn, "touchend", buttonEventsHandler);
								Z.Utils.addEventListener(targetBtn, "touchcancel", buttonEventsHandler);
								break;
							case "trackSlider" :
								sliderSnap(event);
								break;
							case "buttonZoomIn" :
								tbViewport.zoom("in");
								break;
							case "buttonPanLeft" :
								tbViewport.pan("left");
								break;
							case "buttonPanUp" :
								tbViewport.pan("up");
								break;
							case "buttonPanDown" :
								tbViewport.pan("down");
								break;
							case "buttonPanRight" :
								tbViewport.pan("right");
								break;
							case "buttonReset" :
								tbViewport.reset();
								break;
						}
					}
					break;
				case "touchend" :
					Z.Utils.addEventListener(targetBtn, "touchstart", buttonEventsHandler);
					if (tbViewport) {
						if (tID == "buttonZoomOut" || tID == "buttonZoomIn") {
							tbViewport.zoom("stop");
							if (Z.debug && tID == "buttonZoomOut" && event.altKey) { Z.Utils.showGlobals(); } // Debugging option.
						} else if (tID == "buttonSlider") {
							if (sliderInterval) {
								window.clearInterval(sliderInterval);
								sliderInterval = null;
							}				
							sliderSlideEnd();
							Z.Utils.removeEventListener(document, "touchmove", sliderTouchMoveHandler);
						} else if (tID == "buttonPanLeft" || tID == "buttonPanRight") {
							tbViewport.pan("horizontalStop");
						} else if (tID == "buttonPanUp" || tID == "buttonPanDown") {
							tbViewport.pan("verticalStop");
						} else if (tID == "buttonFullPage") {
							tbViewport.toggleFullPageView();
						}
					}
					break;
				case "touchcancel" :
					Z.Utils.addEventListener(targetBtn, "touchstart", buttonEventsHandler);
					if (tbViewport) {
						if (tID == "buttonZoomOut" || tID == "buttonZoomIn") {
							tbViewport.zoom("stop");
							if (Z.debug && tID == "buttonZoomOut" && event.altKey) { Z.Utils.showGlobals(); } // Debugging option.
						} else if (tID == "buttonSlider") {
							if (sliderInterval) {
								window.clearInterval(sliderInterval);
								sliderInterval = null;
							}				
							sliderSlideEnd();
							Z.Utils.removeEventListener(document, "touchmove", sliderTouchMoveHandler);
						} else if (tID == "buttonPanLeft" || tID == "buttonPanRight") {
							tbViewport.pan("horizontalStop");
						} else if (tID == "buttonPanUp" || tID == "buttonPanDown") {
							tbViewport.pan("verticalStop");
						} else if (tID == "buttonFullPage") {
							tbViewport.toggleFullPageView();
						}
					}
					break;
			}
		}
	};
	
	function sliderMouseMoveHandler (event) {
		sliderIntervalMousePt = new Z.Utils.Point(event.clientX, event.clientY); 
	};
	
	function sliderTouchMoveHandler (event) {
		var touch = Z.Utils.getFirstTouch(event);
		if (touch) {
			var target = touch.target;
			sliderIntervalMousePt = new Z.Utils.Point(touch.pageX, touch.pageY);
		}
	};
};



//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::: NAVIGATOR FUNCTIONS :::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Z.ZoomifyNavigator = function (navViewport) {

	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	//:::::::::::::::::::::::::::::::::: INIT FUNCTIONS :::::::::::::::::::::::::::::::::
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	// Declare variables for navigator internal self-reference and initialization completion.
	var self = this;
	var isInitialized = false;
	var validateNavigatorGlobalsInterval;

	// Declare variables for navigator display.
	var nD, ndS, nB, nbS, niC, nicS, nI, nR, nrS;
	var navigatorImage, navigatorImageTimer;
		
	// Declare and set variables local to navigator for size and position.
	var navW = Z.navigatorW;
	var navH = Z.navigatorH;
	var navL = Z.navigatorL-1;
	var navT = Z.navigatorT-1;
	var navFit = Z.navigatorFit;
	var navImageW, navImageH = null;
	
	// Load Zoomify Image thumbnail.
	var navigatorBackAlpha = parseFloat(Z.Utils.getResource("DEFAULT_NAVIGATORBACKALPHA"));
	var navigatorImagePath;	
	loadNavigatorImage(initializeNavigator);
	
	function initializeNavigator (tlbrSknArr) {
		// Create navigator display to contain background, image, and rectangle.
		Z.NavigatorDisplay = Z.Utils.createContainerElement("div", "NavigatorDisplay", "inline-block", "absolute", "hidden", navW + "px", navH + "px", navL + "px", navT + "px", "solid", "1px", "transparent none", "0px", "0px");
		nD = Z.NavigatorDisplay;
		ndS = nD.style;

		// Create background and set transparency.
		var navigatorBackColor = Z.Utils.getResource("DEFAULT_NAVIGATORBACKCOLOR");
		var navigatorBackColorNoAlpha = Z.Utils.getResource("DEFAULT_NAVIGATORBACKCOLORNOALPHA");
		var navigatorBackground = Z.Utils.createContainerElement("div", "navigatorBackground", "inline-block", "absolute", "hidden", navW + "px", navH + "px", "0px", "0px", "none", "0px", navigatorBackColor, "0px", "0px");
		Z.Utils.setOpacity(navigatorBackground, navigatorBackAlpha, navigatorBackColorNoAlpha);
		Z.NavigatorDisplay.appendChild(navigatorBackground);
		nB = navigatorBackground;
		nbS = nB.style;

		// Add thumbnail image previously loaded.
		var navigatorImageContainer = Z.Utils.createContainerElement("div", "navigatorImageContainer", "inline-block", "absolute", "hidden", navW + "px", navH + "px", "0px", "0px", "none", "0px", "transparent none", "0px", "0px");
		navigatorImageContainer.appendChild(navigatorImage);
		Z.NavigatorDisplay.appendChild(navigatorImageContainer);
		niC = navigatorImageContainer;
		nicS = niC.style;
		nI = navigatorImage;

		// Create rectangle to indicate position within image of current viewport view.
		var navigatorRectangle = Z.Utils.createContainerElement("div", "navigatorRectangle", "inline-block", "absolute", "hidden", navW+1 + "px", navH+1 + "px", navL + "px", navT + "px", "solid", "1px", "transparent none", "0px", "0px");
		navigatorRectangle.style.borderColor = Z.Utils.getResource("DEFAULT_NAVIGATORRECTANGLECOLOR");
		Z.NavigatorDisplay.appendChild(navigatorRectangle);
		nR = navigatorRectangle;
		nrS = nR.style;

		// Add navigator to viewer display and set size, position, visibility, and zIndex.
		Z.ViewerDisplay.appendChild(Z.NavigatorDisplay);
		sizeAndPosition(navW, navH, navL, navT, navFit);
		visibility(Z.navigatorVisible == 1 || Z.navigatorVisible == 2);
		moveToFront();

		// Enable mouse, initialize navigator, sync to viewport.
		if (!Z.mobileDevice) {
			// Prevent object dragging and bubbling.
			Z.Utils.addEventListener(nI, "mousedown", Z.Utils.preventDefault);
			Z.Utils.addEventListener(nD, "mousedown", Z.Utils.preventDefault);
			Z.Utils.addEventListener(nD, "mouseover", Z.Utils.stopPropagation)

			Z.Utils.addEventListener(nD, "mousedown", navigatorMouseDownHandler);
		} else {
			Z.Utils.addEventListener(nD, "touchstart", navigatorTouchStartHandler);
			Z.Utils.addEventListener(nD, "touchmove", navigatorTouchMoveHandler);
			Z.Utils.addEventListener(nD, "touchend", navigatorTouchEndHandler);
			Z.Utils.addEventListener(nD, "touchcancel", navigatorTouchCancelHandler);
		}
		// Prevent object context menu.
		Z.Utils.addEventListener(navigatorImage, "contextmenu", Z.Utils.preventDefault);
		Z.Utils.addEventListener(navigatorBackground, "contextmenu", Z.Utils.preventDefault);
		Z.Utils.addEventListener(navigatorRectangle, "contextmenu", Z.Utils.preventDefault);

		setInitialized(true);
		syncToViewport(); // Method also called in drawLayout in sizeAndPosition above but that is prior to full initialization of navigator.
	};
	
	function loadNavigatorImage (successFunction) {
		if (Z.tileSource == "ZoomifyImageFolder") {
			navigatorImagePath = Z.Utils.cacheProofPath(Z.imagePath + "/TileGroup0/" + "0-0-0.jpg");
		} else if (Z.tileSource == "ZoomifyImageFile") {
			navigatorImagePath = Z.Viewport.formatTilePath(0, 0, 0);
		//} else if (Z.tileSource == "OtherTileSource") { 
			// DEV NOTE: Process other tile source here.
		}
		navigatorImage = null;
		navigatorImage = new Image();
		navigatorImage.onload = successFunction;
		navigatorImage.onerror = navigatorImageLoadingFailed;
		if (navigatorImagePath != "offsetLoading") {
			navigatorImage.src = navigatorImagePath;
		} else {	
			navigatorImageTimer = window.setTimeout(loadNavigatorImage, 100, successFunction);
		}
	}
	
	this.setImagePath = function (imagePath) {
		niC.removeChild(navigatorImage);
		loadNavigatorImage(reinitializeNavigator);
	};
	
	function reinitializeNavigator (tlbrSknArr) {
		niC.appendChild(navigatorImage);	
		nI = Z.NavigatorDisplay.childNodes[1].firstChild; // Thumbnail.	
		sizeAndPosition(navW, navH, navL, navT, navFit);
		visibility(Z.navigatorVisible == 1 || Z.navigatorVisible == 2);
		moveToFront();	
	};



	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	//:::::::::::::::::::::::::::: GET & SET FUNCTIONS :::::::::::::::::::::::::::
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	this.getInitialized = function () {
		return getInitialized();
	};

	this.setSizeAndPosition = function (width, height, left, top, fit) {
		if (!fit) { fit = navFit; }
		sizeAndPosition(width, height, left, top, fit);
	};

	this.setVisibility = function (visible) {
		visibility(visible);
	};

	this.syncToViewport = function () {
		syncToViewport();
	};

	this.syncNavigatorRectangleDimensions = function () {
		syncNavigatorRectangleDimensions();
	};

	this.syncNavigatorRectanglePosition = function (currentCenterPt) {
		syncNavigatorRectanglePosition(currentCenterPt);
	};



	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	//:::::::::::::::::::::::::::::::: CORE FUNCTIONS :::::::::::::::::::::::::::::::
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	this.validateNavigatorGlobals = function () {
		if (getInitialized()) {
			validateNavigatorGlobals();
		} else {
			validateNavigatorGlobalsInterval = window.setInterval(validateNavigatorGlobals, 300);
		}
	};

	function validateNavigatorGlobals () {
		// Ensure synchronizing calls to navigator functions from viewport have access to navigator
		// internal global variables.  First clear any interval used to call this function after initialization.
		if (getInitialized()) {
			if (validateNavigatorGlobalsInterval) {
				window.clearInterval(validateNavigatorGlobalsInterval);
				validateNavigatorGlobalsInterval = null;
			}
			if (!nD || !ndS || !nB || !nbS || !niC || !nicS || !nI || !nR || !nrS) {
				nD = Z.NavigatorDisplay;
				ndS = nD.style;
				nB = Z.NavigatorDisplay.childNodes[0]; // Background.
				nbS = nB.style
				niC = Z.NavigatorDisplay.childNodes[1]; // Image container.
				nicS = niC.style
				nI = Z.NavigatorDisplay.childNodes[1].firstChild; // Thumbnail.
				nR = Z.NavigatorDisplay.childNodes[2]; // Navigation rectangle
				nrS = nR.style;
			}
		}
	};

	function getInitialized () {
		return isInitialized;
	};

	function setInitialized (value) {
		isInitialized = value;
	};

	function sizeAndPosition (width, height, left, top, fit) {
		if (!width) { width = Z.navigatorW; }
		if (!height) { height = Z.navigatorH; }
		if (!left) { left = 0; }
		if (!top) { top = 0; }
		if (!nD) { nD = Z.NavigatorDisplay; }
		if (!ndS) { ndS = nD.style; }
		
		// Set navigator image var explicitly in case image is being reset using setImagePath  
		// function to ensure thumbnail size is reset.
		nI = nD.childNodes[1].firstChild; 
		
		if (nD && ndS && nI) {
			// If fitting navigator to aspect ratio of image or viewer calculate and apply aspect
			// ratio to reset navigator dimensions while constraining it within width and height
			// parameters as bounding maximum values.
			if(fit) {
				var navAspect = 1;
				var targetAspect = 1;
				if(fit == 0) {
					targetAspect = Z.viewerW / Z.viewerH;
				} else {
					targetAspect = nI.width / nI.height;
				}
				if (navAspect > 1) {
					height = width;
					height /= targetAspect;
				} else {
					width = height;
					width *= targetAspect;
				}
			}

			// Size navigator.
			ndS.width = width + "px";
			ndS.height = height + "px";

			// Set navigator position.
			ndS.left = (left -1) + "px";
			ndS.top = (top - 1) + "px";

			drawLayout(width, height);
		}
	};

	function drawLayout (width, height) {
		if (!nbS) { nbS = Z.NavigatorDisplay.firstChild.style; } // Background.
		if (!nicS) { nicS = Z.NavigatorDisplay.childNodes[1].style; } // Image container.
		if (!nI) { nI = Z.NavigatorDisplay.childNodes[1].firstChild; } // Thumbnail image.
		if(nbS && nicS && nI) {
			nbS.width = width + "px";
			nbS.height = height + "px";
			setSizeNavigatorImage(width, height, nI.width, nI.height);
			nicS.width = nI.width + "px";
			nicS.height = nI.height + "px";
			nicS.left = ((width - parseFloat(nicS.width)) / 2) + "px";
			nicS.top = ((height - parseFloat(nicS.height)) / 2) + "px";
			syncToViewport();
		}
	};

	function setSizeNavigatorImage (navW, navH, navImgW, navImgH) {
		if (!nI) { nI = Z.NavigatorDisplay.childNodes[1].firstChild; } // Thumbnail image.
		if (nI) {
			var imageAspectRatio = navImgW / navImgH;
			var scaleW = navW / navImgW;
			var scaleH = navH / navImgH;
			var navImageL = 0;
			var navImageT = 0;
			if (scaleW <= scaleH) {
				navImgW = navW;
				navImgH = navW / imageAspectRatio;
				navImageT = ((navH - navImgH * (navW / navImgW)) / 2);
			} else if (scaleH < scaleW) {
				navImgH = navH;
				navImgW = navH * imageAspectRatio;
				navImageL = ((navW - navImgW * (navH / navImgH)) / 2);
			}
			nI.width = navImgW;
			nI.height = navImgH;
		}
	};

	function moveToFront() {
		if (!ndS) { ndS = Z.NavigatorDisplay.style; }
		if (ndS) { ndS.zIndex = ndS.zIndex + 100; }
	};

	function syncToViewport () {
		// Set navigator rectangle size and position.
		if (Z.Viewport && Z.Viewport.getInitialized()) {
			syncNavigatorRectangleDimensions();
			var currentCenterPt = Z.Viewport.calculateCurrentCenterCoordinates();
			syncNavigatorRectanglePosition(currentCenterPt);
		}
	};

	function visibility (visible) {
		if (!ndS) { ndS = Z.NavigatorDisplay.style; }
		if (ndS) {
			if (visible) {
				ndS.display = "inline-block";
			} else {
				ndS.display = "none";
			}
		}
	};

	function syncNavigatorRectangleDimensions () {
		if (nI && nrS) {
			var scaleW = nI.width / Z.imageW;
			var scaleH = nI.height / Z.imageH;
			var currentZ = Z.Viewport.getTierScaleAsZoom();
			var vpScaledW = Z.viewerW * scaleW / currentZ;
			var vpScaledH = Z.viewerH * scaleH / currentZ;
			nrS.width = vpScaledW + "px";
			nrS.height = vpScaledH + "px";
		}
	};

	function syncNavigatorRectanglePosition (cDurrCtrPt) {
		if (nI && nrS && nicS) {
			var scaleW = nI.width / Z.imageW;
			var scaleH = nI.height / Z.imageH;
			var scaledCurrX = cDurrCtrPt.x * scaleW;
			var scaledCurrY = cDurrCtrPt.y * scaleH;
			var navImageCtrX = scaledCurrX - (parseFloat(nrS.width) / 2);
			var navImageCtrY = scaledCurrY - (parseFloat(nrS.height) / 2);
			nrS.left = navImageCtrX + parseFloat(nicS.left) + "px";
			nrS.top = navImageCtrY + parseFloat(nicS.top) + "px";
		}
	};

	function syncViewport () {
		// Calculate navigator rectangle center point and pass to viewport display for sync.
		if (nrS && nicS && nI) {
			var navImageCtrX = parseFloat(nrS.left) - parseFloat(nicS.left) ;
			var navImageCtrY = parseFloat(nrS.top) - parseFloat(nicS.top);
			var scaledCurrX = navImageCtrX + ((parseFloat(nrS.width) - 1) / 2);
			var scaledCurrY = navImageCtrY + ((parseFloat(nrS.height) - 1) / 2);
			var scaleW = Z.imageW / nI.width;
			var scaleH = Z.imageH / nI.height;
			var cDurrX = scaledCurrX * scaleW;
			var cDurrY = scaledCurrY * scaleH;
			Z.Viewport.syncToNavigator(cDurrX, cDurrY);
		}
	};

	function navigatorImageLoadingFailed () {
		Z.Utils.showMessage(Z.Utils.getResource("ERROR_NAVIGATORIMAGEPATHINVALID"));
	};



	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	//::::::::::::::::::::::::::::::::: EVENT FUNCTIONS ::::::::::::::::::::::::::::::
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	function navigatorMouseDownHandler (event) {
		if (nD && nR && nrS) {
			var event = Z.Utils.event(event);
			nR.mouseXPrior = event.clientX;
			nR.mouseYPrior = event.clientY;
			zaptvDragPtStart = new Z.Utils.Point(event.clientX, event.clientY);
			Z.Utils.addEventListener(nD, "mousemove", navigatorMouseMoveHandler);
			Z.Utils.addEventListener(nD, "mouseup", navigatorMouseUpHandler);
			Z.Utils.addEventListener(document, "mouseup", navigatorMouseUpHandler);
		}
	};

	function navigatorMouseMoveHandler (event) {
		if (nR && nrS) {
			var x = parseFloat(nrS.left);
			var y = parseFloat(nrS.top);
			nrS.left = x + (event.clientX - nR.mouseXPrior) + "px";
			nrS.top = y + (event.clientY - nR.mouseYPrior) + "px";
			nR.mouseXPrior = event.clientX;
			nR.mouseYPrior = event.clientY;
			syncViewport();
			return false;
		}
	};

	function navigatorMouseUpHandler (event) {
		if (nD && nR && nrS) {
			document.mousemove = null;
			document.mouseup = null;
			Z.Utils.removeEventListener(nD, "mousemove", navigatorMouseMoveHandler);
			Z.Utils.removeEventListener(nD, "mouseup", navigatorMouseUpHandler);
			Z.Utils.removeEventListener(document, "mouseup", navigatorMouseUpHandler);
			var event = Z.Utils.event(event);
			var dragEndPt = new Z.Utils.Point(event.clientX, event.clientY);
			var dragDist = Math.sqrt(Math.pow(zaptvDragPtStart.x - dragEndPt.x, 2) + Math.pow(zaptvDragPtStart.y - dragEndPt.y, 2));
			if (dragDist < 4) {
				var navDispOffsets = Z.Utils.getElementPosition(Z.NavigatorDisplay);
				nrS.left = event.clientX - navDispOffsets.x - (parseFloat(nrS.width) / 2) + "px";
				nrS.top = event.clientY - navDispOffsets.y - (parseFloat(nrS.height) / 2) + "px";
			}
			syncViewport();
			Z.Viewport.updateView();
		}
	};

	function navigatorTouchStartHandler (event) {
		event.preventDefault(); // Prevent copy selection.
		if (nD && nR && nrS) {
			var touch = Z.Utils.getFirstTouch(event);
			if (touch) {
				var target = touch.target;
				var mPt = new Z.Utils.Point(touch.pageX, touch.pageY);
				zaptvDragPtStart = new Z.Utils.Point(mPt.x, mPt.y);
				nR.mouseXPrior = mPt.x;
				nR.mouseYPrior = mPt.y;
				zaptvDragPtStart = new Z.Utils.Point(mPt.x, mPt.y);
			}
		}
	};

	function navigatorTouchMoveHandler (event) {
		event.preventDefault(); // Prevent page dragging.
		if (!Z.mousePan) { return; }  // Disallow mouse panning if parameter false.

		if (nR && nrS) {
			var touch = Z.Utils.getFirstTouch(event);
			if (touch) {
				var target = touch.target;
				var mPt = new Z.Utils.Point(touch.pageX, touch.pageY);
				var x = parseFloat(nrS.left);
				var y = parseFloat(nrS.top);
				nrS.left = x + (mPt.x - nR.mouseXPrior) + "px";
				nrS.top = y + (mPt.y - nR.mouseYPrior) + "px";
				nR.mouseXPrior = mPt.x;
				nR.mouseYPrior = mPt.y;
				syncViewport();
				return false;
			}
		}

		return false;
	};

	function navigatorTouchEndHandler (event) {
		if (nD && nR && nrS) {
			var touch = Z.Utils.getFirstTouch(event);
			if (touch) {
				var target = touch.target;
				var mPt = new Z.Utils.Point(touch.pageX, touch.pageY);
				var dragEndPt = new Z.Utils.Point(mPt.x, mPt.y);
				var dragDist = Math.sqrt(Math.pow(zaptvDragPtStart.x - dragEndPt.x, 2) + Math.pow(zaptvDragPtStart.y - dragEndPt.y, 2));
				var clickThreshold = (!Z.mobileDevice) ? 3 : 6;
				if (dragDist < clickThreshold) {
					var navDispOffsets = Z.Utils.getElementPosition(Z.NavigatorDisplay);
					nrS.left = mPt.x - navDispOffsets.x - (parseFloat(nrS.width) / 2) + "px";
					nrS.top = mPt.y - navDispOffsets.y - (parseFloat(nrS.height) / 2) + "px";
				}
			}
			syncViewport();
			Z.Viewport.updateView();
		}
	};

	function navigatorTouchCancelHandler (event) {
		if (nD && nR && nrS) {
			var touch = Z.Utils.getFirstTouch(event);
			if (touch) {
				var target = touch.target;
				var mPt = new Z.Utils.Point(touch.pageX, touch.pageY);
				var dragEndPt = new Z.Utils.Point(mPt.x, mPt.y);
				var dragDist = Math.sqrt(Math.pow(zaptvDragPtStart.x - dragEndPt.x, 2) + Math.pow(zaptvDragPtStart.y - dragEndPt.y, 2));
				var clickThreshold = (!Z.mobileDevice) ? 3 : 6;
				if (dragDist < clickThreshold) {
					var navDispOffsets = Z.Utils.getElementPosition(Z.NavigatorDisplay);
					nrS.left = mPt.x - navDispOffsets.x - (parseFloat(nrS.width) / 2) + "px";
					nrS.top = mPt.y - navDispOffsets.y - (parseFloat(nrS.height) / 2) + "px";
				}
			}
			syncViewport();
			Z.Viewport.updateView();
		}
	};
};


//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::::::::::::::::::::::: NETCONNECTOR FUNCTIONS :::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Z.NetConnector = function (xmlPath) {
	var tileImagesLoading = 0;

	this.loadXML = function (xmlPath) {
		makeNetRequest(xmlPath, receiveXML);
	};

	function makeNetRequest(url, callback) {
		var netRequest = null;
		var isAsync = typeof(callback) == "function";
		if (isAsync) {
			var actual = callback;
			var callback = function () {
				window.setTimeout(Z.Utils.createCallback(null, actual, netRequest), 1);
			};
		}
		if (window.ActiveXObject) {
			var arrActiveX = ["Msxml2.XMLHTTP", "Msxml3.XMLHTTP", "Microsoft.XMLHTTP"];
			for (var i = 0; i < arrActiveX.length; i++) {
				try {
					netRequest = new ActiveXObject(arrActiveX[i]);
					break;
				} catch (e) {
					continue;
				}
			}
		} else if (window.XMLHttpRequest) {
			netRequest = new XMLHttpRequest();
		}
		if (!netRequest) { Z.Utils.showMessage(Z.Utils.getResource("ERROR_XMLHTTPREQUESTUNSUPPORTED")); }
		if (isAsync) {
			netRequest.onreadystatechange = function () {
				if (netRequest.readyState == 4) {
					netRequest.onreadystatechange = new Function ();
					callback();
				}
			};
		}
			
		try {
			netRequest.open("GET", url, isAsync);
			netRequest.send(null);
		} catch (e) {			
			if (url.indexOf("ImageProperties.xml") != -1) {
				Z.Utils.showMessage(Z.Utils.getResource("ERROR_MAKINGNETWORKREQUEST-IMAGEXML"));
			} else if (url.toUpperCase().indexOf(".PFF") != -1) {
				Z.Utils.showMessage(Z.Utils.getResource("ERROR_MAKINGNETWORKREQUEST-IMAGEHEADER"));
			} else if (url.toUpperCase().indexOf("reply_data") != -1) {
				Z.Utils.showMessage(Z.Utils.getResource("ERROR_MAKINGNETWORKREQUEST-IMAGEOFFSET"));
			} else if (url.indexOf("skinFiles.xml") != -1) {
				Z.Utils.showMessage(Z.Utils.getResource("ERROR_MAKINGNETWORKREQUEST-TOOLBARXML"));
			} else {
				Z.Utils.showMessage(Z.Utils.getResource("ERROR_MAKINGNETWORKREQUEST"));
			}
			netRequest.onreadystatechange = null;
			netRequest = null;
			// if (isAsync) { callback(); } // Debug option.
		}
		return isAsync ? null : netRequest;
	};

	function receiveXML(xhr) {
		if (!xhr) {
			Z.Utils.showMessage(Z.Utils.getResource("ERROR_NETWORKSECURITY"));
		} else if (xhr.status !== 200 && xhr.status !== 0) {
			var status = xhr.status;
			var statusText = (status == 404) ? "Not Found" : xhr.statusText;
			Z.Utils.showMessage(Z.Utils.getResource("ERROR_NETWORKSTATUS") + status + " - " + statusText);
		} else {
			var doc = null;
			if (xhr.responseXML && xhr.responseXML.documentElement) {
				doc = xhr.responseXML;
				validateXML(doc);
			} else if (xhr.responseText) {
				var xmlText = xhr.responseText;
				if (Z.tileSource == "ZoomifyImageFile") { 
					if (xmlText.toUpperCase().indexOf("PFFHEADER") != -1) {
						var dataIndex = xmlText.indexOf("reply_data=") + "reply_data=".length;
						xmlText = xmlText.substring(dataIndex, xmlText.length); 
					} else {
						// DEV NOTE: Normalize servlet response.
						var beginIndex = xmlText.indexOf("begin=") + "begin=".length;
						var beginEndIndex = xmlText.indexOf("&", beginIndex);						
						beginValue = xmlText.substring(beginIndex, beginEndIndex);						
						var replyDataIndex = xmlText.indexOf("reply_data=") + "reply_data=".length;
						replyDataValue = xmlText.substring(replyDataIndex, xmlText.length); 
						xmlText = '<PFFOFFSET BEGIN="' + beginValue + '" REPLYDATA="' + replyDataValue + '" />'; 
					}
					doc = Z.Utils.convertXMLTextToXMLDoc(xmlText);
					validateXML(doc);
				//} else if (Z.tileSource == "OtherTileSource") { 
					// DEV NOTE: Process other tile source here.
				}
			}
		}
	};

	function validateXML(xmlDoc) {
		if (xmlDoc && xmlDoc.documentElement) {
			var rootName = xmlDoc.documentElement.tagName;
			if (rootName == "COPYRIGHT") {
				parseXML("copyright", xmlDoc);
			} else if ((rootName == "IMAGE_PROPERTIES") || (rootName == "PFFHEADER")) {
				parseXML("image", xmlDoc);
			} else if (rootName == "PFFOFFSET") {
				parseXML("offset", xmlDoc);
			} else if (rootName == "SKINDATA") {
				parseXML("skin", xmlDoc);
			} else {
				Z.Utils.showMessage(Z.Utils.getResource("ERROR_XMLINVALID"));
			}
		} else {
			Z.Utils.showMessage(Z.Utils.getResource("ERROR_XMLDOCINVALID"));
		}
	};

	function parseXML(xmlType, xmlDoc) {
		if (xmlType == "copyright") {
			// Get text for copyright display.
			var cStatementText = xmlDoc.documentElement.getAttribute("STATEMENTTEXT");
			var cDeclinedText = xmlDoc.documentElement.getAttribute("DECLINEDTEXT");
			if (Z.Utils.isStrVal(cStatementText)) {
				Z.Utils.showCopyright(true, cStatementText, cDeclinedText);
			} else {
				Z.Utils.showMessage(Z.Utils.getResource("ERROR_IMAGEXMLINVALID"));
			}
		} else if (xmlType == "image") {
			// Get key properties of Zoomify Image and initialize Viewport.
			var iW, iH, tSz, iTileCount, iVersion, iHeaderSize, iHeaderSizeTotal;			
			if (Z.tileSource == "ZoomifyImageFolder") {
				iW = parseInt(xmlDoc.documentElement.getAttribute("WIDTH"), 10);
				iH = parseInt(xmlDoc.documentElement.getAttribute("HEIGHT"), 10);
				tSz = parseInt(xmlDoc.documentElement.getAttribute("TILESIZE"), 10);
			} else if (Z.tileSource == "ZoomifyImageFile") {
				iW = parseInt(xmlDoc.documentElement.getAttribute("WIDTH"), 10);
				iH = parseInt(xmlDoc.documentElement.getAttribute("HEIGHT"), 10);
				tSz = parseInt(xmlDoc.documentElement.getAttribute("TILESIZE"), 10);
				iTileCount = parseInt(xmlDoc.documentElement.getAttribute("NUMTILES"), 10);
				iVersion = parseInt(xmlDoc.documentElement.getAttribute("VERSION"), 10);
				iHeaderSize = parseInt(xmlDoc.documentElement.getAttribute("HEADERSIZE"), 10);
				iHeaderSizeTotal = 904 + 136 + 20 + iHeaderSize;
			//} else if (Z.tileSource == "OtherTileSource") { 
				// DEV NOTE: Process other tile source here.
			}
			if (!isNaN(iW) && iW > 0 && !isNaN(iH) && iH > 0 && !isNaN(tSz) && tSz > 0) {
				if (Z.Viewport) { 
					if (!Z.Viewport.getInitialized()) {
						Z.Viewport.initializeViewport(iW, iH, tSz, iTileCount, iVersion, iHeaderSize, iHeaderSizeTotal);
					} else {
						Z.Viewport.reinitializeViewport(iW, iH, tSz, iTileCount, iVersion, iHeaderSize, iHeaderSizeTotal);					
					}
				}
			} else {
				Z.Utils.showMessage(Z.Utils.getResource("ERROR_IMAGEXMLINVALID"));
			}
		} else if (xmlType == "offset") {
			// Pass received chunk offset data back to Viewer to reenter tile loading process.
			Z.Viewport.parseOffsetChunk(xmlDoc);
		} else if (xmlType == "skin") {
			// Get selection mode for optional small screen graphics fileset.
			Z.skinMode = xmlDoc.getElementsByTagName("SETUP")[0].attributes.getNamedItem("SKINMODE").nodeValue;
			var skinFolder, skinSizesTag;
			if (Z.skinMode == 1 || (Z.skinMode == 0 && !Z.mobileDevice)) {
				skinFolder = xmlDoc.getElementsByTagName("SETUP")[0].attributes.getNamedItem("FOLDERSTANDARD").nodeValue;
				skinSizesTag = "SIZESSTANDARD";
			} else {
				skinFolder = xmlDoc.getElementsByTagName("SETUP")[0].attributes.getNamedItem("FOLDERLARGE").nodeValue;
				skinSizesTag = "SIZESLARGE";
			}

			// Get toolbar element dimensions.
			var toolbarSkinSizes = [];
			toolbarSkinSizes.push(parseFloat(xmlDoc.getElementsByTagName(skinSizesTag)[0].attributes.getNamedItem("TOOLBARW").nodeValue));
			toolbarSkinSizes.push(parseFloat(xmlDoc.getElementsByTagName(skinSizesTag)[0].attributes.getNamedItem("TOOLBARH").nodeValue));
			toolbarSkinSizes.push(parseFloat(xmlDoc.getElementsByTagName(skinSizesTag)[0].attributes.getNamedItem("LOGOW").nodeValue));
			toolbarSkinSizes.push(parseFloat(xmlDoc.getElementsByTagName(skinSizesTag)[0].attributes.getNamedItem("LOGOH").nodeValue));
			toolbarSkinSizes.push(parseFloat(xmlDoc.getElementsByTagName(skinSizesTag)[0].attributes.getNamedItem("DIVIDERW").nodeValue));
			toolbarSkinSizes.push(parseFloat(xmlDoc.getElementsByTagName(skinSizesTag)[0].attributes.getNamedItem("DIVIDERH").nodeValue));
			toolbarSkinSizes.push(parseFloat(xmlDoc.getElementsByTagName(skinSizesTag)[0].attributes.getNamedItem("BUTTONW").nodeValue));
			toolbarSkinSizes.push(parseFloat(xmlDoc.getElementsByTagName(skinSizesTag)[0].attributes.getNamedItem("BUTTONH").nodeValue));
			toolbarSkinSizes.push(parseFloat(xmlDoc.getElementsByTagName(skinSizesTag)[0].attributes.getNamedItem("BUTTONSPAN").nodeValue));
			toolbarSkinSizes.push(parseFloat(xmlDoc.getElementsByTagName(skinSizesTag)[0].attributes.getNamedItem("SLIDERBUTTONW").nodeValue));
			toolbarSkinSizes.push(parseFloat(xmlDoc.getElementsByTagName(skinSizesTag)[0].attributes.getNamedItem("SLIDERBUTTONH").nodeValue));
			toolbarSkinSizes.push(parseFloat(xmlDoc.getElementsByTagName(skinSizesTag)[0].attributes.getNamedItem("SLIDERTRACKW").nodeValue));
			toolbarSkinSizes.push(parseFloat(xmlDoc.getElementsByTagName(skinSizesTag)[0].attributes.getNamedItem("SLIDERTRACKH").nodeValue));
			toolbarSkinSizes.push(parseFloat(xmlDoc.getElementsByTagName(skinSizesTag)[0].attributes.getNamedItem("SLIDERSPAN").nodeValue));
			toolbarSkinSizes.push(parseFloat(xmlDoc.getElementsByTagName(skinSizesTag)[0].attributes.getNamedItem("PROGRESSW").nodeValue));
			toolbarSkinSizes.push(parseFloat(xmlDoc.getElementsByTagName(skinSizesTag)[0].attributes.getNamedItem("PROGRESSH").nodeValue));
			toolbarSkinSizes.push(parseFloat(xmlDoc.getElementsByTagName(skinSizesTag)[0].attributes.getNamedItem("PROGRESSFONTSIZE").nodeValue));

			// Get names of skin files of the Zoomify Toolbar.
			var toolbarSkinFilePaths = [];
			var sk0 = xmlDoc.getElementsByTagName("FILES")[0].attributes.getNamedItem("SKIN0").nodeValue;
			var sk39 = xmlDoc.getElementsByTagName("FILES")[0].attributes.getNamedItem("SKIN39").nodeValue;
			if (Z.Utils.isStrVal(sk0) && Z.Utils.isStrVal(sk39)) {
				var xmlMissingNames = false;
				for (var i = 0; i < 40; i++) {
					var skinI = xmlDoc.getElementsByTagName("FILES")[0].attributes.getNamedItem("SKIN" + i).nodeValue;
					if (Z.Utils.isStrVal(skinI)) {
						toolbarSkinFilePaths[i] = skinFolder + "/" + skinI;
					} else {
						toolbarSkinFilePaths[i] = "null";
						xmlMissingNames = true;
					}
				}
				if (xmlMissingNames) { Z.Utils.showMessage(Z.Utils.getResource("ERROR_SKINSXMLMISSINGNAMES")); }
				if (Z.Toolbar) { Z.Toolbar.initializeToolbar(toolbarSkinSizes, toolbarSkinFilePaths); }
			} else {
				Z.Utils.showMessage(Z.Utils.getResource("ERROR_SKINXMLINVALID"));
			}
		}
	};

	this.loadTileImage = function (src, callback) {
		if (tileImagesLoading >= parseInt(Z.Utils.getResource("DEFAULT_IMAGESLOADINGMAX"), 10)) { return false; }
		var func = Z.Utils.createCallback(null, onComplete, callback);
		var tileImageNetRequest = new TileImageNetRequest(src, func);
		tileImagesLoading++;
		tileImageNetRequest.start();
		return true;
	};

	function onComplete(callback, src, img) {
		tileImagesLoading--;
		if (typeof(callback) == "function") {
			try {
				callback(img);
			} catch (e) {
				Z.Utils.showMessage(e.name + Z.Utils.getResource("ERROR_EXECUTINGCALLBACK") + src + " " + e.message);
			}
		}
	};

	function TileImageNetRequest(src, callback) {
		var tileImage = null;
		var timeout = null;
		this.start = function () {
			tileImage = new Image();
			var successFunction = function () { complete(true); };
			var failureFunction = function () { complete(false); };
			var timeoutFunc = function () {
				// Debugging option. Retry implementation to follow.
				//Z.Utils.showMessage(Z.Utils.getResource("ERROR_IMAGEREQUESTTIMEDOUT") + src);
				complete(false);
			};
			tileImage.onload = successFunction;
			tileImage.onabort = failureFunction;
			tileImage.onerror = failureFunction;
			timeout = window.setTimeout(timeoutFunc, parseFloat(Z.Utils.getResource("DEFAULT_TILEIMAGELOADTIMEOUT")));
			tileImage.src = src;
		};

		function complete(success) {
			tileImage.onload = null;
			tileImage.onabort = null;
			tileImage.onerror = null;
			if (timeout) { window.clearTimeout(timeout); }
			window.setTimeout(function () { callback(src, success ? tileImage : null); }, 1);
		};
	}
};



//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::::::::::::::::::::::::::::::: UTILITY FUNCTIONS :::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Z.Utils = {

	declareGlobals : function () {
		// IMAGE & SKIN
		Z.pageContainerID = null;
		Z.imagePath = null;
		Z.skinPath = null;
		Z.skinMode = null;
		Z.parameters = null;

		// PAGE & BROWSER
		Z.browsers = null;
		Z.browser = null;
		Z.browserVersion = null;
		Z.canvasSupported = null;
		Z.cssTransformsSupported = null;
		Z.cssTransformProperty = null;
		Z.cssTransformNoUnits = null;
		Z.alphaSupported = null;
		Z.renderQuality = null;
		Z.mobileDevice = null;

		// VIEWER OPTIONS & DEFAULTS
		Z.initialX = null;
		Z.initialY = null;
		Z.initialZ = null;
		Z.minZ = null;
		Z.maxZ = null;
		Z.zoomSpeed = null;
		Z.panSpeed = null;
		Z.fadeInSpeed = null;
		Z.toolbarVisible = null;
		Z.toolbarW = null;
		Z.toolbarH = null;
		Z.toolbarPosition = null;
		Z.navigatorVisible = null;
		Z.navigatorW = null;
		Z.navigatorH =  null;
		Z.navigatorL = null;
		Z.navigatorT = null;
		Z.navigatorFit = null;
		Z.clickZoom = null;
		Z.clickPan = null;
		Z.mousePan = null;
		Z.keys = null;
		Z.constrainPan = null;
		Z.tooltipsVisible = null;
		Z.copyrightPath = null;
		Z.watermarkPath = null;
		Z.sliderVisible = null;
		Z.fullPageVisible = null;
		Z.fullPageInit = null;		
		Z.progressVisible = null;
		Z.logoVisible = null;
		Z.logoCustomPath = null;
		Z.canvas = null;
		Z.debug = null;
		Z.serverIP = null;
		Z.serverPort = null;
		Z.tileHandlerPath = null;
		Z.tileHandlerPathFull = null;
		Z.tileSource = null;

		// VIEWER COMPONENTS & STATE VALUES
		Z.Viewer = null;
		Z.ViewerDisplay = null;
		Z.Viewport = null;
		Z.Toolbar = null;
		Z.ToolbarDisplay = null;
		Z.TooltipDisplay = null;
		Z.Navigator = null;
		Z.NavigatorDisplay = null;
		Z.CopyrightDisplay = null;
		Z.imageW = null;
		Z.imageH = null;
		Z.imageX = 0;
		Z.imageY = 0;
		Z.imageZ = 0;
		Z.fitZ = null;
		Z.zooming = "stop";
		Z.panningX = "stop";
		Z.panningY = "stop";
		Z.fullPage = false;
		Z.useCanvas = true;
		Z.TraceDisplay = null;
		Z.traces = null;
	},

	enforceCopyright : function () {
		// Test whether copyright has already been presented, and if not, load and display text and require user OK.
		var copyrightCookieExists = this.readCookie('imageCopyright')
		if (copyrightCookieExists) {
			Z.Viewer.configureViewer();
		} else {
			this.loadCopyrightText();
		}
	},

	loadCopyrightText : function () {
		// Load copyright XML for text to display.
		var netConnector = new Z.NetConnector();
		netConnector.loadXML(Z.copyrightPath);
	},

	showCopyright : function (show, cStateTxt, cDecTxt) {
		// Display copyright text and, if confirmed, create cookie to prevent re-display during the current browser session.
		var scrnColor = this.getResource("DEFAULT_COPYRIGHTSCREENCOLOR");
		var btnColor = this.getResource("DEFAULT_COPYRIGHTBUTTONCOLOR");

		if (show) {
			Z.CopyrightDisplay = this.createContainerElement("div", "CopyrightDisplay", "inline-block", "absolute", "hidden", (Z.viewerW - 2) + "px", (Z.viewerH - 2) + "px", "0px", "0px", "solid", "1px", scrnColor, "0px", "0px");
			Z.ViewerDisplay.appendChild(Z.CopyrightDisplay);
			// Create centered container for text.
			var textBoxW = 440;
			var textBoxH = 200;
			var textBoxLeft = (parseFloat(Z.CopyrightDisplay.style.width) / 2) - (textBoxW / 2);
			var textBoxTop = (parseFloat(Z.CopyrightDisplay.style.height) / 2) - (textBoxH / 2);
			var textBox = this.createContainerElement("div", "textBox", "inline-block", "absolute", "hidden", textBoxW + "px", textBoxH + "px", textBoxLeft + "px", textBoxTop + "px", "none", "0px", "transparent none", "0px", "0px");
			textBox.id="textBox";
			Z.CopyrightDisplay.appendChild(textBox);

			// Create text node and add text from xml file.
			var copyrightTextNode = document.createTextNode(cStateTxt);
			textBox.appendChild(this.createCenteredElement(copyrightTextNode));
			this.setTextStyle(copyrightTextNode, "black", "verdana", "16px", "none", "normal", "normal", "normal", "normal", "1em", "justify", "none");

			// Add hidden text node to store decline text for Exit condition.
			var declinedTextNode = document.createTextNode(cDecTxt);
			textBox.appendChild(declinedTextNode);

			var btnW = 80;
			var btnH = 20;
			var dvdrW = 30;
			var dvdrH = 20;

			var btnL = textBoxLeft + (textBoxW / 2) - ((btnW * 2 + dvdrW) / 2);
			var btnT = textBoxTop + textBoxH + dvdrH;
			var btnTxt = this.getResource("DEFAULT_COPYRIGHTAGREEBUTTONTEXT");
			var buttonAgree = new Z.Utils.Button("buttonAgree", btnTxt, null, null, null, null, btnW + "px", btnH + "px", btnL + "px", btnT + "px", "mousedown", this.copyrightAgreeButtonHandler, "TIP_COPYRIGHTAGREE", "solid", "1px", btnColor, "0px", "0px");
			Z.CopyrightDisplay.appendChild(buttonAgree.elmt);

			btnL += btnW + dvdrW;
			btnTxt = this.getResource("DEFAULT_COPYRIGHTEXITBUTTONTEXT");
			var buttonExit = new Z.Utils.Button("buttonExit", btnTxt, null, null, null, null, btnW + "px", btnH + "px", btnL + "px", btnT + "px", "mousedown", this.copyrightExitButtonHandler, "TIP_COPYRIGHTEXIT", "solid", "1px", btnColor, "0px", "0px");
			Z.CopyrightDisplay.appendChild(buttonExit.elmt);
		} else {
			var textBox = document.getElementById("textBox");

			// Option 1: Change text to remind user they have declined copyright agreement.
			var declinedText = textBox.childNodes[1].textContent;
			textBox.firstChild.firstChild.firstChild.firstChild.textContent = declinedText;

			// Option 2: remove text field. Combine this with code to leave page or other custom steps.
			// Z.CopyrightDisplay.removeChild(textBox);

			var buttonAgree = document.getElementById("buttonAgree");
			this.removeEventListener(buttonAgree, "mousedown", this.copyrightAgreeButtonHandler);
			Z.CopyrightDisplay.removeChild(buttonAgree);

			var buttonExit = document.getElementById("buttonExit");
			this.removeEventListener(buttonExit, "mousedown", this.copyrightExitButtonHandler);
			Z.CopyrightDisplay.removeChild(buttonExit);
		}
	},

	Button : function (id, label, graphicPath, graphicUp, graphicOver, graphicDown, w, h, x, y, btnEvnt, btnEvntHndlr, tooltipResource, borderStyle, borderWidth, background, margin, padding, cursor) {
		// Create button element.
		var button = Z.Utils.createContainerElement("span", id, "inline-block", "absolute", "hidden", w, h, x, y, borderStyle, borderWidth, background, margin, padding, cursor);

		if (!(Z.Utils.isStrVal(label))) {
			// Load images for each button state.
			graphicPath = Z.Utils.removeTrailingSlashCharacters(graphicPath);
			var imgUp = Z.Utils.createGraphicElement(graphicPath + "/" + graphicUp);
			var imgOver = Z.Utils.createGraphicElement(graphicPath + "/" + graphicOver);
			var imgDown = Z.Utils.createGraphicElement(graphicPath + "/" + graphicDown);

			// Create and store button image ids for easy access in event handlers.
			imgUp.id = button.id + "-imgUp";
			imgOver.id = button.id + "-imgOver";
			imgDown.id = button.id + "-imgDown";
			button._imgUpID = imgUp.id;
			button._imgOverID = imgOver.id;
			button._imgDownID = imgDown.id;

			// Size and position button images.
			var iuS = imgUp.style;
			var ioS = imgOver.style;
			var idS = imgDown.style;
			iuS.position = ioS.position = idS.position = "absolute";
			iuS.width = ioS.width = ioS.width =  w;
			iuS.height = ioS.height = ioS.height = h;
			iuS.top = ioS.top = idS.top = "0px";
			iuS.left = ioS.left = idS.left = "0px";
			if (Z.browser == Z.browsers.FIREFOX && Z.browserVersion < 3) { iuS.top = ioS.top = idS.top = ""; }

			// Set default button appearance to Up.
			//iuS.visibility = "visible"; // Commented because explicit visible setting here causes buttons to show initially in CSS layer even before revealed.
			ioS.visibility = "hidden";
			idS.visibility = "hidden";

			// Add images to button.
			button.appendChild(imgUp);
			button.appendChild(imgOver);
			button.appendChild(imgDown);

			// Prevent button dragging and copy menu. No need this after 'else' clause below
			// because label buttons have not icon images. Note that the approach
			//imgUp.oncontextmenu = Z.Utils.preventDefault; is ineffective on IE.
			Z.Utils.addEventListener(imgUp, "contextmenu", Z.Utils.preventDefault);
			Z.Utils.addEventListener(imgOver, "contextmenu", Z.Utils.preventDefault);
			Z.Utils.addEventListener(imgDown, "contextmenu", Z.Utils.preventDefault);
		} else {
			var textNode = document.createTextNode(label);
			button.appendChild(Z.Utils.createCenteredElement(textNode));
			Z.Utils.setTextStyle(textNode, "black", "verdana", "13px", "none", "normal", "normal", "normal", "normal", "1em", "center", "none");

			// Prevent text selection in button label. No need for this prior to 'else' because
			// standard buttons have no label.
			Z.Utils.disableTextInteraction(textNode);
			Z.Utils.addEventListener(button, "contextmenu", Z.Utils.preventDefault);
		}

		// Set tooltip visibility per optional parameter.
		if (Z.tooltipsVisible && Z.Utils.isStrVal(tooltipResource)) { button.title = Z.Utils.getResource(tooltipResource); }

		if (!Z.mobileDevice) {
		 	// Prevent button dragging and mouseover bubbling.
			Z.Utils.addEventListener(button, "mousedown", Z.Utils.preventDefault);
			Z.Utils.addEventListener(button, "mouseover", Z.Utils.stopPropagation);
			Z.Utils.addEventListener(button, "mouseout", Z.Utils.stopPropagation);

			// Set event handler and element reference.
			Z.Utils.addEventListener(button, btnEvnt, btnEvntHndlr);
		} else {
			// Set event handler - the handler must support mouse and touch contexts.
			Z.Utils.addEventListener(button, "touchstart", btnEvntHndlr);
		}

		this.elmt = button;
	},

	buttonSize : function (targetBtn, w, h) {
		var btnS = targetBtn.style;
		btnS.width = w + "px";
		btnS.height = h + "px";
		var iU = document.getElementById(targetBtn._imgUpID);
		var iO = document.getElementById(targetBtn._imgOverID);
		var iD = document.getElementById(targetBtn._imgDownID);
		if (iU && iO && iD) {
			var iuS = iU.style;
			var ioS = iO.style;
			var idS = iD.style;
			iuS.width = w + "px";
			iuS.height = h + "px";
			ioS.width = w + "px";
			ioS.height = h + "px";
			idS.width = w + "px";
			idS.height = h + "px";
		}
	},

	Graphic : function (id, graphicPath, graphic, w, h, x, y) {
		// Load image for graphic.
		graphicPath = Z.Utils.removeTrailingSlashCharacters(graphicPath);
		var graphicPathFull = (graphic) ? graphicPath + "/" + graphic : graphicPath;
		var img = Z.Utils.createGraphicElement(graphicPathFull);
		var igS = img.style;
		igS.width = w;
		igS.height = h;

		// Create graphic element and add image to it.
		var graphic = Z.Utils.createContainerElement("span", id, "inline-block", "absolute", "hidden", w, h, x, y, "none", "0px", "transparent none", "0px", "0px");
		graphic.appendChild(img);
		this.elmt = graphic;

		// Prevent graphic dragging and disable context menu.
		if (!Z.mobileDevice) {
			Z.Utils.addEventListener(img, "mousedown", Z.Utils.preventDefault);
		} else {
			Z.Utils.addEventListener(img, "touchstart", Z.Utils.preventDefault);
		}
		Z.Utils.addEventListener(img, "contextmenu", Z.Utils.preventDefault);
	},

	graphicSize : function (targetGphc, w, h) {
			var gS = targetGphc.style;
			gS.width = w + "px";
			gS.height = h + "px";
			var img = targetGphc.firstChild;
			var imgS = img.style;
			imgS.width = w + "px";
			imgS.height = h + "px";
	},

	copyrightAgreeButtonHandler : function (event) {
		Z.ViewerDisplay.removeChild(Z.CopyrightDisplay);
		document.cookie = 'imageCopyright=confirmed'
		Z.Viewer.configureViewer();
	},

	copyrightExitButtonHandler : function (event) {
		// Insert preferred alternative action here, for example return to site Terms Of Use page or homepage.
		Z.Utils.showCopyright(false);
		return;
	},

	addCrossBrowserPrototypes : function () {
		// Prototyping is used only to ensure legacy browser versions can support required functions,
		// and is otherwise avoided to limit potential conflicts in the event of code customization.

		if (!String.prototype.multiply) {
			String.prototype.multiply = (function () {
				var mJoin = Array.prototype.join, mObject = { };
				return function (n) {
					mObject.length = n + 1;
					return mJoin.call(mObject, this);
				}
			})();
		}

		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function (obj, fromIndex) {
				if (!fromIndex) {
					fromIndex = 0;
				} else if (fromIndex < 0) {
					fromIndex = Math.max(0, this.length + fromIndex);
				}
				for (var i = fromIndex, j = this.length; i < j; i++) {
					if (this[i] === obj)
					return i;
				}
				return -1;
			};
		}

		if (!Array.prototype.push) {
			Array.prototype.push = function ( obj ) {
				this[this.length ] = obj;
			}
		}

		if (!Array.prototype.splice) {

			Array.prototype.subarr = function ( iStart, iLength ) {
				if (iStart >= this.length || (iLength && iLength <= 0)) return [];
				else if (iStart < 0) {
					if (Math.abs(iStart) > this.length) iStart = 0;
					else iStart = this.length + iStart;
				}
				if (!iLength || iLength + iStart > this.length) iLength = this.length - iStart;
				var aReturn = [];
				for (var i = iStart; i < iStart + iLength; i++) {
					aReturn.push(this[i]);
				}
				return aReturn;
			}

			Array.prototype.subarray = function ( iIndexA, iIndexB ) {
				if (iIndexA < 0) iIndexA = 0;
				if (!iIndexB || iIndexB > this.length) iIndexB = this.length;
				if (iIndexA == iIndexB) return [];
				var aReturn = [];
				for (var i = iIndexA; i < iIndexB; i++) {
					aReturn.push(this[i]);
				}
				return aReturn;
			}

			Array.prototype.splice = function (iStart, iLength) {
				if (iLength < 0) iLength = 0;
				var aInsert = [];
				if (arguments.length > 2) {
					for (var i = 2, j = arguments.length; i < j; i++) {
						aInsert.push(arguments[i]);
					}
				}
				var aHead = this.subarray(0, iStart);
				var aDelete = this.subarr(iStart, iLength);
				var aTail = this.subarray(iStart + iLength);
				var aNew = aHead.concat(aInsert, aTail);
				this.length = 0;
				for (var i = 0, j = aNew.length; i < j; i++) {
					this.push(aNew[i]);
				}
				return aDelete;
			}
		}
	},

	addCrossBrowserMethods : function () {
		// Meta methods are used to ensure consistent functional support.  Specific browser
		// differences are managed within each event handler.
		if (document.addEventListener) {
			// W3C DOM 2 Events model

			this.disableTextInteraction = function (tN) {
				if (tN) {
					tnS = tN.parentNode.style;
					if (tnS) {
						tN.parentNode.unselectable = "on"; // For IE and Opera
						tnS.userSelect = "none";
						tnS.MozUserSelect = "none";
						tnS.webkitUserSelect = "none";
						tnS.webkitTouchCallout = "none";
						tnS.webkitTapHighlightColor = "transparent";
					}
				}
			};

			this.renderQuality = function (image, quality) {
				if (quality) {
					var rndrQuality = (quality == "high") ? "optimizeQuality" : "optimizeSpeed";
					image.style.setProperty ("image-rendering", rndrQuality, null);
				}
			};

			this.setOpacity = function (element, value, altColor) {
				if(Z.alphaSupported) {
					element.style.opacity=value;
				} else if (altColor) {
					element.style.backgroundColor = altColor;
				}
			};

		} else if (document.attachEvent) {
			// Internet Explorer Events model

			this.disableTextInteraction = function (tN) {
				if (tN) {
					tN.parentNode.unselectable = "on"; 
					tN.parentNode.onselectstart = function() { return false; };
				}
			};

			this.renderQuality = function (image, quality) {
				if (quality) {
					var rndrQuality = (quality == "high") ? "bicubic" : "nearest-neighbor";
					image.style.msInterpolationMode = rndrQuality;
				}
			};

			this.setOpacity = function (element, value, altColor) {
				if(Z.alphaSupported) {
					element.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=' + value + ')";
					element.style.filter = 'alpha(opacity=' + value + ')';
				} else if (altColor) {
					element.style.backgroundColor = altColor;
				}
			};
		}
	},

	addCrossBrowserEvents : function () {
		// Meta events model is used only to ensure consistent event listener methods.
		// Specific browser differences are managed within each event handler.
		if (document.addEventListener) {
			// W3C DOM 2 Events model

			this.addEventListener = function (target, eventName, handler) {
				if (eventName == "mousewheel") { elmt.addEventListener("DOMMouseScroll", handler, false); }
				target.addEventListener(eventName, handler, false);
			};

			this.removeEventListener = function (target, eventName, handler) {
				if (eventName == "mousewheel") { elmt.addEventListener("DOMMouseScroll", handler, false); }
				if (target) { target.removeEventListener(eventName, handler, false); }
			};

			this.event = function (event) {
				return event;
			};

			this.target =  function (event) {
				return event.target;
			};

			this.relatedTarget = function (event) {
				return event.relatedTarget;
			};

			this.isRightMouseButton = function (event) {
				var rightButton = false;
				if (event.which == 2 || event.which == 3) { rightButton = true; }
				return rightButton;
			};

			this.preventDefault = function (event) {
				event.preventDefault();
			};

			this.stopPropagation = function (event) {
				event.stopPropagation();
			};

		} else if (document.attachEvent) {
			// Internet Explorer Events model

			this.addEventListener = function (target, eventName, handler) {
				if (this._findListener(target, eventName, handler) != -1) return; // Prevent redundant listeners (DOM 2).
				var handler2 = function () {
					// IE version-specific listener (method of target, event object global)
					var event = window.event;
					if (Function.prototype.call) {
						handler.call(target, event);
					} else {
						target._currentListener = handler;
						target._currentListener(event)
						target._currentListener = null;
					}
				};
				target.attachEvent("on" + eventName, handler2);
				// Object supports cleanup
				var listenerRecord = {
					target: target,
					eventName: eventName,
					handler: handler,
					handler2: handler2
				};
				var targetDoc = target.document || target; // Get window object reference containing target.
				var targetWin = targetDoc.parentWindow;
				var listenerId = "l" + this._listenerCounter++; // Create unique ID
				if (!targetWin._allListeners) { targetWin._allListeners = {}; } // Record listener in window object.
				targetWin._allListeners[listenerId] = listenerRecord;
				if (!target._listeners) { target._listeners = []; } // Record listener ID in target.
				target._listeners[target._listeners.length] = listenerId;
				if (!targetWin._unloadListenerAdded) {
					targetWin._unloadListenerAdded = true;
					targetWin.attachEvent("onunload", this._removeAllListeners); // Ensure listener cleanup on unload.
				}
			};

			this.removeEventListener = function (target, eventName, handler) {
				if (target) {
					var listenerIndex = this._findListener(target, eventName, handler); // Verify listener added to target.
					if (listenerIndex == -1) { return; }
					var targetDoc = target.document || target; // Get window object reference containing target.
					var targetWin = targetDoc.parentWindow;
					var listenerId = target._listeners[listenerIndex]; // Get listener in window object.
					var listenerRecord = targetWin._allListeners[listenerId];
					target.detachEvent("on" + eventName, listenerRecord.handler2); // Remove listener. Remove ID from target.
					target._listeners.splice(listenerIndex, 1);
					delete targetWin._allListeners[listenerId]; // Remove listener record from window object.
				}
			};

			this.event = function (event) {
				return window.event;
			};

			this.target =  function (event) {
				return event.srcElement;
			};

			this.relatedTarget = function (event) {
				var relTarg = null;
				if (event.type == "mouseover") {
					relTarg = event.fromElement;
				} else if (event.type == "mouseout") {
					relTarg = event.toElement;
				}
				return relTarg;
			};

			this.isRightMouseButton = function (event) {
				var rightButton = false;
				if (event.button == 2) { rightButton = true; }
				return rightButton;
			};

			this.preventDefault = function (event) {
				if (event) { event.returnValue = false; }
			};

			this.stopPropagation = function (event) {
				event.cancelBubble = true;
			};

			this._findListener = function (target, eventName, handler) {
				var listeners = target._listeners; // Get array of listener IDs added to target.
				if (!listeners) { return -1; }
				var targetDoc = target.document || target; // Get window object reference containing target.
				var targetWin = targetDoc.parentWindow;
				for (var i = listeners.length - 1; i >= 0; i--) {
					// Find listener (backward search for faster onunload).
					var listenerId = listeners[i]; // Get listener's ID from target.
					var listenerRecord = targetWin._allListeners[listenerId]; // Get listener record from window object.
					// Compare eventName and handler with the retrieved record
					if (listenerRecord.eventName == eventName && listenerRecord.handler == handler) { return i; }
				}
				return -1;
			};

			this._removeAllListeners = function () {
				var targetWin = this;
				for (id in targetWin._allListeners) {
					var listenerRecord = targetWin._allListeners[id];
					listenerRecord.target.detachEvent("on" + listenerRecord.eventName, listenerRecord.handler2);
					delete targetWin._allListeners[id];
				}
			};

			this._listenerCounter = 0;
		}
	},

	detectBrowserInfo : function () {
		Z.browsers = { UNKNOWN: 0, IE: 1, FIREFOX: 2, SAFARI: 3, CHROME: 4, OPERA: 5 };
		var browser = Z.browsers.UNKNOWN;
		var browserVersion = 0;
		var app = navigator.appName;
		var ver = navigator.appVersion;
		var msInterpolationMode = false;
		var gwkRenderingMode = false;
		var ua = navigator.userAgent.toLowerCase();

		if (app == "Microsoft Internet Explorer" && !! window.attachEvent && !! window.ActiveXObject) {
			var ieOffset = ua.indexOf("msie");
			browser = Z.browsers.IE;
			browserVersion = parseFloat(ua.substring(ieOffset + 5, ua.indexOf(";", ieOffset)));
			msInterpolationMode = (typeof document.documentMode !== "undefined");
		} else if (app == "Netscape" && !! window.addEventListener) {
			var idxFF = ua.indexOf("firefox");
			var idxSA = ua.indexOf("safari");
			var idxCH = ua.indexOf("chrome");
			if (idxFF >= 0) {
				browser = Z.browsers.FIREFOX;
				browserVersion = parseFloat(ua.substring(idxFF + 8));
			} else if (idxSA >= 0) {
				var slash = ua.substring(0, idxSA).lastIndexOf("/");
				browser = (idxCH >= 0) ? Z.browsers.CHROME : Z.browsers.SAFARI;
				browserVersion = parseFloat(ua.substring(slash + 1, idxSA));
			}
			var testImage = new Image();
			if (testImage.style.getPropertyValue) { gwkRenderingMode = testImage.style.getPropertyValue ("image-rendering"); }
		} else if (app == "Opera" && !! window.opera && !! window.attachEvent) {
			browser = Z.browsers.OPERA;
			browserVersion = parseFloat(ver);
		}

		var docElmt = document.documentElement || {};
		var docElmtStyle = docElmt.style || {};
		var cssTransformsSupported = false;
		var cssTransformProperties = ["transform", "WebkitTransform", "MozTransform"];
		var cssTransformProperty;
		var cssTransformNoUnits;
		while (cssTransformProperty = cssTransformProperties.shift()) {
			if (typeof docElmtStyle[cssTransformProperty] !== "undefined") {
				cssTransformsSupported = true;
				cssTransformNoUnits = /webkit/i.test(cssTransformProperty);
				break;
			}
		}

		var canvasSupportPresent = ((document.createElement("canvas").getContext) && (document.createElement("canvas").getContext("2d")));
		var canvasSuppSubpix = !((browser == Z.browsers.SAFARI && browserVersion < 4) || (browser == Z.browsers.CHROME && browserVersion < 2));
		var canvasSupported = canvasSupportPresent && canvasSuppSubpix;
		var alphaSupported = !(browser == Z.browsers.IE || (browser == Z.browsers.CHROME && browserVersion < 2));
		var renderQuality = (msInterpolationMode || gwkRenderingMode) ? "high" : null;

		// Detect browsing on device without mouse and therefore withoug mouse-over state for toolbar show/hide feature.
		var mobileDevice = (ua.indexOf("android") > -1 || ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1 || ua.indexOf("ipod") > -1);

		Z.browser = browser;
		Z.browserVersion = browserVersion;
		Z.canvasSupported = canvasSupported;
		Z.useCanvas = Z.canvasSupported;  // Can be overridden by false zCanvas parameter.
		Z.cssTransformsSupported = cssTransformsSupported;
		Z.cssTransformProperty = cssTransformProperty;
		Z.cssTransformNoUnits = cssTransformNoUnits;
		Z.alphaSupported = alphaSupported;
		Z.renderQuality = renderQuality;
		Z.mobileDevice = mobileDevice;
	},

	isStrVal : function (value) {
		return (value != null && value != "");
	},

	getElementPosition : function (elmt) {
		var left = 0;
		var top = 0;
		var isFixed = this.getElementStyle(elmt).position == "fixed";
		var offsetParent = this.getOffsetParent(elmt, isFixed);
		while (offsetParent) {
			left += elmt.offsetLeft;
			top += elmt.offsetTop;
			if (isFixed) {
				var psPt = this.getPageScroll();
				left += psPt.x;
				top += psPt.y;
			}
			elmt = offsetParent;
			isFixed = this.getElementStyle(elmt).position == "fixed";
			offsetParent = this.getOffsetParent(elmt, isFixed);
		}
		return new this.Point(left, top);
	},

	getOffsetParent : function (elmt, isFixed) {
		if (isFixed && elmt != document.body) {
			return document.body;
		} else {
			return elmt.offsetParent;
		}
	},

	getElementSize : function (elmt) {
		return new this.Point(elmt.clientWidth, elmt.clientHeight);
	},

	getElementStyle : function (elmt) {
		if (elmt.currentStyle) {
			return elmt.currentStyle;
		} else if (window.getComputedStyle) {
			return window.getComputedStyle(elmt, "");
		} else {
			this.showMessage(this.getResource("ERROR_UNKNOWNELEMENTSTYLE"));
		}
	},

	getEventTargetCoords : function (event) {
		return getElementPosition(Z.Utils.target(event));
	},
	
	getFirstTouch : function (event) {
		var firstTouch = null; 
		var touches = event.touches;
		var changed = event.changedTouches;
		if (touches !== undefined) { 
			firstTouch = touches[0]; 
		} else if (changed !== undefined) {
			firstTouch = changed[0]; 		
		}
		return firstTouch;
	},

	getMousePosition : function (event) {
		var x = 0;
		var y = 0;
		if (event.type == "DOMMouseScroll" && browser == Browser.FIREFOX && browserVersion < 3) {
			x = event.screenX;
			y = event.screenY;
		} else if (typeof(event.pageX) == "number") {
			x = event.pageX;
			y = event.pageY;
		} else if (typeof(event.clientX) == "number") {
			x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		} else {
			this.showMessage(this.getResource("ERROR_UNKNOWNMOUSEPOSITION"));
		}
		return new this.Point(x, y);
	},

	getMouseScroll : function (event) {
		var delta = 0;
		if (typeof(event.wheelDelta) == "number") {
			delta = event.wheelDelta;
		} else if (typeof(event.detail) == "number") {
			delta = event.detail * -1;
		} else {
			this.showMessage(this.getResource("ERROR_UNKNOWNMOUSESCROLL"));
		}
		return delta ? delta / Math.abs(delta) : 0;
	},

	getPageScroll : function () {
		var x = 0;
		var y = 0;
		var docElmt = document.documentElement || {};
		var body = document.body || {};
		if (typeof(window.pageXOffset) == "number") {
			x = window.pageXOffset;
			y = window.pageYOffset;
		} else if (body.scrollLeft || body.scrollTop) {
			x = body.scrollLeft;
			y = body.scrollTop;
		} else if (docElmt.scrollLeft || docElmt.scrollTop) {
			x = docElmt.scrollLeft;
			y = docElmt.scrollTop;
		}
		return new this.Point(x, y);
	},

	getWindowSize : function () {
		var x = 0;
		var y = 0;
		var docElmt = document.documentElement || {};
		var body = document.body || {};
		if (typeof(window.innerWidth) == 'number') {
			x = window.innerWidth;
			y = window.innerHeight;
		} else if (docElmt.clientWidth || docElmt.clientHeight) {
			x = docElmt.clientWidth;
			y = docElmt.clientHeight;
		} else if (body.clientWidth || body.clientHeight) {
			x = body.clientWidth;
			y = body.clientHeight;
		} else {
			this.showMessage(this.getResource("ERROR_UNKNOWNWINDOWSIZE"));
		}
		return new this.Point(x, y);
	},

	nodeIsInViewer : function (nodeToTest) {
		var isInViewer = false;
		var ancestor = nodeToTest;
		while (isInViewer == false) {
			if (ancestor) {
				if (ancestor.id) {
					if (ancestor.id == "ViewerDisplay") {
						isInViewer = true;
					} else {
						ancestor = ancestor.parentNode;
					}
				} else {
					ancestor = ancestor.parentNode;
				}
			} else {
				break;
			}
		}
		return isInViewer;
	},

	readCookie : function (name) {
		var nameEq = name + "=";
		var nameValuePairs = document.cookie.split(';');
		for (var i = 0;i < nameValuePairs.length;i++) {
			var nvP = nameValuePairs[i];
			while (nvP.charAt(0) == ' ') { nvP = nvP.substring(1,nvP.length); }
			if (nvP.indexOf(nameEq) == 0) { return nvP.substring(nameEq.length,nvP.length); }
		}
		return null;
	},

	removeTrailingSlashCharacters : function (stringToClean) {
		var stringCleaned = (stringToClean.slice(-1, stringToClean.length) == '/') ? stringToClean.slice(0, stringToClean.length-1) : stringToClean;
		// Next line removed to allow for leading slash signifying root context.
		//stringCleaned = (stringToClean.slice(0, 1) == '/') ? stringToClean.slice(1, stringToClean.length) : stringToClean;
		return stringCleaned;
	},		
	
	cacheProofPath : function (url) {
		// Apply to support setImagePath feature, non-caching implementations, and to avoid IE problem leading to correct image with wrong dimensions. (DEV NOTE: Formerly limited to Z.browser == Z.browsers.IE)
		url += "?noCacheSfx=" + new Date().getTime().toString();
		return url;
	},

	easing : function (t, b, c, d) {
		// Key: t=current time, b=start value, c=total span, d=duration (quintic transition)
		if ((t /= d / 2) < 1) {
			return c / 2 * t * t * t * t * t + b;
		} else {
			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
		}
	},

	parseParameters : function (paramsString) {
		var parsedParams;
		if (paramsString) { parsedParams = paramsString.split('&'); }
		return parsedParams;
	},

	setParameters : function (params) { 
		var paramsEnableTest = this.getResource("DEFAULT_PARAMETERSENABLETEST");
		var paramsDisableValue = this.getResource("DEFAULT_PARAMETERSDISABLEVALUE");
		var paramsDisabledAlert = this.getResource("DEFAULT_PARAMETERSDISABLEDALERT");
		
		var pffsEnableTest = this.getResource("DEFAULT_PFFSUPPORTENABLETEST");
		var pffsDisableValue = this.getResource("DEFAULT_PFFSUPPORTDISABLEVALUE");
		var pffsDisabledAlert = this.getResource("DEFAULT_PFFSUPPORTDISABLEDALERT");
		var pffsEnabled = (pffsEnableTest != pffsDisableValue) ? true : false;

		Z.skinPath = this.getResource("DEFAULT_SKINXMLPATH");
		Z.skinMode = this.getResource("DEFAULT_SKINMODE");
		if (!isNaN(parseFloat(this.getResource("DEFAULT_INITIALX")))) { Z.initialX = parseFloat(this.getResource("DEFAULT_INITIALX")); }
		if (!isNaN(parseFloat(this.getResource("DEFAULT_INITIALY")))) { Z.initialY = parseFloat(this.getResource("DEFAULT_INITIALY")); }
		if (!isNaN(parseFloat(this.getResource("DEFAULT_INITIALZOOM")))) { Z.initialZ = parseFloat(this.getResource("DEFAULT_INITIALZOOM")); }
		if (!isNaN(parseFloat(this.getResource("DEFAULT_MINZOOM")))) { Z.minZ = parseFloat(this.getResource("DEFAULT_MINZOOM")); }
		if (!isNaN(parseFloat(this.getResource("DEFAULT_MAXZOOM")))) { Z.maxZ = parseFloat(this.getResource("DEFAULT_MAXZOOM")); }
		if (!isNaN(parseFloat(this.getResource("DEFAULT_ZOOMSPEED")))) { Z.zoomSpeed = parseFloat(this.getResource("DEFAULT_ZOOMSPEED")); }
		if (!isNaN(parseFloat(this.getResource("DEFAULT_PANSPEED")))) { Z.panSpeed = parseFloat(this.getResource("DEFAULT_PANSPEED")); }
		if (!isNaN(parseFloat(this.getResource("DEFAULT_FADEINSPEED")))) { Z.fadeInSpeed = parseFloat(this.getResource("DEFAULT_FADEINSPEED")); }
		Z.toolbarVisible = parseInt(this.getResource("DEFAULT_TOOLBARVISIBLE"), 10);
		Z.toolbarPosition = parseFloat(this.getResource("DEFAULT_TOOLBARPOSITION"));
		Z.tooltipsVisible = (this.getResource("DEFAULT_TOOLTIPSVISIBLE") != "0");
		Z.navigatorVisible = parseInt(this.getResource("DEFAULT_NAVIGATORVISIBLE"), 10);
		Z.navigatorW = parseInt(this.getResource("DEFAULT_NAVIGATORWIDTH"), 10);
		Z.navigatorH = parseInt(this.getResource("DEFAULT_NAVIGATORHEIGHT"), 10);
		Z.navigatorL = parseInt(this.getResource("DEFAULT_NAVIGATORLEFT"), 10);
		Z.navigatorT = parseInt(this.getResource("DEFAULT_NAVIGATORTOP"), 10);
		Z.navigatorFit = this.getResource("DEFAULT_NAVIGATORFIT");
		Z.clickZoom = (this.getResource("DEFAULT_CLICKZOOM") != "0");
		Z.clickPan = (this.getResource("DEFAULT_CLICKPAN") != "0");
		Z.mousePan = (this.getResource("DEFAULT_MOUSEPAN") != "0");
		Z.keys = (this.getResource("DEFAULT_KEYS") != "0");
		Z.constrainPan = (this.getResource("DEFAULT_CONSTRAINPAN") != "0");
		Z.sliderVisible = (this.getResource("DEFAULT_SLIDERVISIBLE") != "0");
		Z.fullPageVisible = (this.getResource("DEFAULT_FULLPAGEVISIBLE") != "0");
		Z.fullPageInit = (this.getResource("DEFAULT_FULLPAGEINIT") != "0");
		Z.progressVisible = (this.getResource("DEFAULT_PROGRESSVISIBLE") != "0");
		Z.logoVisible = (this.getResource("DEFAULT_LOGOVISIBLE") != "0");
		Z.logoCustomPath = this.getResource("DEFAULT_LOGOCUSTOMPATH");
		Z.canvas = (this.getResource("DEFAULT_CANVAS") != "0");
		Z.debug = (this.getResource("DEFAULT_DEBUG") != "0");

		if (this.isStrVal(params)) {
			for (var i = 0, j = params.length; i < j; i++) {
				var nameValuePair = params[i];
				var sep = nameValuePair.indexOf('=');
				if (sep > 0) {
					var pName = nameValuePair.substring(0, sep)
					var pValue = nameValuePair.substring(sep + 1)
					if (this.isStrVal(pValue)) {
						switch (pName) {
							case "zInitialX" : // Default is null (centered).
								if (!isNaN(parseFloat(pValue))) { Z.initialX = parseFloat(pValue); }
								break;
							case "zInitialY" : // Default is null (centered).
								if (!isNaN(parseFloat(pValue))) { Z.initialY = parseFloat(pValue); }
								break;
							case "zInitialZoom" : // 1 to 100 recommended range (internally 0.1 to 1), default is null (zoom-to-fit view area).
								if (!isNaN(parseFloat(pValue))) {
									Z.initialZ = parseFloat(pValue);
									if (Z.initialZ) { Z.initialZ /= 100; }
								}
								break;
							case "zMinZoom" : // 1 to 100 recommended range (internally 0.1 to 1), default is null (zoom-to-fit view area).
								if (!isNaN(parseFloat(pValue)) && parseFloat(pValue) > 0.01) {
									Z.minZ = parseFloat(pValue);
									if (Z.minZ) { Z.minZ /= 100; }
								}
								break;
							case "zMaxZoom" : // 1 to 100 recommended range (internally 0.1 to 1), default is null (zoom-to-fit view area).
								if (!isNaN(parseFloat(pValue))) {
									Z.maxZ = parseFloat(pValue);
									if (Z.maxZ) { Z.maxZ /= 100; }
								}
								break;							
							case "zNavigatorVisible" :  // 0=hide, 1=show, -1=show/hide (default), -2=hide/show.
								Z.navigatorVisible = parseInt(pValue, 10);
								break;
							case "zToolbarVisible" :  // 0=hide, 1=show, -1=show/hide (default), -2=hide/show.
								Z.toolbarVisible = parseInt(pValue, 10);
								break;
							case "zLogoVisible" :  // 0=hide, 1=show (default).
								if (pValue == "0") { Z.logoVisible = false; }
								break;
							case "zSliderVisible" :  // 0=false, 1=true (default).
								if (pValue == "0") { Z.sliderVisible = false; }
								break;
							case "zFullPageVisible" :  // 0=false, 1=true (default).
								if (pValue == "0") { Z.fullPageVisible = false; }
								break;
							case "zFullPageInit" :  // 0=false, 1=true (default).
								if (pValue == "1") { Z.fullPageInit = true; }
								break;
							case "zProgressVisible" :  // 0=false, 1=true (default).
								if (pValue == "0") { Z.progressVisible = false; }
								break;
							case "zTooltipsVisible" :  // 0=hide, 1=show (default).
								if (pValue == "0") { Z.tooltipsVisible = false; }
								break;			
							case "zSkinPath" :
								Z.skinPath = pValue;
								break;
							default :
								if (paramsEnableTest == paramsDisableValue) {
									alert(paramsDisabledAlert + " " +pName);
								} else {
									switch (pName) {
										case "zZoomSpeed" : // 1=slow to 10=fast, default is 5.
											Z.zoomSpeed = parseInt(pValue, 10);
											break;
										case "zPanSpeed" :  // 1=slow to 10=fast, default is 5.
											Z.panSpeed = parseInt(pValue, 10);
											break;
										case "zFadeInSpeed" : // 1=slow to 10=fast, default is 5, 0 = no fade-in.
											Z.fadeInSpeed = parseInt(pValue, 10);
											break;
										case "zToolbarPosition" :  // 0=top, 1=bottom (default).
											Z.toolbarPosition = parseInt(pValue, 10);
											break;
										case "zNavigatorWidth" : // Size in pixels, default is 150, useful max is thumbnail width.
											if (!isNaN(parseFloat(pValue))) { Z.navigatorW = parseFloat(pValue); }
											break;
										case "zNavigatorHeight" : // Size in pixels, default is 150, useful max is thumbnail height.
											if (!isNaN(parseFloat(pValue))) { Z.navigatorH = parseFloat(pValue); }
											break;
										case "zNavigatorLeft" : // Position in pixels, default is 0.
											if (!isNaN(parseFloat(pValue))) { Z.navigatorL = parseFloat(pValue); }
											break;
										case "zNavigatorTop" : // Position in pixels, default is 0.
											if (!isNaN(parseFloat(pValue))) { Z.navigatorT = parseFloat(pValue); }
											break;
										case "zNavigatorFit" :  // 0= fit to viewer (default), 1= fit to image.
											if (!isNaN(parseFloat(pValue))) { Z.navigatorFit = parseInt(pValue, 10); }
											break;
										case "2" :  // 0=disable, 1=enable (default).
											if (pValue == "0") { Z.clickZoom = false; }
											break;
										case "zClickPan" :  // 0=disable, 1=enable (default).
											if (pValue == "0") { Z.clickPan = false; }
											break;
										case "zMousePan" :  // 0=disable, 1=enable (default).
											if (pValue == "0") { Z.mousePan = false; }
											break;
										case "zKeys" :  // 0=disable, 1=enable (default).
											if (pValue == "0") { Z.keys = false; }
											break;
										case "zConstrainPan" :  // 0=false, 1=true.
											if (pValue == "0") { Z.constrainPan = false; }
											break;
										case "zCopyrightPath" :
											Z.copyrightPath = pValue;
											break;
										case "zWatermarkPath" :
											Z.watermarkPath = pValue;
											break;
										case "zLogoCustomPath" :
											Z.logoCustomPath = pValue;
											break;
										case "zCanvas" :  // 0=false, 1=true (default).
											if (pValue == "0") { Z.canvas = false; }
											// Use canvas if supported by browser and not disabled by parameter.
											if (!Z.canvasSupported || !Z.canvas) { Z.useCanvas = false; }
											break;
										case "zDebug" :  // 0=disable (default), 1=enable.
											if (pValue == "1") { Z.debug = true; }
											break;
										case "zServerIP" :
											Z.serverIP = pValue;
											break;
										case "zServerPort" :
											Z.serverPort = pValue;
											break;
										case "zTileHandlerPath" :
											Z.tileHandlerPath = pValue;
											break;	
									}
								
								}
								break;
						}
					}
				}
			}
		}
		if (!Z.Utils.isStrVal(Z.tileHandlerPath)) {
			Z.tileSource = "ZoomifyImageFolder";
		} else if (Z.imagePath.toLowerCase().indexOf(".pff") != -1) {
			if (pffsEnabled) {
				Z.tileSource = "ZoomifyImageFile";

				// Build full tile handler path.
				var tHPF = Z.tileHandlerPath;

				// DEV NOTE: JavaScript cross-domain block conflicts with specifying server IP and port.
				//if (tHPF.substr(0,1) != "/") { tHPF = "/" + tHPF; }
				//2:17 PM 1/13/2012if (Z.serverPort != "80") { tHPF = ":" + Z.serverPort + tHPF; }
				//tHPF = Z.serverIP + tHPF;

				Z.tileHandlerPathFull = tHPF;
			} else {
				alert(pffsDisabledAlert); 
			}
		} else {
			Z.tileSource = "OtherTileSource";
		}
	},

	removeDups : function (arr) {
		// This function requires a sorted array.
		for (var i = 1;i < arr.length;) {
			if (arr[i-1] == arr[i]) {
				arr.splice(i, 1);
			} else{
				i++;
			}
		}
		return arr;
	},

	intersect : function (a1, a2) {
		// This function requires sorted arrays, each without duplicate values.
		var a3 = [];
		for (var i = 0; i < a1.length; i++) {
			var elmt1 = a1[i];
			var found = false;
			for (var j=0; (j < a2.length) && (elmt1 >= (elmt2 = a2[j])); j++) {
				if (elmt2 == elmt1) {
					found = true;
					break;
				}
			}
			if (found) { a3.push(a1[i]); }
		}
		return a3;
	},

	subtract : function (a1, a2) {
		// This function requires sorted arrays, each without duplicate values.
		for (var i = 0; i < a1.length; i++) {
			var elmt1 = a1[i];
			var found = false;
			for (var j = 0; (j < a2.length) && (elmt1 >= (elmt2 = a2[j])); j++) {
				if (elmt2 == elmt1) {
					found = true;
					break;
				}
			}
			if (found) { a1.splice(i--,1); }
		}
		return a1;
	},

	createCallback : function (object, method) {
		var initialArgs = [];
		for (var i = 2, j = arguments.length; i < j; i++) {
			initialArgs.push(arguments[i]);
		}
		return function () {
			var args = initialArgs.concat([]);
			for (var i = 0, j = arguments.length; i < j; i++) {
				args.push(arguments[i]);
			}
			return method.apply(object, args);
		};
	},

	showMessage : function (messageText) {
		alert(messageText);
	},

	createContainerElement : function (tagName, id, display, position, overflow, width, height, left, top, borderStyle, borderWidth, background, margin, padding, cursor) {
		var emptyContainer = document.createElement(tagName);
		if (this.isStrVal(id)) { emptyContainer.id = id; }
		var ecS = emptyContainer.style;
		ecS.display = (this.isStrVal(display)) ? display : "inline-block";
 		ecS.position = (this.isStrVal(position)) ? position : "static";
 		ecS.overflow = (this.isStrVal(overflow)) ? overflow : "hidden";
 		if (tagName == "canvas") {
 			if (this.isStrVal(width)) { emptyContainer.setAttribute('width', width); }
 			if (this.isStrVal(height)) { emptyContainer.setAttribute('height', height); }
 		} else {
 			if (this.isStrVal(width)) { ecS.width = width; }
 			if (this.isStrVal(height && height)) { ecS.height = height; }
 		}
 		if (this.isStrVal(left)) { ecS.left = left; }
 		if (this.isStrVal(top)) { ecS.top = top; }
 		ecS.borderStyle = (this.isStrVal(borderStyle)) ? borderStyle : "none";
 		ecS.borderWidth = (this.isStrVal(borderWidth)) ? borderWidth : "0px";
 		ecS.background = (this.isStrVal(background)) ? background : "transparent none";
 		ecS.margin = (this.isStrVal(margin)) ? margin : "0px";
 		ecS.padding = (this.isStrVal(padding)) ? padding : "0px";
 		if (this.isStrVal(cursor)) { ecS.cursor = cursor; } // No explicit default assignment.
		return emptyContainer;
	},

	createCenteredElement : function (elmt) {
		var div = this.createContainerElement("div");
		var html = [];
		html.push('<div style="display:table; height:100%; width:100%;');
		html.push('border:none; margin:0px; padding:0px;');
		html.push('#position:relative; overflow:hidden; text-align:left;">');
		html.push('<div style="#position:absolute; #top:50%; width:100%; ');
		html.push('border:none; margin:0px; padding:0px;');
		html.push('display:table-cell; vertical-align:middle;">');
		html.push('<div style="#position:relative; #top:-50%; width:100%; ');
		html.push('border:none; margin:0px; padding:0px;');
		html.push('text-align:center;"></div></div></div>');
		div.innerHTML = html.join('');
		div = div.firstChild;
		var innerDiv = div;
		var innerDivs = div.getElementsByTagName("div");
		while (innerDivs.length > 0) {
			innerDiv = innerDivs[0];
			innerDivs = innerDiv.getElementsByTagName("div");
		}
		innerDiv.appendChild(elmt);
		return div;
	},

	createGraphicElement : function (imageSrc) {
		var gImg = this.createContainerElement("img");
		var gElmt = null;
		if (Z.browser == Z.browsers.IE && Z.browserVersion < 7) {
			gElmt = this.createContainerElement("span", null, "inline-block");
			gImg.onload = function () {
				gElmt.style.width = gElmt.style.width || gImg.width + "px";
				gElmt.style.height = gElmt.style.height || gImg.height + "px";
				gImg.onload = null;
				gImg = null;
			};
			gElmt.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + imageSrc + "', sizingMethod='scale')";
		} else {
			gElmt = gImg;
			gElmt.src = imageSrc;
		}
		return gElmt;
	},

	setTextStyle : function (textNode, color, fontFamily, fontSize, fontSizeAdjust, fontStyle, fontStretch, fontVariant, fontWeight, lineHeight, textAlign, textDecoration) {
		var textStyle = textNode.parentNode.style;
		textStyle.color = color;
		textStyle.fontFamily = fontFamily;
		textStyle.fontSize = fontSize;
		textStyle.fontSizeAdjust = fontSizeAdjust;
		textStyle.fontStyle = fontStyle;
		textStyle.fontStretch = fontStretch;
		textStyle.fontVariant = fontVariant;
		textStyle.fontWeight = fontWeight;
		textStyle.lineHeight = lineHeight;
		textStyle.textAlign = textAlign;
		textStyle.textDecoration = textDecoration;
	},

	convertXMLTextToXMLDoc : function (xmlText) {
		var xmlDoc = null;
		if (window.ActiveXObject) {
			try {
				xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async = false;
				xmlDoc.loadXML(xmlText);
			} catch (e) {
				this.showMessage(e.name + this.getResource("ERROR_CONVERTINGXMLTEXTTODOC") + e.message);
			}
		} else if (window.DOMParser) {
			try {
				var parser = new DOMParser();
				xmlDoc = parser.parseFromString(xmlText, "text/xml");
			} catch (e) {
				this.showMessage(e.name + this.getResource("ERROR_CONVERTINGXMLTEXTTODOC") + e.message);
			}
		} else {
			this.showMessage(this.getResource("ERROR_XMLDOMUNSUPPORTED"));
		}
		return xmlDoc;
	},

	Point : function (x, y) {
		this.x = typeof(x) == "number" ? x : 0;
		this.y = typeof(y) == "number" ? y : 0;
	},

	Point3D : function (x, y, z) {
		this.x = typeof(x) == "number" ? x : 0;
		this.y = typeof(y) == "number" ? y : 0;
		this.z = typeof(z) == "number" ? z : 0;
	},

	getResource : function (resName) {
		// Access default values, constants, and localizable strings (tooltips, messages, errors).
		var resTxt = "";
		switch(resName) {
			case "DEFAULT_PARAMETERSENABLETEST" :
				// Use "Enable Developer parameters" to enable Developer parameter support and value of DEFAULT_PARAMETERSDISABLEVALUE to disable.
				resTxt = "Enable Developer parameters";
				//resTxt = "Changing This Violates License Agreement";
				break;
			case "DEFAULT_PARAMETERSDISABLEVALUE" :
				resTxt = "Changing This Violates License Agreement";
				break;
			case "DEFAULT_PARAMETERSDISABLEDALERT" :
				resTxt = "Support for this parameter is enabled only in the Zoomify Image Viewer included in the Zoomify HTML5 Developer edition: ";
				break;	
				
			case "DEFAULT_PFFSUPPORTENABLETEST" :
				// Use "Enable PFF support" to enable Enterprise PFF support and value of DEFAULT_PFFSUPPORTDISABLEVALUE to disable.
				//resTxt = "Enable PFF support"; 
				resTxt = "Changing This Violates License Agreement";
				break;
			case "DEFAULT_PFFSUPPORTDISABLEVALUE" :
				resTxt = "Changing This Violates License Agreement";
				break;
			case "DEFAULT_PFFSUPPORTDISABLEDALERT" :
				resTxt = "Support for PFF single file storage is enabled only in the Zoomify Image Viewer included in the Zoomify Enterprise products.";
				break;	

			case "DEFAULT_IMAGESLOADINGMAX" :
				resTxt = "100";
				break;
			case "DEFAULT_TILEIMAGELOADTIMEOUT" :
				resTxt = "30000";
				break;
			case "DEFAULT_TIERSMAXSCALEUP" :
				resTxt = "1.15";
				break;
			case "DEFAULT_TILESMAXCACHE" :
				resTxt = "300";
				break;
			case "DEFAULT_BACKFILLTHRESHOLD2" :
				resTxt = "6";
				break;
			case "DEFAULT_BACKFILLTHRESHOLD1" :
				resTxt = "3";
				break;
			case "DEFAULT_BACKFILLCHOICE2" :
				resTxt = "3";
				break;
			case "DEFAULT_BACKFILLCHOICE1" :
				resTxt = "2";
				break;
			case "DEFAULT_BACKFILLCHOICE0" :
				resTxt = "0";
				break;
			case "DEFAULT_PANBUFFER" :
				resTxt = "2";
				break;
			case "DEFAULT_PANSPEED" :
				resTxt = "5"; // 1=slow to 10=fast, default is 5.
				break;
			case "DEFAULT_PANSTEP" :
				resTxt = "10"; // 10 * 5 = 50 pixel step per 0.1 second interval.
				break;
			case "DEFAULT_ZOOMSPEED" :
				resTxt = "5"; // 1=slow to 10=fast, default is 5.
				break;
			case "DEFAULT_ZOOMSTEP" :
				resTxt = "0.02"; // 0.02 * 5 = .1 percent step default.
				break;
			case "DEFAULT_ZOOMANDPANSTEPDURATION" :
				resTxt = "30";  // Milliseconds.
				break;
			case "DEFAULT_ZOOMANDPANTOVIEWDURATION" :
				resTxt = "200";  // Milliseconds.
				break;
			case "DEFAULT_ZOOMANDPANTOVIEWSTEPDURATION" :
				resTxt = "10";  // Milliseconds.
				break;
			case "DEFAULT_CLICKZOOMTIERSKIPTHRESHOLD" :
				resTxt = "01.";  // % of zoom delta from exact next/prior tier.
				break;
			case "DEFAULT_GESTURETESTDURATION" :
				resTxt = "10";  // Milliseconds.
				break;	
			case "DEFAULT_FADEINSPEED" :
				resTxt = "5"; // 1=slow to 10=fast, default is 5. 
				break;
			case "DEFAULT_FADEINSTEP" :
				resTxt = "0.067"; // 0.067 * default fade in speed of 5 = 0.335 x 3 steps to get over 1, at 50 milliseconds per step = 0.2 seconds to fade-in.
				break;
			case "DEFAULT_TOOLBARVISIBLE" : 
				resTxt = "4";  // "0"=hide, "1"=show, "2"=show/hide (default), "3"=hide/show, "4" & "5"=same as 2 and 3 but minimize rather than hiding. Note: minimize forced if setting is 2 or 3 and browser is on mobile device (no mouse-over).
				break;
			case "DEFAULT_TOOLBARPOSITION" :
				resTxt = "1"; // 0=top, 1=bottom (default).
				break;
			case "DEFAULT_TOOLTIPSVISIBLE" :
				resTxt = "1"; // 0=false, 1=true (default).
				break;
			case "DEFAULT_NAVIGATORVISIBLE" :  
				resTxt = "2";  // "0"=hide, "1"=show, "2"=show/hide (default), "3"=hide/show, "4" & "5"=same as 2 and 3 but minimize rather than hiding. Note: minimize forced if setting is 2 or 3 and browser is on mobile device (no mouse-over).
				break;
			case "DEFAULT_NAVIGATORWIDTH" :
				resTxt = "150";
				break;
			case "DEFAULT_NAVIGATORHEIGHT" :
				resTxt = "100";
				break;
			case "DEFAULT_NAVIGATORLEFT" :
				resTxt = "0";
				break;
			case "DEFAULT_NAVIGATORTOP" :
				resTxt = "0";
				break;
			case "DEFAULT_NAVIGATORFIT" :
				resTxt = null;
				break;
			case "DEFAULT_NAVIGATORBACKCOLOR" :
				resTxt = "#ffffff";
				break;
			case "DEFAULT_NAVIGATORBACKCOLORNOALPHA" :
				resTxt = "#fbfafa";
				break;
			case "DEFAULT_NAVIGATORBACKALPHA" :
				resTxt = "0.75";
				break;
			case "DEFAULT_NAVIGATORRECTANGLECOLOR" :
				resTxt = "blue";
				break;
			case "DEFAULT_SKINXMLFILE" :
				resTxt = "skinFiles.xml"; 
				break;
			case "DEFAULT_SKINXMLPATH" :
				resTxt = "Assets/Skins/Default";
				break;				
			case "DEFAULT_SKINMODE" :
				resTxt = "0"; // 0=autoswitch if mobile device (default), 1=always standard, 2= always large.
				break;
			case "DEFAULT_CONSTRAINPAN" :
				resTxt = "1"; // "0"=false, "1"=true (default).
				break;
			case "DEFAULT_SLIDERVISIBLE" :
				resTxt = "1"; // "0"=false, "1"=true (default).
				break;
			case "DEFAULT_SLIDERTESTDURATION" :
				resTxt = "10";  // Milliseconds.
				break;	
			case "DEFAULT_FULLPAGEVISIBLE" :
				resTxt = "1"; // "0"=false, "1"=true (default).
				break;	
			case "DEFAULT_FULLPAGEINIT" :
				resTxt = "0"; // "0"=false (default), "1"=true.
				break;				
			case "DEFAULT_FULLPAGEBACKCOLOR" :
				resTxt = "white";
				break;
			case "DEFAULT_FPCANCELBUTTONTEXT" :
				resTxt = "X";
				break;
			case "DEFAULT_FPCANCELBUTTONCOLOR" :
				resTxt = "	#F8F8F8"; // Very light grey.
				break;
			case "DEFAULT_PROGRESSVISIBLE" :
				resTxt = "1"; // "0"=false, "1"=true (default).
				break;
			case "DEFAULT_PROGRESSDURATION" :
				resTxt = "500";  // Milliseconds.
				break;
			case "DEFAULT_PROGRESSTEXT" :
				resTxt = " ";  // Blank.
				break;
			case "DEFAULT_LOGOVISIBLE" :
				resTxt = "1"; // "0"=false, "1"=true (default).
				break;
			case "DEFAULT_LOGOCUSTOMPATH" :
				resTxt = null;
				break;
			case "DEFAULT_CANVAS" :  // "0"=false, "1"=true.
				resTxt = "1";
				break;
			case "DEFAULT_DEBUG" :  // "0"=disable, "1"=enable.
				resTxt = "0";
				break;
			case "DEFAULT_COPYRIGHTSCREENCOLOR" :
				resTxt = "lightgray";
				break;
			case "DEFAULT_COPYRIGHTBUTTONCOLOR" :
				resTxt = "white";
				break;
			case "DEFAULT_COPYRIGHTAGREEBUTTONTEXT" :
				resTxt = "Agree";
				break;
			case "DEFAULT_COPYRIGHTEXITBUTTONTEXT" :
				resTxt = "Exit";
				break;
			case "DEFAULT_WATERMARKALPHA" :
				resTxt = "0.6";
				break;
			case "DEFAULT_WATERMARKMINSCALE" :
				resTxt = "0.33";
				break;
			case "DEFAULT_WATERMARKSPANW" :
				resTxt = "512"; // Horizontal image pixels per watermark.
				break;
			case "DEFAULT_WATERMARKSPANH" :
				resTxt = "384"; // Vertical image pixels per watermark.
				break;
			case "DEFAULT_INITIALX" :
				resTxt = null;
				break;
			case "DEFAULT_INITIALY" :
				resTxt = null;
				break;
			case "DEFAULT_INITIALZOOM" :			
				resTxt = null; // 1 to 100 recommended range**, default is null (zoom-to-fit view area).
				break;
			case "DEFAULT_MINZOOM" :
				resTxt = null; // 1 to 100 recommended range**, default is null (zoom-to-fit view area).
				break;
			case "DEFAULT_MAXZOOM" :
				resTxt = "1"; // 1 to 100 recommended range**, default is null (zoom-to-fit view area).
				break;
			case "DEFAULT_CLICKZOOM" :
				resTxt = "1"; // "0"=disable, "1"=enable (default).
				break;
			case "DEFAULT_CLICKPAN" :
				resTxt = "1"; // "0"=disable, "1"=enable (default).
				break;
			case "DEFAULT_MOUSEPAN" :
				resTxt = "1"; // "0"=disable, "1"=enable (default).
				break;
			case "DEFAULT_KEYS" :
				resTxt = "1"; // "0"=disable, "1"=enable (default).
				break;
			case "DEFAULT_TRACEDISPLAYDEBUGINFOTEXT" :
				resTxt = "This panel is enabled using the HTML parameter 'zDebug=1'. " +
				"It can be called as follows:\n\n   Z.Utils.trace('value to display');  \n\nThe " +
				"buttons below display or modify important state values.  Web designers " +
				"new to JavaScript will also benefit from the console, trace, profiling, and " +
				"other debugging features of leading browsers.";
				break;
			case "DEFAULT_TRACEDISPLAYSCREENCOLOR" :
				resTxt = "lightgray";
				break;
			case "DEFAULT_TRACEDISPLAYBUTTONCOLOR" :
				resTxt = "white";
				break;
			case "DEFAULT_TRACEDISPLAYSHOWGLOBALSBUTTONTEXT" :
				resTxt = "Show Globals";
				break;
			case "DEFAULT_TRACEDISPLAYTOGGLEDISPLAYBUTTONTEXT" :
				resTxt = "Toggle Display";
				break;
			case "DEFAULT_TRACEDISPLAYTOGGLEBACKFILLBUTTONTEXT" :
				resTxt = "Toggle Backfill";
				break;
			case "DEFAULT_TRACEDISPLAYTOGGLECONSTRAINPANBUTTONTEXT" :
				resTxt = "Toggle Constrain Pan";
				break;
			case "ERROR_XMLHTTPREQUESTUNSUPPORTED" :
				resTxt = "Browser does not support XMLHttpRequest."
				break;
			case "ERROR_MAKINGNETWORKREQUEST-IMAGEXML" :
				resTxt = "Error loading image: please make sure image path in web page matches image folder location on webserver.";
				break;
			case "ERROR_MAKINGNETWORKREQUEST-IMAGEHEADER" :
				resTxt = "Error loading image: image header request invalid.";
				break;
			case "ERROR_MAKINGNETWORKREQUEST-IMAGEOFFSET" :
				resTxt = "Error loading image: image offset request invalid.";
				break;				
			case "ERROR_MAKINGNETWORKREQUEST-TOOLBARXML" :
				resTxt = "Error loading toolbar: please verify skin files are on webserver in same folder as ZoomifyImageViewer.js file and are in default folder structure 'Assets/Skins/Default', or add zSkinPath parameter to webpage.";
				break;
			case "ERROR_MAKINGNETWORKREQUEST" :
				resTxt = "Error making network request: possible invalid path or network error.";
				break;
			case "ERROR_IMAGEPATHINVALID" :
				resTxt = "Image failed to load: possible invalid path, missing image, or network error."
				break;
			case "ERROR_NETWORKSECURITY" :
				resTxt = "Error related to network security: ";
				break;
			case "ERROR_NETWORKSTATUS" :
				resTxt = "Error related to network status: ";
				break;
			case "ERROR_CONVERTINGXMLTEXTTODOC" :
				resTxt = " converting XML text to XML doc (DOMParser): ";
				break;
			case "ERROR_XMLDOMUNSUPPORTED" :
				resTxt = "Browser does not support XML DOM.";
				break;
			case "ERROR_XMLDOCINVALID" :
				resTxt =  "XML Doc invalid.";
				break;
			case "ERROR_XMLINVALID" :
				resTxt =  "XML invalid.";
				break;
			case "ERROR_IMAGEXMLINVALID" :
				resTxt =  "Image XML invalid.";
				break;
			case "ERROR_EXECUTINGCALLBACK" :
				resTxt = " while executing callback: "
				break;
			case "ERROR_IMAGEREQUESTTIMEDOUT" :
				resTxt = "Image timed out: "
				break;
			case "ERROR_NAVIGATORIMAGEPATHINVALID" :
				resTxt = "Navigator image failed to load: possible invalid path, missing image, or network error."
				break;
			case "ERROR_SKINXMLINVALID" :
				resTxt =  "Skin XML invalid.";
				break;
			case "ERROR_SKINXMLMISSINGNAMES" :
				resTxt =  "The skin XML file has one or more faulty name lines.";
				break;
			case "ERROR_WATERMARKPATHINVALID" :
				resTxt =  "Watermark image failed to load: ";
				break;
			case "ERROR_UNKNOWNELEMENTSTYLE" :
				resTxt =  "Unknown element style - no known method to identify.";
				break;
			case "ERROR_UNKNOWNMOUSEPOSITION" :
				resTxt =  "Unknown mouse position - no known method to calculate.";
				break;
			case "ERROR_UNKNOWNMOUSESCROLL" :
				resTxt =  "Unknown mouse scroll - no known method to calculate.";
				break;
			case "ERROR_UNKNOWNWINDOWSIZE" :
				resTxt =  "Unknown window size - no known method to calculate.";
				break;
			case "TIP_LOGO" :
				resTxt =  "Launch Zoomify Website";
				break;
			case "TIP_MINIMIZE" :
				resTxt =  "Minimize Toolbar";
				break;
			case "TIP_EXPAND" :
				resTxt =  "Expand Toolbar";
				break;
			case "TIP_ZOOMOUT" :
				resTxt =  "Zoom Out";
				break;
			case "TIP_SLIDER" :
				resTxt =  "Zoom In And Out";
				break;
			case "TIP_ZOOMIN" :
				resTxt =  "Zoom In";
				break;
			case "TIP_PANLEFT" :
				resTxt =  "Pan Left";
				break;
			case "TIP_PANUP" :
				resTxt =  "Pan Up";
				break;
			case "TIP_PANDOWN" :
				resTxt =  "Pan Down";
				break;
			case "TIP_PANRIGHT" :
				resTxt =  "Pan Right";
				break;
			case "TIP_RESET" :
				resTxt =  "Reset Initial View";
				break;
			case "TIP_TOGGLEFULLPAGE" :
				resTxt =  "Toggle Full Page View";
				break;
			case "TIP_CANCELFULLPAGE" :
				resTxt =  "Cancel Full Page View";
				break;
			case "TIP_COPYRIGHTAGREE" :
				resTxt =  "Agree to copyright and view images";
				break;
			case "TIP_COPYRIGHTEXIT" :
				resTxt =  "Exit and do not view images";
				break;
			case "TIP_SHOWGLOBALS" :
				resTxt =  "Toggle Full Page View";
				break;
			case "TIP_TOGGLEDISPLAY" :
				resTxt =  "Toggle Viewport Display";
				break;
			case "TIP_TOGGLEBACKFILL" :
				resTxt =  "Toggle Viewport Backfill";
				break;
			case "TIP_TOGGLECONSTRAINPAN" :
				resTxt =  "Toggle Constrain Pan";
				break;
			default:
				resTxt = "Unexpected resource request";
		}
		return resTxt;
	},

	showGlobals : function () {
		// Debugging option combines global variables as a single string and displays their current values.
		var gVs = "";
		gVs += "\n";
		gVs += "                            ZOOMIFY IMAGE VIEWER - CURRENT VALUES" + "\n";
		gVs += "\n";
		gVs += "IMAGE & SKIN" + ":    ";
		gVs += "Z.imagePath=" + Z.imagePath + ",   ";
		gVs += "Z.skinPath=" + Z.skinPath + ",   ";
		gVs += "Z.skinMode=" + Z.skinMode + ",   ";
		gVs += "Z.imageW=" + Z.imageW + ",   ";
		gVs += "Z.imageH=" + Z.imageH + ",   ";
		gVs += "tierCount=" + Z.Viewport.getTierCount() + ",   ";
		gVs += "TILE_SIZE=" + Z.Viewport.getTileSize() + "\n";	
		gVs += "\n";
		gVs += "PAGE & BROWSER" + ":    ";
		gVs += "Z.pageContainer=" + Z.pageContainer + ",   ";
		gVs += "Z.browser=" + Z.browser + ",   ";
		gVs += "Z.browserVersion=" + Z.browserVersion + ",   ";
		gVs += "Z.canvasSupported=" + Z.canvasSupported + ",   ";
		gVs += "Z.cssTransformsSupported=" + Z.cssTransformsSupported + ",   ";
		gVs += "Z.cssTransformProperty=" + Z.cssTransformProperty + ",   ";
		gVs += "Z.cssTransformNoUnits=" + Z.cssTransformNoUnits + ",   ";
		gVs += "Z.alphaSupported=" + Z.alphaSupported + ",   ";
		gVs += "Z.renderQuality=" + Z.renderQuality + ",   ";
		gVs += "Z.mobileDevice=" + Z.mobileDevice + "\n";
		gVs += "\n";
		gVs += "VIEWER OPTIONS & DEFAULTS" + ":    ";
		gVs += "Z.initialX=" + Z.initialX + ",   ";
		gVs += "Z.initialY=" + Z.initialY + ",   ";
		gVs += "Z.initialZ=" + Z.initialZ + ",   ";
		gVs += "Z.minZ=" + Z.minZ + ",   ";
		gVs += "Z.maxZ=" + Z.maxZ + ",   ";
		gVs += "Z.fitZ=" + Z.fitZ + ",   ";
		gVs += "Z.zoomSpeed=" + Z.zoomSpeed + ",   ";
		gVs += "Z.panSpeed=" + Z.panSpeed + ",   ";
		gVs += "Z.fadeInSpeed=" + Z.fadeInSpeed + ",   "; 
		gVs += "Z.toolbarVisible=" + Z.toolbarVisible + ",   ";
		gVs += "Z.toolbarW=" + Z.toolbarW + ",   ";
		gVs += "Z.toolbarCurrentW=" + Z.toolbarCurrentW + ",   ";
		gVs += "Z.toolbarH=" + Z.toolbarH + ",   ";
		gVs += "Z.toolbarPosition=" + Z.toolbarPosition + ",   ";
		gVs += "Z.tooltipsVisible=" + Z.tooltipsVisible + ",   ";
		gVs += "Z.navigatorVisible=" + Z.navigatorVisible + ",   ";
		gVs += "Z.navigatorW=" + Z.navigatorW + ",   ";
		gVs += "Z.navigatorH=" + Z.navigatorH + ",   ";
		gVs += "Z.navigatorL=" + Z.navigatorL + ",   ";
		gVs += "Z.navigatorT=" + Z.navigatorT + ",   ";
		gVs += "Z.navigatorFit=" + Z.navigatorFit + ",   ";
		gVs += "Z.clickZoom=" + Z.clickZoom + ",   ";
		gVs += "Z.clickPan=" + Z.clickPan + ",   ";
		gVs += "Z.mousePan=" + Z.mousePan + ",   ";
		gVs += "Z.keys=" + Z.keys + ",   ";
		gVs += "Z.constrainPan=" + Z.constrainPan + ",   ";
		gVs += "Watermark alpha = " + Z.Utils.getResource("DEFAULT_WATERMARKALPHA") + ",   ";
		gVs += "Z.watermarkPath=" + Z.watermarkPath + ",   ";
		gVs += "Z.copyrightPath=" + Z.copyrightPath + ",   ";
		gVs += "Z.sliderVisible=" + Z.sliderVisible + ",   ";
		gVs += "Z.fullPageVisible=" + Z.fullPageVisible + ",   ";
		gVs += "Z.fullPageInit=" + Z.fullPageInit + ",   ";			
		gVs += "Z.progressVisible=" + Z.progressVisible + ",   ";
		gVs += "Z.logoVisible=" + Z.logoVisible + ",   ";
		gVs += "Z.logoCustomPath=" + Z.logoCustomPath + ",   ";
		gVs += "Z.canvas=" + Z.canvas + ",   ";
		gVs += "Z.serverIP=" + Z.serverIP + ",   ";
		gVs += "Z.serverPort=" + Z.serverPort + ",   ";
		gVs += "Z.tileHandlerPath=" + Z.tileHandlerPath + ",   ";
		gVs += "Z.tileHandlerPathFull=" + Z.tileHandlerPathFull + ",   ";
		gVs += "Z.tileSource=" + Z.tileSource + "\n";
		gVs += "\n";
		gVs += "INTERNAL VALUES" + ":    ";
		gVs += "\n";
		gVs += "displayW=" + Z.Viewport.getW() + ",   ";
		gVs += "displayH=" + Z.Viewport.getH() + ",   ";
		gVs += "tierCurrent=" + Z.Viewport.getTierCurrent() + ",   ";
		gVs += "tierScale=" + Z.Viewport.getTierScale() + ",   ";
		gVs += "TIERS_MAX_SCALE_UP=" + Z.Viewport.getTiersMaxScaleUp() + ",   ";
		gVs += "TIERS_MAX_SCALE_DOWN=" + Z.Viewport.getTiersMaxScaleDown() + ",   ";
		gVs += "TILES_MAX_CACHE=" + Z.Viewport.getTilesMaxCache() + ",   ";
		gVs += "Z.useCanvas=" + Z.useCanvas + "\n";
		gVs += "\n";
		gVs += "INTERNAL LISTS" + ":    ";
		gVs += "tierWs=" + Z.Viewport.getTierWs() + ",   ";
		gVs += "tierHs=" + Z.Viewport.getTierHs() + ",   ";
		gVs += "tierTileCounts=" + Z.Viewport.getTierTileCounts() + ",   ";
		gVs += "tilesLoadingNames=" + Z.Viewport.getTilesLoadingNames() + "\n";
		gVs += "\n";
		alert(gVs);
	},

	showTraces : function () {
		// Debugging option displays cummulative list of trace values.
		if (!Z.TraceDisplay) {
			Z.Utils.configureTraceDisplay();
		} else if (Z.TraceDisplay.display == "inline-block") {
			Z.TraceDisplay.display = "none"
		} else {
			Z.TraceDisplay.display = "inline-block"
		}
	},

	configureTraceDisplay : function () {
		var tdW = Z.viewerW / 3;
		var tdH = Z.viewerH / 3 + 45;
		var tdL = 10;
		var tdT = parseFloat(Z.viewerH) / 3;
		var scrnColor = this.getResource("DEFAULT_TRACEDISPLAYSCREENCOLOR");
		Z.TraceDisplay = this.createContainerElement("div", "TraceDisplay", "inline-block", "absolute", "hidden", tdW + "px", tdH+ "px", tdL + "px", tdT + "px", "solid", "1px", scrnColor, "0px", "10px");
		Z.ViewerDisplay.appendChild(Z.TraceDisplay);

		Z.traces = document.createElement('TEXTAREA');
		var trdS = Z.traces.style;
		trdS.width = (tdW - 15) + "px";
		trdS.height = (tdH - 60) + "px";
		trdS.fontFamily = "verdana";
		trdS.fontSize = "10px";
		trdS.border = "solid";
		trdS.borderWidth = "1px";
		trdS.padding = "5px";
		trdS.resize = "none";
		Z.traces.value = "Trace Values" + "\n";
		Z.TraceDisplay.appendChild(Z.traces);

		var btnW = 58;
		var btnH = 42;
		var btnL = 20;
		var btnT = tdH - (btnH / 2) - 10;
		var btnSpan = 10;
		var btnColor = this.getResource("DEFAULT_TRACEDISPLAYBUTTONCOLOR");

		var btnTxt = this.getResource("DEFAULT_TRACEDISPLAYSHOWGLOBALSBUTTONTEXT");
		var buttonShowGlobals = new this.Button("buttonShowGlobals", btnTxt, null, null, null, null, btnW + "px", btnH + "px", btnL + "px", btnT + "px", "mousedown", this.showGlobals, "TIP_SHOWGLOBALS", "solid", "1px", btnColor, "0px", "0px");
		Z.TraceDisplay.appendChild(buttonShowGlobals.elmt);

		btnL += btnW + btnSpan;
		var btnTxt = this.getResource("DEFAULT_TRACEDISPLAYTOGGLEDISPLAYBUTTONTEXT");
		var buttonToggleDisplay = new this.Button("buttonToggleDisplay", btnTxt, null, null, null, null, btnW + "px", btnH + "px", btnL + "px", btnT + "px", "mousedown", Z.Viewport.toggleDisplay, "TIP_TOGGLEDISPLAY", "solid", "1px", btnColor, "0px", "0px");
		Z.TraceDisplay.appendChild(buttonToggleDisplay.elmt);

		btnL += btnW + btnSpan;
		var btnTxt = this.getResource("DEFAULT_TRACEDISPLAYTOGGLEBACKFILLBUTTONTEXT");
		var buttonToggleBackfill = new this.Button("buttonToggleBackfill", btnTxt, null, null, null, null, btnW + "px", btnH + "px", btnL + "px", btnT + "px", "mousedown", Z.Viewport.toggleBackfill, "TIP_TOGGLEBACKFILL", "solid", "1px", btnColor, "0px", "0px");
		Z.TraceDisplay.appendChild(buttonToggleBackfill.elmt);

		btnL += btnW + btnSpan;
		btnW += 12;
		var btnTxt = this.getResource("DEFAULT_TRACEDISPLAYTOGGLECONSTRAINPANBUTTONTEXT");
		var buttonToggleConstrainPan = new this.Button("buttonToggleConstrainPan", btnTxt, null, null, null, null, btnW + "px", btnH + "px", btnL + "px", btnT + "px", "mousedown", Z.Viewport.toggleConstrainPan, "TIP_TOGGLECONSTRAINPAN", "solid", "1px", btnColor, "0px", "0px");
		Z.TraceDisplay.appendChild(buttonToggleConstrainPan.elmt);
	},

	trace : function (text) {
		if (!Z.TraceDisplay) { Z.Utils.configureTraceDisplay(); }
		if (Z.traces) { Z.traces.value += "\n" + text + "\n"; }
	}
};




