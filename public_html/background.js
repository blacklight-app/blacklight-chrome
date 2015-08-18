var script = document.createElement('script');
//script.src = 'http://code.jquery.com/jquery-1.11.0.min.js';
script.src = 'jquery-2.1.4.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

//'use strict';

/*
 * Pre-release version, version code 0001
 * 
 * This variable is stored on the server to keep track of different releases,
 * Change this when 
 */
var VERSION_CODE = "0001"; 
var username = "Carter";
/*
 * gPos stores the coordinates whenever the mouse is right clicked, has 4 variables within:
 *  clientX: Horizontal coordinate of the comment in pixels
 *  clientY: Veritcal coordinate of the comment in pixels
 *  clientHeight: Total Horizontal length of the page in pixels
 *  clientWidth: Total Vertical length of the page in pixels
 */
var gPos = null;

/*
 * Send comment to server
 */

function onClickHandler(info, tab) {

    if (info.menuItemId === "leaveComment" && gPos != null) {
        
        var commentText = window.prompt("Enter Comment","");
        var pageUrl = info.pageUrl;
        console.log(info);
        console.log('Position X: ' + gPos.clientX + 'px of ' + gPos.clientWidth + '\nPosition Y: ' + gPos.clientY + 'px of ' + gPos.clientHeight);
        if (commentText != "") {
            $.ajax({
                url: 'http://www.blacklight-app.com/blb/submit.php',
                type: 'post',
                data: 'commentUrl='+pageUrl+'&commentText='+commentText+'&commentUsername='+username+'&clientVersion='+VERSION_CODE
                        +'&clientX='+gPos.clientX+'&clientY='+gPos.clientY+'&clientHeight='+gPos.clientHeight+'&clientWidth='+gPos.clientWidth,
                success: function(output) 
                {
                    alert("Server Says: "+output);
                }, error: function()
                {
                    alert('something went wrong, submit failed');
                }
            });
        }  
    } else if (info.menuItemId === "leaveComment" && gPos == null) {
        console.log("gPos is null");
    }
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

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
    

});



/*
 * Mouse Coordinates stuff
 */

//receiving message from c.js on every click
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
if (msg.from == 'mouseup') {
    //storing position
    gPos = msg.point;
}
})

// onclick callback function.
//function OnClick(info, tab, text, mousePos) {
//    if (info.menuItemId == idConsole) {
//        if (gPos != null) {
//            alert('Position X: ' + gPos.pageX + '\nPosition Y: ' + gPos.pageY );
//            //console.log('Position X: ' + gPos.clientX + '\nPosition Y: ' + gPos.clientY );
//            gPos = null;
//        } else {
//            alert('gpos is null');
//        }
//    }
//}

    //on click sample callback with more params
//var idConsole = chrome.contextMenus.create({
//    title: 'Cursor Position',
//    contexts: ["selection"],
//    onclick: function(info, tab) {
//        OnClick(info, tab, '%s', gPos);
//        }
//})
