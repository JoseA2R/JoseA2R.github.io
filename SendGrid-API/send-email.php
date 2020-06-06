<?php
/*SendGrid Library*/
require_once ('vendor/autoload.php');

/*Post Data*/
$type       =     $_POST['type'];
$name       =     $_POST['name'];
$email      =     $_POST['email'];
$subject     =     $_POST['subject'];
$message    =     $_POST['message'];
$filename   =     $_POST['fileName'];
$attachment =     $_POST['code'];

/*Content*/
$from = new SendGrid\Email("CodeMent", "diogojmferreira@hotmail.com");
$subject = $subject;
$to = new SendGrid\Email("CodeMent", $email);
$content1 = new SendGrid\Content("text/plain", $message);

$content = new \SendGrid\Attachment();
$content->setContent(base64_encode($attachment));
$content->setType($type);
$content->setFilename($filename);
$content->setDisposition("attachment");

/*Send the mail*/
$mail = new SendGrid\Mail($from, $subject, $to, $content1);
$mail->addAttachment( $content );
$apiKey = ('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');
$sg = new \SendGrid($apiKey);

/*Response*/
$response = $sg->client->mail()->send()->post($mail);
?>

<!--Print the response-->
<pre>
    <?php
    var_dump($response);
    ?>
</pre>
