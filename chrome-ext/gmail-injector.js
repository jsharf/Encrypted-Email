
function addButtonHooks() {

  // Find send button
  // TODO: look for a better way to do this
  var sendButton;
  var sendDivs = $("div:contains('Send'):not(:has('div'))");
  if ( sendDivs.length == 1 ) {
    sendButton = sendDivs[0];
  else {
    //TODO: some useful error handling
    ;
  }
  
  // Inject our js

  //clones the button. the dummy button has no listeners
  var dummySendButton = sendButton.cloneNode();
  //Replace the send button with our dummy button
  sendButton.parent.replaceChild( dummySendButton, sendButton );

  // Now we can add whatever we want to dummySendButton.onclick and then call
  // sendButton.click() to perform the normal click procedure
  dummySendButton.onclick = function () {
    encryptEmail();
    alert( "running super awesome encrypted email code" );

    sendButton.click();
  }
}

// Performs all of the encryption tasks before continuing the normal
// Gmail send function.
function encryptEmail() {
  //TODO: implement this
  return;
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
