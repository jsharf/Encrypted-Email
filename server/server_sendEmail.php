<?php

$to = "rdroizen@gmail.com";
$subject = "Test Email";
$body = "This is only a test.";
$headers = "From: me@example.com\r\n".
    	"Reply-To: me@example.com\r\n";
$cc = null;
$bcc = null;
$return_path = "me@example.com";

imap_mail($to, $subject, $body, $headers, $cc, $bcc, $return_path);










?>