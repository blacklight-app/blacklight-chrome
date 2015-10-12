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

/*
 * jquery to go retrieve comments on page
 * returns a string of text from the server
 */
var globalURL = '';


function queryServer(pageUrl) {
    //var pageUrl = "http://stackoverflow.com/questions/14245334/chrome-extension-sendmessage-from-background-to-content-script-doesnt-work";
    
    //console.log("url to send: " + pageUrl);
    
    var response = '';
    //alert("started");
    
    response = $.ajax({
                url: 'http://www.blacklight-app.com/blb/request.php',
                type: 'post',
                data: 'url='+pageUrl,
                success: function(output) 
                {
                    
                    sendComments(output);
                    //showText(output);
                    //alert(output);
                }, error: function()
                {
                    console.log("ajax failiure");
                    return 'something went wrong, request failed';
                }
            });
    console.log(response);
    return response;        
    //return "shouldn't reach here";
}

/*
 * This is used to set the text in the extension popup
 */
function showText(statusText) {
  document.getElementById('p').textContent = statusText;
  
  
  /*
   * Send message to background script to show comment:
   */
//    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
//        chrome.tabs.sendMessage(tabs[0].id, {action: "show_comment", other: "showText"}, function(response) {});  
//    });
}

/*
 * Send comment to page
 */
function sendComments(serverOutput){
//    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
//        chrome.tabs.sendMessage(tabs[0].id, {
//            action: "show_comment",
//            text: "test Comment",
//            username: "Carter",
//            xPositionRatio: 0.5,
//            yPositionRatio: 0.11112
//        }, function(response) {});  
//    });
//
    //serverOutput.action = "show_comment";
    var msgToSend = {
        action: "show_comment",
        comments: JSON.parse(serverOutput).comments
    }
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, msgToSend, function(response) {});  
    });
}


/*
 * The DOMContentLoaded event is called when the popup window is opened
 * 
 * when this occurs chrome.tabs.query gets the url of the current active tab,
 * and then calls the query server function to retrieve the comments
 */

document.addEventListener('DOMContentLoaded', function() {
    $("#_bl_loginbutton").click(login);
    $("#_bl_logout").click(logout);
    $("#_bl_logout").hide();
    
    checkIfLoggedIn();
    chrome.tabs.query({active:true,currentWindow:true},function(tab){
        //Be aware that `tab` is an array of Tabs 

        queryServer(tab[0].url);
    });
    

});


var globalURL = '';


function getCurrentUrl()
{
    var URL = 'this text should be replaced';
    
    
    chrome.tabs.query({active:true,currentWindow:true},function(tab){
        //Be aware that `tab` is an array of Tabs 
        //console.log("get url");
        //console.log(tab[0].url);
        URL = tab[0].url;
        //console.log( "url:" + globalURL);
        //return tab[0].url;
        
    });
    while (true) {
        if (URL != 'this text should be replaced') {
            console.log( "URL: " + URL);
            return URL;
        }
    }
    
    
    
    //return "http://dylanchords.info/07_bob/stuck_inside_of_mobile.htm";
    
}

function testGetCurrentUrl() {
    
    showText(getCurrentUrl());
}


function checkIfLoggedIn() {
    
    response = $.ajax({
                url: 'http://www.blacklight-app.com/blb/extensionLogin.php',
                type: 'post',
                //data: 'url='+pageUrl,
                success: function(output) 
                {
                    var parsedOutput = JSON.parse(output);
                    if (parsedOutput.logged_in == true) {
                        $("#_bl_loginform").hide();
                        $("#_bl_logininfo").text(parsedOutput.display_text);
                        $("#_bl_logout").show();
                    } else {
                        $("#_bl_loginform").show();
                        $("#_bl_logininfo").text("Please Log In");
                        $("#_bl_logout").hide();
                    } 
                    console.log(JSON.stringify(output));
                }, error: function()
                {
                    console.log("ajax failiure");
                    return 'something went wrong, request failed';
                }
            });
}

function login() {
    //console.log("clicked");
    var username = $("#_bl_username").val();
    var password = $("#_bl_password").val();
    
    //console.log("username: " + username + " Password: " + password);
    response = $.ajax({
            url: 'http://www.blacklight-app.com/blb/extensionLogin.php',
            type: 'post',
            data: 'username='+username+'&password='+password,
            success: function(output) 
            {
                var parsedOutput = JSON.parse(output);
                console.log(JSON.stringify(output));
                if (parsedOutput.logged_in == true) {
                    //checkIfLoggedIn();
                    $("#_bl_logininfo").text(parsedOutput.display_text);
                    $("#_bl_loginform").hide();
                    $("#_bl_logout").show();
                    
                } else {
                    $("#_bl_logininfo").text(parsedOutput.display_text);
                }

            }, error: function()
            {
                console.log("ajax failiure");
                //return 'something went wrong, request failed';
            }
    });
    
}

function logout() {
    response = $.ajax({
                url: 'http://www.blacklight-app.com/blb/logout.php',
                type: 'post',
                //data: 'url='+pageUrl,
                success: function(output) 
                {
                    //var parsedOutput = JSON.parse(output);
                    checkIfLoggedIn();
                    
                    //console.log(JSON.stringify(output));
                }, error: function()
                {
                    console.log("ajax failiure");
                    return 'something went wrong, request failed';
                }
            });
}

