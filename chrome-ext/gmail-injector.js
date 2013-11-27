var keyServerURL = "google.com"; //TODO: figure this out


function addButtonHooks() {

    // Find send button
    // TODO: look for a better way to do this
    var sendButton;
    var sendDivs = $("div:contains('Send'):not(:has('div'))");
    if ( sendDivs.length <= 0 ) {
      // TODO: some useful error
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
        dummySendButton.onclick = function () {
            encryptEmail();
            alert( "running super awesome encrypted email code" );
            sendButton.click();
        };
        // mark the newly created button as a dummy button
        dummySendButton.EncryptedEmailDummy = true;
      }
    }
}

// Performs all of the encryption tasks before continuing the normal
// Gmail send function.
function encryptEmail() {

    //TODO: implement this
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

    request.fail( function() {
      //TODO: some useful error
      return;
    });     

    return;
}

var checkButton = window.setInterval(addButtonHooks, 1000);

