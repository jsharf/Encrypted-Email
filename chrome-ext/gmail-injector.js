
function addButtonHooks() {

    // Find send button
    // TODO: look for a better way to do this
    var sendButton;
    var sendDivs = $("div:contains('Send'):not(:has('div'))");
    if ( sendDivs.length > 0 ) {
        
        for (var i=0; i<sendDivs.length; i++) {
            sendButton = sendDivs[i];
	    if (!sendButton.EncryptedEmailDummy) {
	        // Inject our js
                
		//clones the button. the dummy button has no listeners
            	var dummySendButton = sendButton.cloneNode();
            	
		//Replace the send button with our dummy button
            	sendButton.parentNode.replaceChild( dummySendButton, sendButton );

            	// Now we can add whatever we want to dummySendButton.onclick and then call
            	// sendButton.click() to perform the normal click procedure
            	dummySendButton.onclick = function () {
                    encryptEmail();
                    alert( "running super awesome encrypted email code" );
                    sendButton.click();
                }
	        dummySendButton.EncryptedEmailDummy = true;
	    }
        }
    }
    else {
        //TODO: some useful error handling
        ;
    }

}

// Performs all of the encryption tasks before continuing the normal
// Gmail send function.
function encryptEmail() {
    //TODO: implement this
    return;
}

var checkButton = window.setInterval(addButtonHooks, 1000);

