<?php

include('../encryptedEmailCxn.php');
$cxn = mysqli_connect($hostName, $username, $password, $dbName)
	or die ("Could not connect to database.");

if(empty($_GET['email'])) {die();}
$emailAddress = mysqli_real_escape_string($cxn, $_GET['email']);
$emailLookUpResult = mysqli_query($cxn, "SELECT * FROM email WHERE address='$emailAddress'");
$result = array();
if ($emailRow = mysqli_fetch_assoc($emailLookUpResult)) {
	$result['address'] = $emailRow['address'];
	$result['publickey'] = $emailRow['publickey'];
	$result['privatekey'] = $emailRow['privatekey'];
}
echo json_encode($emailRow);

?>



