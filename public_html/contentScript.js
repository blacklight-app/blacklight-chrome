/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';
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
