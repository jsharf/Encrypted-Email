<?php
error_reporting(0);
if(empty($_GET['username'])) {die();}
if(empty($_GET['password'])) {die();}
if(empty($_GET['hostname'])) {die();}

$username = $_GET['username'];
$password = $_GET['password'];
$hostname = $_GET['hostname'];


//Code adapted from: http://davidwalsh.name/gmail-php-imap
/* connect to gmail */
$hostname = '{imap.gmail.com:993/imap/ssl}INBOX';

/* try to connect */
$inbox = imap_open($hostname,$username,$password) or die('Cannot connect to Gmail: ' . imap_last_error());

/* grab emails */
$emails = imap_search($inbox,'ALL');

/* if emails are returned, cycle through each... */
if($emails) {
	
	/* begin output var */
	$output = array();
	
	/* put the newest emails on top */
	rsort($emails);
	
	/* for every email... */
	foreach($emails as $email_number) {
		
		/* get information specific to this email */
		$overview = imap_fetch_overview($inbox,$email_number,0);
		$message = imap_fetchbody($inbox,$email_number,2);
		
		/* output the email header information */
		$output[] = array('seen'=>($overview[0]->seen ? 'read' : 'unread'),
						  'subject'=> $overview[0]->subject,
						  'from'=> $overview[0]->from,
						  'date'=> $overview[0]->date,
						  'body'=> $message);
	}
	//print_r( $output );
	echo json_encode($output);
} 

/* close the connection */
imap_close($inbox);








?>