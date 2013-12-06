var keyServerURL = "http://www.gamingeden.com/request.php"; //TODO: figure this out


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

    returnNow = false;

    //TODO: implement this for multiple message divs on one page.
    var messageDiv = $("div[role='textbox'][aria-label='Message Body']");
    var message = messageDiv.html();
    
    var email = $("textarea[aria-label='Address']").prev().children().first().attr("email");

    //get the key
    var request = $.ajax({
      type: "GET",
      url: keyServerURL,
      async: false,
      data: { "email": email }
    });

    request.done( function( data ) {
      var parsedData = $.parseJSON(data);
      var rPubKey = parsedData.publickey;
      //Encrypt
      openpgp.init();
      var pubKey = openpgp.read_publicKey( rPubKey );
      var encryptedMessage = openpgp.write_encrypted_message( pubKey, message );

      console.log(encryptedMessage);
      messageDiv.html(encryptedMessage);
      window.setTimeout(3000);
      returnNow = true;
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
   
    //TODO: FUCK FUCK FUCK THIS IS SO BAD 
    while( !returnNow ) {; }//block until the message is encrypted
    return;
}

function decryptEmail() {

  // find the message body
  var messageDiv = $("div:contains('===pgp==='):not(:has('span')):not(:has('div'))");

  if( messageDiv.length <= 0 ) {
    return;
  }

  var message = messageDiv.html();

  // get the private key
  var request = $.ajax({
      type: "GET",
      url: keyServerURL,
      data: { 'email': email }
    });

    request.done( function( data ) {
      var parsedData = $.parseJSON(data);
      var priv_key = parsedData.privatekey;

      var msg = openpgp.read_message(message);

			var keymat = null;
			var sesskey = null;

			// Find the private (sub)key for the session key of the message
      // BEGIN MAGIC BEYOND THE SCOPE OF CS130
			for (var i = 0; i< msg[0].sessionKeys.length; i++) {
				if (priv_key[0].privateKeyPacket.publicKey.getKeyId() == msg[0].sessionKeys[i].keyId.bytes) {
					keymat = { key: priv_key[0], keymaterial: priv_key[0].privateKeyPacket};
					sesskey = msg[0].sessionKeys[i];
					break;
				}
				for (var j = 0; j < priv_key[0].subKeys.length; j++) {
					if (priv_key[0].subKeys[j].publicKey.getKeyId() == msg[0].sessionKeys[i].keyId.bytes) {
						keymat = { key: priv_key[0], keymaterial: priv_key[0].subKeys[j]};
						sesskey = msg[0].sessionKeys[i];
						break;
					}
				}
			}

			if (keymat === null) {
        console.log("uh oh wierd stuff happened getting the keymat");
        return;
      }
				
      if (!keymat.keymaterial.decryptSecretMPIs( privateKeyPassword )) {
					console.log("password for secret key was incorrect");
					return;
      }
      
      var decryptedMessage = msg[0].decrypt(keymat, sesskey);

      // set the message div with the decrypted message
      messageDiv.html( decryptedMessage );

    });

    request.fail( function(e) {
      //TODO: some useful error
      alert("Warning: Due to some unexplained error your key could not be" +
      "retrieved. Try refreshing the page");
      // if already warned about lack of encryption, just return
      if (this.previously_warned)
          return;
      e.preventDefault();
      this.previously_warned = true;
      return;
    });

}

var email = "encryptedemail130@gmail.com";
var password = "cs130test";

var checkButton = window.setInterval(addButtonHooks, 1000);
var checkMessage = window.setInterval(decryptEmail , 1000);


