chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
    chrome.scripting
      .executeScript({
        target: { tabId },
        files: ["./content.js"],
      })
      .then(() => {
        console.log("content script injected");
      })
      .catch((err) => {
        console.log(err, "error in background script line 9");
      });
  }
});

chrome.action.onClicked.addListener( function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: "append", function(response) {
            console.log(response.result);
        }})
    })
})