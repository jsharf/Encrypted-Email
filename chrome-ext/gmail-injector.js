function addButtonHooks()
{
    var divs = $("div");
    divs.each(function (t) {
        if (t.html() === "Send") {
            alert("Found send button!"
    }
}

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  // If the letter 'g' is found in the tab's URL...
  if (tab.url.indexOf("://mail.google.com/") !== -1) {
    // ... show the page action.
    chrome.pageAction.show(tabId);
    var checkButton = window.setInterval(addButtonHooks, 1000);
  }
};



// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
