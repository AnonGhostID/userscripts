// ==UserScript==
// @name         Pixeldrain Download Bypass with Auto-Copy
// @namespace    http://tampermonkey.net/
// @version      1.7.0
// @description  Bypass Pixeldrain Download Limit and automatically copy links to clipboard
// @author       MegaLime0, honey, Nurarihyon, Modified by user
// @match        https://pixeldrain.com/*
// @match        https://cdn.pd8.workers.dev/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixeldrain.com
// @grant        GM_openInTab
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/491326/Pixeldrain%20Download%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/491326/Pixeldrain%20Download%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bypassUrl = "https://pd.cybar.xyz/";
    const idRegex = /\/api\/file\/(\w+)\//;

    // Function to create notification popup
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.background = '#a4be8c';
        notification.style.color = '#2f3541';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        notification.style.zIndex = '9999';
        notification.style.fontSize = '14px';
        notification.style.fontWeight = 'bold';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';

        const icon = document.createElement('span');
        icon.textContent = '✓ ';
        icon.style.marginRight = '8px';
        icon.style.fontSize = '16px';

        const text = document.createElement('span');
        text.textContent = message;

        notification.appendChild(icon);
        notification.appendChild(text);
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }

    function getBypassUrls(urlType) {
        const currentUrl = window.location.href;

        if (urlType == "file") {
            const id = currentUrl.replace("https://pixeldrain.com/u/", "");
            const alteredUrl = bypassUrl + id;

            return alteredUrl;
        }

        if (urlType == "gallery") {
            const links = document.querySelectorAll('a.file');

            const bypassUrlList = [];
            const bypassUrlNames = [];

            links.forEach((link) => {
                const childDiv = link.querySelector('div');
                const backgroundUrl = childDiv.style.backgroundImage;

                const match = backgroundUrl.match(idRegex);

                if (match && match.length > 1) {
                    const alteredUrl = bypassUrl + match[1];
                    bypassUrlList.push(alteredUrl);
                    bypassUrlNames.push(link.textContent);
                }
            });

            return {bypassUrlList, bypassUrlNames};
        }
    }

    function handleButtonClick() {
        const currentUrl = window.location.href;

        if (currentUrl.includes("https://pixeldrain.com/u/")) {
            const alteredUrl = getBypassUrls("file");
            startDownload(alteredUrl);
        }

        if (currentUrl.includes("https://pixeldrain.com/l/")) {
            const links = getBypassUrls("gallery").bypassUrlList;

            links.forEach((link) => {
                startDownload(link)
            });
        }
    }

    function startDownload(link) {
          // GM_openInTab(link);  Old way of downloading
          const a = document.createElement("a");
          a.href = link;
          a.click();
    }

    function handleLinksButtonClick() {
        const popupBox = document.getElementById('popupBox');
        const popupClose = document.createElement('span');
        popupClose.innerHTML = '&times;';
        popupClose.style.position = 'absolute';
        popupClose.style.top = '1px';
        popupClose.style.right = '7px';
        popupClose.style.cursor = 'pointer';
        popupClose.onclick = function() {
            popupBox.style.display = 'none';
        };

        popupBox.innerHTML = '';
        popupBox.appendChild(popupClose);

        const currentUrl = window.location.href;

        if (currentUrl.includes("https://pixeldrain.com/u/")) {
            const alteredUrl = getBypassUrls("file");
            const urlElement = document.createElement("a");
            urlElement.href = alteredUrl;
            urlElement.textContent = alteredUrl;
            popupBox.appendChild(urlElement);
        }

        if (currentUrl.includes("https://pixeldrain.com/l/")) {
            let result = getBypassUrls("gallery");
            let bypassLinks = result.bypassUrlList;
            let bypassNames = result.bypassUrlNames;

            const linksContainer = document.createElement("div");
            linksContainer.style.maxHeight = "calc(100% - 40px)";
            linksContainer.style.overflowY = "auto";
            linksContainer.style.paddingBottom = "10px";

            bypassLinks.forEach((link) => {
                const urlElement = document.createElement("a");
                urlElement.href = link;
                urlElement.textContent = link;
                urlElement.style.display = "block";
                linksContainer.appendChild(urlElement);
            });

            popupBox.appendChild(linksContainer);

            popupBox.style.display = 'flex';
            popupBox.style.flexDirection = 'column';
            popupBox.style.alignItems = 'center';
            popupBox.style.justifyContent = 'center';

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'center';
            buttonContainer.style.marginTop = '10px';

            const copyButton = document.createElement('button');
            copyButton.textContent = '🔗 Copy URL';
            copyButton.style.marginRight = '5px';
            copyButton.addEventListener('click', function() {
                const urls = bypassLinks.join('\n');
                navigator.clipboard.writeText(urls).then(function() {
                    copyButton.textContent = "✔️ Copied";
                    setTimeout(function() {
                        copyButton.textContent = '🔗 Copy URL';
                    }, 2500);
                }, function(err) {
                    console.error('Failed to copy URLs: ', err);
                });
            });
            buttonContainer.appendChild(copyButton);

            const saveButton = document.createElement('button');
            saveButton.textContent = '📄 Save as Text File';
            saveButton.style.marginLeft = '5px';
            saveButton.addEventListener('click', function() {
                const popupContent = document.getElementById('popupBox').querySelectorAll('a');
                if (popupContent.length > 0) {
                    const currentUrl = window.location.href;
                    const fileIdMatch = currentUrl.match(/\/l\/([^/#?]+)/);
                    if (fileIdMatch && fileIdMatch.length > 1) {
                        const fileId = fileIdMatch[1];
                        const fileName = fileId + '.txt';
                        let content = '';
                        popupContent.forEach((link) => {
                            content += link.href + '\n';
                        });
                        const blob = new Blob([content.trim()], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revoObjectURL(url);
                    } else {
                        console.error('Failed to extract file identifier from URL.');
                    }
                } else {
                    console.error('Popup content not found.');
                }
            });
            buttonContainer.appendChild(saveButton);

            popupBox.appendChild(buttonContainer);
        }

        popupBox.style.display = 'block';
    }

    // Auto-copy to clipboard function
    function autoCopyBypassLinks() {
        const currentUrl = window.location.href;

        // For single file
        if (currentUrl.includes("https://pixeldrain.com/u/")) {
            const alteredUrl = getBypassUrls("file");
            navigator.clipboard.writeText(alteredUrl).then(function() {
                showNotification("Bypass link copied to clipboard");
            }, function(err) {
                console.error('Failed to copy URL: ', err);
                showNotification("Failed to copy bypass link");
            });
        }

        // For gallery
        if (currentUrl.includes("https://pixeldrain.com/l/")) {
            // Wait a bit for the page to load completely
            setTimeout(() => {
                let result = getBypassUrls("gallery");
                if (result && result.bypassUrlList && result.bypassUrlList.length > 0) {
                    const urls = result.bypassUrlList.join('\n');
                    navigator.clipboard.writeText(urls).then(function() {
                        showNotification(`${result.bypassUrlList.length} bypass links copied to clipboard`);
                    }, function(err) {
                        console.error('Failed to copy URLs: ', err);
                        showNotification("Failed to copy bypass links");
                    });
                }
            }, 1500); // Wait 1.5 seconds for the page to load
        }
    }

    if (window.location.href.includes('pixeldrain.com')) {
        const button = document.createElement("button");
        const downloadIcon = document.createElement("a");
        downloadIcon.className = "icon";
        downloadIcon.textContent = "download";
        downloadIcon.style.color = "#d7dde8";
        const downloadButtonText = document.createElement("span");
        downloadButtonText.textContent = "Download Bypass";
        button.appendChild(downloadIcon);
        button.appendChild(downloadButtonText);

        const linksButton = document.createElement("button");
        const linksIcon = document.createElement("i");
        linksIcon.className = "icon";
        linksIcon.textContent = "link";
        const linksButtonText = document.createElement("span");
        linksButtonText.textContent = "Show Bypass Links";
        linksButton.appendChild(linksIcon);
        linksButton.appendChild(linksButtonText);

        const popupBox = document.createElement("div");
        popupBox.style.zIndex = 20;
        popupBox.style.whiteSpace = "pre-line";
        popupBox.id = "popupBox";
        popupBox.style.display = "none";
        popupBox.style.position = "fixed";

        popupBox.style.top = "50%";
        popupBox.style.left = "50%";
        popupBox.style.transform = "translate(-50%, -50%)";
        popupBox.style.padding = "20px";
        popupBox.style.background = "#2f3541";
        popupBox.style.border = "2px solid #a4be8c";
        popupBox.style.color = "#d7dde8";
        popupBox.style.borderRadius = "10px";
        popupBox.style.width = "30%";
        popupBox.style.height = "auto";
        popupBox.style.maxWidth = "600px";

        button.addEventListener('click', handleButtonClick);
        linksButton.addEventListener('click', handleLinksButtonClick);

        // Add buttons to the page
        function addButtons() {
            const labels = document.querySelectorAll('div.label');
            let buttonsAdded = false;

            labels.forEach(label => {
                if (label.textContent.trim() === 'Size') {
                    const nextElement = label.nextElementSibling;
                    if (nextElement) {
                        nextElement.insertAdjacentElement('afterend', linksButton);
                        nextElement.insertAdjacentElement('afterend', button);
                        buttonsAdded = true;
                    }
                }
            });

            return buttonsAdded;
        }

        // Try to add buttons, if elements aren't loaded yet, retry after a delay
        if (!addButtons()) {
            const buttonCheckInterval = setInterval(() => {
                if (addButtons()) {
                    clearInterval(buttonCheckInterval);
                }
            }, 500);

            // Stop checking after 10 seconds max
            setTimeout(() => {
                clearInterval(buttonCheckInterval);
            }, 10000);
        }

        document.body.appendChild(popupBox);

        // Auto-copy on page load after a slight delay to ensure all elements are loaded
        setTimeout(() => {
            autoCopyBypassLinks();
        }, 1000);
    }
})();
