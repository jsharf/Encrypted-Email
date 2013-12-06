// Saves options to localStorage.
    function save_options() {
      var email = document.getElementById("email").value;
      var password = document.getElementById("password").value;

      localStorage["email"] = email;
      localStorage["password"] = password;
      chrome.storage.local.set( {"email": email} );
      chrome.storage.local.set( {"password": password} );

      // Update status to let user know options were saved.
      var status = document.getElementById("status");
      status.innerHTML = "Options Saved.";
      setTimeout(function() {
        status.innerHTML = "";
      }, 750);
    }

    // Restores select box state to saved value from localStorage.
    function restore_options() {
      var email = localStorage["email"];
      if (!email) {
        return;
      }
      var emailEl = document.getElementById("email");
      emailEl.value = email;
    }
    document.addEventListener('DOMContentLoaded', restore_options);
    document.querySelector('#save').addEventListener('click', save_options);
