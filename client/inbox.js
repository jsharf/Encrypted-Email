$( document ).ready(function() {

    // some environment variables...
    var URL = "www.test.com";
    
    // fill in request with variables to be appended to URL for
    // HTTP GET request made by getJSON
    var request = {
        key: "value"
    };
    var emails = new Array();

    function Email(from, to, subject, date, msg, id) {
        this.from = from;
        this.to = to;
        this.subject = subject;
        this.date = date;
        this.msg = msg;
        this.id = id;
    }

    function emailToRow(email) {
	    emails.push(email);
        $("<tr id=\"e"+email.id+"\"><td>"+email.from+"</td><td>"+email.subject+"</td><td>"+email.date+"</td></tr>"/*, {
            click: function() {
                display(email.id);
            }
        }*/).click(function d() {display(email.id);}).appendTo("#emails");
    }

    function decrypt(email) {
        var msg = email.msg;
        var decypted = '';
        //TODO: fill this in please
        // var password = somehow_get_password()
        // decrypted = somehow_decrypt_msg(msg, password)
        email.msg = decrypted;
    }
    // display as a dialog
    function display(id) {
        function createDialog(title, text, options) {
                return $("<div class='dialog' title='" + title + "'><p>" + text + "</p></div>")
                        .dialog(options);
        }
        createDialog(emails[id].from, "To: " + emails[id].to + "<br>Subject: " + emails[id].subject + "<br>Date: "+ emails[id].date +
                     "<hr>" + emails[id].msg);
    }
   
    function loadEmails(data) {
        if( Object.prototype.toString.call( someVar ) === '[object Array]' ) {
            for (var i=0; i<data.length; i++) {
                // I know I'm recreating objects passed by json. it's for the sake of enforcing
                // that the objects passed in actually contain required values and for cleaning up 
                // the code (if people know that emails is a list of Email objects, they can
                // look at the Email creater to see its relevant attributes). This also has the side
                // effect of discarding unecessary data passed in via jquery.
                var email = new Email(data[i].from, data[i].to, data[i].subject, data[i].date, data[i].msg, i);
                // !@#$ is a magic byte which determines whether or not the email is encrypted
                if (email.msg.substring(0, 4) === '!@#$') {
                    // if the message is encrypted, remove magic byte
                    // and then decrypt it
                    email.msg = email.msg.substring(4,email.msg.length);
                    decrypt(email);
                }
                emailToRow(email);
            }
		}
	}
    
    
    // create HTTP GET request with parameters specified in request.
    // The values specified in request are appended to the URL
    // This is an asynchronous call, and upon completion calls 
    // loadEmails with the retrieved json data
    $.getJSON(URL, request, loadEmails);
	emailToRow(new Email("Carlsen", "Anand", "Chess", "Nov 10th", "I will defeat you!!", 0));
	emailToRow(new Email("Carlsen", "Anand", "Chessing", "Nov 11th", "I am defeating you!!", 1));
	emailToRow(new Email("Carlsen", "Anand", "Chessed", "Nov 12th", "I defeated you!!", 2));
    

});