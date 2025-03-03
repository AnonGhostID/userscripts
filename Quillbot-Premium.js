// ==UserScript==
// @name         Quillbot Premium Unlocker
// @namespace    quillbot.taozhiyu.gitee.io
// @version      0.3.1
// @description  Unlocks Quillbot Premium so that you don't have to pay.
// @author       longkidkoolstar
// @match        https://quillbot.com/*
// @icon         https://quillbot.com/favicon.png
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1124435
// @run-at       document-start
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/465276/Quillbot%20Premium%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/465276/Quillbot%20Premium%20Unlocker.meta.js
// ==/UserScript==
/* global ajaxHooker*/
(function() {
    'use strict';

    // Hooking AJAX request to unlock premium
    ajaxHooker.hook(request => {
        if (request.url.endsWith('get-account-details')) {
            request.response = res => {
                const json = JSON.parse(res.responseText);
                const a = "data" in json ? json.data : json;
                a.profile.accepted_premium_modes_tnc = true;
                a.profile.premium = true;
                res.responseText = JSON.stringify("data" in json ? (json.data = a, json) : a);
            };
        }
    });

    // Create and display the popup
    window.addEventListener('load', () => {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.bottom = '20px';
        popup.style.right = '20px';
        popup.style.padding = '15px';
        popup.style.backgroundColor = '#f9f9f9';
        popup.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.border = '1px solid #ccc';
        popup.style.borderRadius = '8px';
        popup.style.zIndex = '10000';
        popup.style.fontFamily = 'Arial, sans-serif';
        popup.style.color = '#333';
        popup.style.textAlign = 'center';

        const message = document.createElement('p');
        message.textContent = 'Join our Discord community for a WORKING SCRIPT with CONTINUOUS UPDATES and more features which now unlocks everything in Quillbot, not only the paraphrasing tool!';
        message.style.margin = '0 0 10px';

        const link = document.createElement('a');
        link.href = 'https://discord.gg/JrweGzdjwA';
        link.textContent = 'Join Discord';
        link.style.color = '#007bff';
        link.style.textDecoration = 'none';
        link.style.fontWeight = 'bold';
        link.target = '_blank';

        link.addEventListener('mouseover', () => link.style.textDecoration = 'underline');
        link.addEventListener('mouseout', () => link.style.textDecoration = 'none');

        popup.appendChild(message);
        popup.appendChild(link);

        const closeButton = document.createElement('button');
        closeButton.textContent = '✖';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '16px';
        closeButton.style.color = '#333';

        closeButton.addEventListener('click', () => {
            document.body.removeChild(popup);
        });

        popup.appendChild(closeButton);

        document.body.appendChild(popup);
    });

})();
