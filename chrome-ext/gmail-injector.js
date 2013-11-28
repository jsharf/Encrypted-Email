var keyServerURL = "google.com"; //TODO: figure this out


function addButtonHooks() {

    // Find send button
    // TODO: look for a better way to do this
    var sendButton;
    var sendDivs = $("div:contains('Send'):not(:has('div'))");
    if ( sendDivs.length <= 0 ) {
      // don't alert anything -- it's perfectly okay if there are no send
      // buttons on the gmail main page. When they appear, addButtonHooks (which
      // is called every 100ms) will find them
      return;
    }

    for (var i=0; i < sendDivs.length; i++) {
      sendButton = sendDivs[i];
    
      // if the button isn't already a dummy button
      if (!sendButton.EncryptedEmailDummy) {
        // Inject our js
          
        //clones the button. the dummy button has no listeners
        var dummySendButton = sendButton.cloneNode();
        
        //Replace the send button with our dummy button
        sendButton.parentNode.replaceChild( dummySendButton, sendButton );

        // Now we can add whatever we want to dummySendButton.onclick
        // and then call sendButton.click()
        // to perform the normal click procedure
        dummySendButton.onclick = function (e) {
            // browser compatibility
            e = e || window.event

            encryptEmail(e);
            console.log("Encrypting and sending...");
            sendButton.click();
        };
        // mark the newly created button as a dummy button
        dummySendButton.EncryptedEmailDummy = true;
      }
    }
}

// Performs all of the encryption tasks before continuing the normal
// Gmail send function.
function encryptEmail(e) {

    //TODO: implement this for multiple message divs on one page.
    var messageDiv = $("div[role='textbox'][aria-label='Message Body']");
    var message = messageDiv.html();
    console.log(message);   

    //get the key
    var request = $.ajax({
      type: "GET",
      url: keyServerURL,
      data: { 'email': $("#toAddress").val()}
    });

    request.done( function( data ) {
      var parsedData = $.parseJSON(data);
      var rPubKey = parsedData.publickey;
      //Encrypt
      openpgp.init();
      var pubKey = openpgp.read_publicKey( rPubKey );
      var encryptedMessage = openpgp.write_encrypted_message( pubKey, message );
      messageDiv.html(message);
    });

    request.fail( function(e) {
      //TODO: some useful error
      alert("Warning: Due to some unexplained error your message could not be" +
      "encrypted. Try refreshing the page");
      // if already warned about lack of encryption, just return
      if (this.previously_warned)
          return;
      e.preventDefault();
      this.previously_warned = true;
      return;
    });     

    return;
}

var checkButton = window.setInterval(addButtonHooks, 1000);

