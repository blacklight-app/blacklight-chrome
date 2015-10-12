/* 
 * The contents of this file are subject to the Common Public Attribution 
 * License Version 1.0 (the “License"); you may not use this file except in 
 * compliance with the License. You may obtain a copy of the License at 
 * https://github.com/blacklight-app/blacklight-chrome/blob/master/public_html/LICENSE
 * The License is based on the Mozilla Public License Version 1.1 but 
 * Sections 14 and 15 have been added to cover use of software over a computer 
 * network and provide for limited attribution for the Original Developer. 
 * In addition, Exhibit A has been modified to be consistent with Exhibit B.
 * 
 * Software distributed under the License is distributed on an “AS IS‿ basis, 
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for 
 * the specific language governing rights and limitations under the License.
 * 
 * The Original Code is blacklight.
 * 
 * The Original Developer is the Initial Developer.
 * 
 * The Initial Developer of the Original Code is Carter Fulford. 
 * 
 * All portions of the code written by blacklight are Copyright (c) 2015. 
 * All Rights Reserved.
 */


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
 * Change this on every release and make note in changelog
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
    var contexts = ["page","selection","link","editable","image","video","audio"];
  
    chrome.contextMenus.create({"title":"Post via BlackLight", "id": "leaveComment", "contexts":contexts});
    

});



/*
 * Mouse Coordinates stuff
 */

//receiving message from contentScript.js on every click
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
if (msg.from == 'mouseup') {
    //storing position in global variable
    gPos = msg.point;
}
})
