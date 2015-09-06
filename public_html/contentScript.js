/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//'use strict';
//when mouse up, send message to background.js with this position
document.addEventListener('mouseup', function (mousePos) {
    if (mousePos.button == 2) {
        var clientWidth = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        var clientHeight = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
    
        var p = {
                    clientX: mousePos.clientX,                                  // Horizontal coordinate of the comment in pixels
                    clientY: mousePos.clientY,                                  // Veritcal coordinate of the comment in pixels
                    clientHeight: clientHeight,                                 // Total Horizontal length of the page in pixels
                    clientWidth: clientWidth                                    // Total Vertical length of the page in pixels
                };
        var msg = {text: 'example', point: p, from: 'mouseup'};
        chrome.runtime.sendMessage(msg, function(response) {});
    }
})

/*
 * Recieved messages:
 */
    /*
     * Global variable so that the overylay is only generated once
     */
    var msgsShown = false;
    
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

    if (msg.action == 'show_comment' && msgsShown == false) {
        dimPage();
        msgsShown = true;
        
        console.log(JSON.stringify(msg));
        msg.comments.forEach(function(entry) {
            console.log("COMMENT is " + JSON.stringify(entry));
            createComment(entry);
            
        });
    } else if (msgsShown = true) {
        $("#__msg_overlay").show();
    }
  
});

function dimPage() {
    var zIndex = findHighestZIndex() + 10;
    
    $('<div id="__msg_overlay">').css({
      "width" : "100%"
    , "height" : "100%"
    , "background" : "#000"
    , "position" : "fixed"
    , "top" : "0"
    , "left" : "0"
    , "zIndex" : zIndex
    , "MsFilter" : "progid:DXImageTransform.Microsoft.Alpha(Opacity=60)"
    , "filter" : "alpha(opacity=60)"
    , "MozOpacity" : 0.6
    , "KhtmlOpacity" : 0.6
    , "opacity" : 0.6

    }).appendTo(document.body);
    
    /*
     * Create button to close overlay
     */
    $('<div id="__close_msg_overlay">&times;</div>').appendTo(document.body);
    $("#__close_msg_overlay").click(function() {
        //$("#__close_msg_overlay").hide();
        $("#__msg_overlay").hide();
    });
    $("#__close_msg_overlay").css({
          "width" : "20px"
        , "height" : "20px"
        , "position" : "fixed"
        , "top" : "0"
        , "right" : "0"
        , "zIndex" : zIndex + 1
        , "color" : "#FFFFFF"
        , "display" : "block"
        , "font-size" : "1.875em"
        
    })
}

/*
 * Determines the highest z-index for the current webpage
 * 
 */

function findHighestZIndex()
{
  var elems = document.getElementsByTagName('*');
  var highest = 0;
  for (var i = 0; i < elems.length; i++)
  {
    var zindex=document.defaultView.getComputedStyle(elems[i],null).getPropertyValue("z-index");
    if ((zindex > highest) && (zindex != 'auto'))
    {
      highest = zindex;
    }
  }
  return highest;
}

/*
 * functions for making the comment
 */
function createComment(comment) {
    var zIndex = findHighestZIndex() + 15;
    //console.log
    $("#__msg_overlay").append('<div id="commentCon">');
    $("#commentCon").css({
                    "width" : "50px"
                  , "height" : "50px"
                  , "background" : "#4183D7"
                  , "position" : "fixed"
                  , "top" : "80px"
                  , "left" : "80px"
                  , "zIndex" : zIndex
                  , "opacity" : 1.0
            });

}
function getCommentX(comment){
    var clientWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

    return Math.round(clientWidth * comment["xPositionRatio"]);
}

function getCommentY(comment){
    var clientHeight = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;

    return Math.round(clientHeight * comment["yPositionRatio"]);
}

/*
 * comment js from lucas' stuff
 * 
 * jquery for modifing the up/downvote
 */
//$(document).ready(function(){
//    $('#minus').click(function(){
//        $(this).toggleClass("down");
////        $('#plus').toggleClass("up");
//    });
//});
//
//$(document).ready(function(){
//    $('#plus').click(function(){
//        $(this).toggleClass("down");
//    });
//});