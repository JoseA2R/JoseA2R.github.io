<?php
/*SendGrid Library*/
require_once ('vendor/autoload.php');

/*Post Data*/
$type          = $_POST['type'];
$name          = $_POST['name'];
$email         = $_POST['email'];
$subject       = $_POST['subject'];
$message       = $_POST['message'];
$filename      = $_POST['fileName'];
$attachment    = $_POST['code'];
$video         = $_POST['fileContent'];
$videoNameFile = $_POST['nameVideo'];
$voiceNote     = $_POST['voiceNote0'];
//die(var_dump($video));
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

if(isset($video) && !empty($video)){
    $contentVideo = new \SendGrid\Attachment();
    $contentVideo->setcontent(base64_encode(file_get_contents($video)));
    $contentVideo->setType('video/webm');
    $contentVideo->setFilename($filename);
    $contentVideo->setDisposition("attachment");
}

if(isset($voiceNote) && !empty($voiceNote)){
    $contentAudio = new \SendGrid\Attachment();
    $contentAudio->setcontent(base64_encode($voiceNote));
    $contentAudio->setType('audio/x-wav');
    $contentAudio->setFilename($filename);
    $contentAudio->setDisposition("attachment");
}

/*Send the mail*/
$mail = new SendGrid\Mail($from, $subject, $to, $content1);
$mail->addAttachment( $content );
if(isset($video) && !empty($video)){
    $mail->addAttachment( $contentVideo );
}
$apiKey = ('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');
$sg = new \SendGrid($apiKey);

/*Response*/
$response = $sg->client->mail()->send()->post($mail);

header('Location: ' . $_SERVER['HTTP_REFERER']);

?>

