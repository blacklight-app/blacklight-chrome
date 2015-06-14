var script = document.createElement('script');
//script.src = 'http://code.jquery.com/jquery-1.11.0.min.js';
script.src = 'jquery-2.1.4.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

var cursorX;
var cursorY;

/*
 * Pre-release version, version code 0001
 * 
 * This variable is stored on the server to keep track of different releases,
 * Change this when 
 */
var VERSION_CODE = "0001"; 
 
function onClickHandler(info, tab) {

    if (info.menuItemId === "leaveComment") {
        console.log(gPos);
        //checkCursor();
//        console.log(this.pageY);
        var commentText = window.prompt("Enter Comment","");
        var pageUrl = info.pageUrl;
        console.log(info);
//    cursorX = e.pageX;
//    cursorY = e.pageY;
        //alert(commentText);
        if (commentText != "") {
            $.ajax({
                url: 'http://www.blacklight-app.com/blb/submit.php',
                type: 'post',
                data: 'commentUrl='+pageUrl+'&commentText='+commentText+'&commentUsername=none&clientVersion='+VERSION_CODE,
                success: function(output) 
                {
                    alert("Server Says: "+output);
                }, error: function()
                {
                    alert('something went wrong, submit failed');
                }
            });
        }

        //alert(returnVal);
    } //else {
        console.log("item " + info.menuItemId + " was clicked");
        console.log("info: " + JSON.stringify(info));
        console.log("tab: " + JSON.stringify(tab));
    //}
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

//chrome.contextMenus.onClicked.addListener(getMousePosition(this));

// Set up context menu tree at install time//
chrome.runtime.onInstalled.addListener(function() {
  // Create one test item for each context type.
    var contexts = ["page","selection","link","editable","image","video",
                  "audio"];
    
//  for (var i = 0; i < contexts.length; i++) {
//    var context = contexts[i];
//    var title = "Test '" + context + "' menu item";
//    var id = chrome.contextMenus.create({"title": title, "contexts":[context],
//                                         "id": "context" + context});
//    console.log("'" + context + "' item:" + id);
//  }
//  
  
    chrome.contextMenus.create({"title":"Leave Comment", "id": "leaveComment", "contexts":contexts});
//    cursorX = this.pageX;
//    cursorY = this.pageY;
});
//
//document.onmousemove = function(e){
//    console.log("mouse update");
//    cursorX = e.pageX;
//    cursorY = e.pageY;
//};
//chrome.addEventListener('contextmenu', function(ev) {
//    //ev.preventDefault();
//    cursorX = ev.pageX;
//    cursorY = ev.pageY;
//    alert('success!');
//    return false;
//}, false);
//setInterval("checkCursor()", 1000);
//function checkCursor(){
//    console.log("Cursor at: " + cursorX + ", " + cursorY);
//}
//function getMousePosition(event) {
//    console.log("mouse update");
//    cursorX = event.pageX;
//    cursorY = event.pageY;    
//}


//when mouse up, send message to background.js with this position
document.addEventListener('mouseup', function (mousePos) {
    if (mousePos.button == 2) {
        var p = {clientX: mousePos.clientX, clientY: mousePos.clientY};
        var msg = {text: 'example', point: p, from: 'mouseup'};
        console.log(msg);
        //chrome.runtime.sendMessage(msg, function(response) {});
    }
});

//global var for store cursor position
var gPos = null;

//receiving message
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
if (msg.from == 'mouseup') {
    //storing position
    gPos = msg.point;
}
});

// onclick callback function.
function OnClick(info, tab, text, mousePos) {
    if (info.menuItemId == idConsole) {
        if (gPos != null) {
            alert('Position X: ' + gPos.clientX + '\nPosition Y: ' + gPos.clientY );
            //console.log('Position X: ' + gPos.clientX + '\nPosition Y: ' + gPos.clientY );
        }
    }
}

//on click sample callback with more params
var idConsole = chrome.contextMenus.create({
    title: 'Cursor Position',
    contexts: ["selection"],
    onclick: function(info, tab) {
        OnClick(info, tab, '%s', gPos);
        }
});