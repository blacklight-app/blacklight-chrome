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
var blacklightServer = "https://blacklight.larence.xyz";
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
        addCommentAnimations();
    } else if (msgsShown = true) {
        $("#__blmsg_overlay").show();
    }
  
});

function dimPage() {
    var zIndex = findHighestZIndex() + 10;
    
    $('<div id="__blmsg_overlay">').css({
      "width" : "100%"
    , "height" : "100%"
    , "background" : "#000"
    , "position" : "absolute"
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
    $('<div id="__blclose_msg_overlay">&times;</div>').appendTo($("#__blmsg_overlay"));
    $("#__blclose_msg_overlay").click(function() {
        //Hide overlay and all comments
        $("#__blmsg_overlay").hide();
        $("div.blcommentContainer").hide();
        
    });
    $("#__blclose_msg_overlay").css({
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
    
    // Create the comment container
    $('<div id="blCommentContainer' + comment.ID + '" class="blcommentContainer" >').appendTo(document.body);
    
    var commentContainer = $("#blCommentContainer" + comment.ID)
    commentContainer.append('<div class="blLcomment">');
        commentContainer.children("div.blLcomment").append('<div class="blPlus">');
        
        commentContainer.children("div.blLcomment").append('<div class="blCommentPoints"><div class="blCommentPointsInner">' + comment.points + '</div></div>');
   
        commentContainer.children("div.blLcomment").append('<div class="blMinus">');
        
        //add downvote onclick function
        commentContainer.children("div.blLcomment").children("div.blMinus").click(function () {
            var upVoteBtn = $("#blCommentContainer" + comment.ID).children("div.blLcomment").children("div.blPlus");
            
            if (!$(this).hasClass("selected"))  {
                upVoteBtn.removeClass("selected");
                downVoteComment(comment.ID);
                $(this).addClass("selected");
            }
        });
        //add upvote onclick function
        commentContainer.children("div.blLcomment").children("div.blPlus").click(function () {
            var downVoteBtn = $("#blCommentContainer" + comment.ID).children("div.blLcomment").children("div.blMinus");
            
            if (!$(this).hasClass("selected"))  {
                downVoteBtn.removeClass("selected");
                upVoteComment(comment.ID);
                $(this).addClass("selected");
            }
        });
        
    commentContainer.append('<table class="blRComment">');
        commentContainer.children("table.blRComment").append('<tr class="blRCommentR1"><td class="blCommentName">' + comment.username + '</td><td class="blDate">' + comment.dateSubmitted + '</td></tr>');
   
        commentContainer.children("table.blRComment").append('<tr class="blRCommentR2"><td class="blCommentContent" colspan="2">"' + comment.comment + '"</td></tr>');
            
    
    //set the css for the position and zIndex
    commentContainer.css({
                    "top" : getCommentY(comment)
                  , "left" : getCommentX(comment)
                  , "zIndex" : zIndex
                  , "opacity" : 1.0
            });
}

/*
 * Idea: vote tokens
 *      to ensure legitimacy  of votes, a hash is received  in the comment object
 *      that must be sent back for a vote to work. this hash could come from the
 *      comment ID and a secret salt stored in the session variables on the server
 *      a new one would be generated upon each login
 */

function upVoteComment(ID) {
    //console.log("This is where the upvote request would be sent for comment " + ID);
    $.post(blacklightServer+"/extension/extensionAPI.php", {request: "voteComment", vote: "plus", commentID: ID}, function(data, status) {
                        //console.log(data);
                        var responseObj = JSON.parse(data);
                        //console.log(responseObj);
                        if (responseObj.success == true){
                            var currentPts = $("#blCommentContainer" + ID).children("div.blLcomment").children('div.blCommentPoints').children('div.blCommentPointsInner').text();
                            $("#blCommentContainer" + ID).children("div.blLcomment").children('div.blCommentPoints').children('div.blCommentPointsInner').html(parseInt(currentPts) + 1);
                        }
                    });
}
function downVoteComment(ID) {
    //console.log("This is where the downvote request would be sent for comment " + ID);
    $.post(blacklightServer+"/extension/extensionAPI.php", {request: "voteComment", vote: "minus", commentID: ID}, function(data, status) {
                    //console.log(data);
                    var responseObj = JSON.parse(data);
                    //console.log(responseObj);
                    if (responseObj.success == true){
                        var currentPts = $("#blCommentContainer" + ID).children("div.blLcomment").children('div.blCommentPoints').children('div.blCommentPointsInner').text();
                        $("#blCommentContainer" + ID).children("div.blLcomment").children('div.blCommentPoints').children('div.blCommentPointsInner').html(parseInt(currentPts) - 1);
                    }
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

