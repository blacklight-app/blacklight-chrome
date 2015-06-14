/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * jquery to go retrieve comments on page
 * returns a string of text from the server
 */

function queryServer() {
    var pageUrl = "none";
    //pageUrl = info.pageUrl;
    
    var response = '';
    //alert("started");
    
    response = $.ajax({
                url: 'http://www.blacklight-app.com/blb/request.php',
                type: 'post',
                data: 'url='+pageUrl,
                success: function(output) 
                {
                    showText(output);
                }, error: function()
                {
                    console.log("ajax failiure");
                    return 'something went wrong, request failed';
                }
            });
    console.log(response);
    return response;        
    return "shouldn't reach here";
}

/*
 * This is used to set the text in the extension popup
 */
function showText(statusText) {
  document.getElementById('p').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
    //showText(queryServer());
    queryServer();
    //showText($response);
    //alert("test");



    //showText("changed");

//  getCurrentTabUrl(function(url) {
//    // Put the image URL in Google search.
//    renderStatus('Performing Google Image search for ' + url);
//
//    getImageUrl(url, function(imageUrl, width, height) {
//
//      renderStatus('Search term: ' + url + '\n' +
//          'Google image search result: ' + imageUrl);
//      var imageResult = document.getElementById('image-result');
//      // Explicitly set the width/height to minimize the number of reflows. For
//      // a single image, this does not matter, but if you're going to embed
//      // multiple external images in your page, then the absence of width/height
//      // attributes causes the popup to resize multiple times.
//      imageResult.width = width;
//      imageResult.height = height;
//      imageResult.src = imageUrl;
//      imageResult.hidden = false;
//
//    }, function(errorMessage) {
//      renderStatus('Cannot display image. ' + errorMessage);
//    });
//  });
});