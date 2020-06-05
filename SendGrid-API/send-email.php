<?php
/*SendGrid Library*/
require_once ('vendor/autoload.php');

/*Post Data*/
$type =           $_POST['type'];
$name =           $_POST['name'];
$email =          $_POST['email'];
$message =        $_POST['message'];
$filename =       $_POST['filename'];
$attachment =     $_POST['code'];
//die(var_dump($attachment));
/*Content*/
$from = new SendGrid\Email("Code", "2107418@student.uma.pt");
$subject = "Testing Mail";
$to = new SendGrid\Email("Jose", $email);
$content1 = new SendGrid\Content("text/html", $message);

$content = new \SendGrid\Attachment();
$content->setContent(base64_encode($attachment));
$content->setType($type);
$content->setFilename($filename);
$content->setDisposition("attachment");
//die(var_dump($content));
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
