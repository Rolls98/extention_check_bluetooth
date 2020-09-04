chrome.runtime.onInstalled.addListener(
    function () {
        chrome.app.window.create('index.html');
    }
);