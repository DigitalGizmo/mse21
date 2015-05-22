// --------------- prevent multiple audios on lecture  ----------------
// http://stackoverflow.com/questions/19790506/multiple-audio-html-auto-stop-other-when-current-is-playing-with-javascript
document.addEventListener('play', function(e){
    var audios = document.getElementsByTagName('audio');
    for(var i = 0, len = audios.length; i < len;i++){
        if(audios[i] != e.target){
            audios[i].pause();
        }
    }
}, true);

// --------------- zoom  ----------------
	
function zoom_view(resourceType, shortName, pageSuffix) {
    var theURL = "/" + resourceType + "/zoom/" + shortName + "/" + pageSuffix + "/";
    var zoomWin = window.open(theURL,'zoom','scrollbars=yes,resizable=yes,width=600,height=600,location=yes');
	zoomWin.focus();
}

// experimental print slim box
function divPrint(divName) {
	var DocumentContainer = document.getElementById(divName);
	
	
	var WindowObject = window.open("", "PrintWindow",
	"width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");

	// var virtualPage = '<html><head><link rel="stylesheet" href="/model/common/slimpop.css" type="text/css" media="screen"/><link rel="stylesheet" href="/model/common/olc_printstyle.css" type="text/css" media="print" /></head><body>' + DocumentContainer.innerHTML + '</body></html> ';

	var virtualPage = '<html><head><style media="screen" type="text/css"> body {font-family: "Arial Narrow", Arial, sans-serif; font-size: 1em; line-height: 1.5em; padding: 2em;}  h1, h2, h3, h4 {color:#B23F05;} p.close {display: none;} dt {font-weight: bold; margin-top: 1em; }</style><style media="print" type="text/css"> body {color: black; font-family: "Arial Narrow", Arial, sans-serif; font-size: 1em; line-height: 1.5em; padding: 2em;} p.close {display: none;} dt {font-weight: bold; margin-top: 1em;}</style></head><body>' + DocumentContainer.innerHTML + '</body></html> ';

	// WindowObject.document.writeln(DocumentContainer.innerHTML);
	// alert('page: ' + virtualPage);
	
	WindowObject.document.writeln(virtualPage);
	
	WindowObject.document.close();
	WindowObject.focus();
	WindowObject.print();
	WindowObject.close();
}