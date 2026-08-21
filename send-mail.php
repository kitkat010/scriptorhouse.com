<?php
/**
 * Scriptor House — Contact Form Email Handler
 * send-mail.php
 */

header('Content-Type: application/json; charset=UTF-8');

// Configuration
$to_email = 'justinesaplan06@gmail.com';
$from_email = 'no-reply@scriptorhouse.com';
$site_name = 'Scriptor House';

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method.'
    ]);
    exit;
}

// Anti-Spam Honeypot check
if (!empty($_POST['website'])) {
    // If the hidden honeypot field is filled, silently discard
    echo json_encode([
        'status' => 'success',
        'message' => 'Thank you! Your inquiry has been received.'
    ]);
    exit;
}

// Extract and sanitize input data
$name = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
$email = isset($_POST['email']) ? trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL)) : '';
$phone = isset($_POST['phone']) ? trim(strip_tags($_POST['phone'])) : 'Not provided';
$inquiry_type = isset($_POST['inquiry-type']) ? trim(strip_tags($_POST['inquiry-type'])) : 'General';
$subject_text = isset($_POST['subject']) ? trim(strip_tags($_POST['subject'])) : 'New Inquiry from Website';
$message_text = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = 'Your name is required.';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}

if (empty($subject_text)) {
    $errors[] = 'Subject is required.';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => implode(' ', $errors)
    ]);
    exit;
}

// Map inquiry type to readable title
$inquiry_map = [
    'hollywood' => 'Hollywood Development Evaluation',
    'publishing' => 'Publishing Support',
    'producer' => 'Producer Outreach',
    'author' => 'Author Services',
    'client' => 'Contract / Existing Client Question',
    'film-production' => 'Film Production Inquiry',
    'security' => 'Security / Verification Concern',
    'general' => 'General Question'
];

$inquiry_label = isset($inquiry_map[$inquiry_type]) ? $inquiry_map[$inquiry_type] : htmlspecialchars($inquiry_type);

// Email Subject
$email_subject = "[$site_name Inquiry] " . $subject_text . " (" . $inquiry_label . ")";

// Unique MIME Boundary
$boundary = "----=_NextPart_" . md5(uniqid(time(), true));

// Plain Text Body (essential for spam filter bypass)
$plain_body = "Scriptor House — New Website Inquiry\n";
$plain_body .= "====================================\n\n";
$plain_body .= "From: " . $name . " <" . $email . ">\n";
$plain_body .= "Phone: " . $phone . "\n";
$plain_body .= "Inquiry Type: " . $inquiry_label . "\n";
$plain_body .= "Subject: " . $subject_text . "\n\n";
$plain_body .= "Message:\n" . $message_text . "\n\n";
$plain_body .= "------------------------------------\n";
$plain_body .= "Sent via Scriptor House Contact Form: " . date('r') . "\n";

// HTML Email Body
$html_body = "
<!DOCTYPE html>
<html>
<head>
  <meta charset='UTF-8'>
  <title>New Website Inquiry</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #222; background-color: #f4f4f5; padding: 20px; margin: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e4e4e7; }
    .header { background: #09090b; color: #eab308; padding: 24px; text-align: center; }
    .header h2 { margin: 0; font-size: 20px; font-weight: 700; color: #eab308; }
    .content { padding: 28px 32px; }
    .item { margin-bottom: 16px; }
    .label { font-weight: bold; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { font-size: 15px; color: #18181b; margin-top: 4px; }
    .message-box { background: #f4f4f5; border-left: 3px solid #eab308; padding: 16px; border-radius: 4px; margin-top: 8px; white-space: pre-wrap; font-size: 14px; color: #27272a; line-height: 1.6; }
    .footer { background: #fafafa; padding: 14px 20px; text-align: center; font-size: 12px; color: #a1a1aa; border-top: 1px solid #e4e4e7; }
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h2>Scriptor House — Website Inquiry</h2>
    </div>
    <div class='content'>
      <div class='item'>
        <div class='label'>From</div>
        <div class='value'>" . htmlspecialchars($name) . " &lt;" . htmlspecialchars($email) . "&gt;</div>
      </div>
      <div class='item'>
        <div class='label'>Phone</div>
        <div class='value'>" . htmlspecialchars($phone) . "</div>
      </div>
      <div class='item'>
        <div class='label'>Inquiry Type</div>
        <div class='value'>" . htmlspecialchars($inquiry_label) . "</div>
      </div>
      <div class='item'>
        <div class='label'>Subject</div>
        <div class='value'>" . htmlspecialchars($subject_text) . "</div>
      </div>
      <div class='item'>
        <div class='label'>Message</div>
        <div class='message-box'>" . nl2br(htmlspecialchars($message_text)) . "</div>
      </div>
    </div>
    <div class='footer'>
      Received via scriptorhouse.com &bull; " . date('r') . "
    </div>
  </div>
</body>
</html>
";

// Construct Multipart Body
$full_body = "--" . $boundary . "\r\n";
$full_body .= "Content-Type: text/plain; charset=UTF-8\r\n";
$full_body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$full_body .= $plain_body . "\r\n\r\n";

$full_body .= "--" . $boundary . "\r\n";
$full_body .= "Content-Type: text/html; charset=UTF-8\r\n";
$full_body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$full_body .= $html_body . "\r\n\r\n";
$full_body .= "--" . $boundary . "--";

// Generate unique Message-ID
$domain = !empty($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'scriptorhouse.com';
$msg_id = "<" . time() . "." . md5(uniqid(rand(), true)) . "@" . $domain . ">";

// Anti-Spam Compliant RFC Headers
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Date: " . date('r') . "\r\n";
$headers .= "Message-ID: " . $msg_id . "\r\n";
$headers .= "From: $site_name <$from_email>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "X-Mailer: Scriptor House Web Contact\r\n";
$headers .= "X-Priority: 3\r\n";
$headers .= "Content-Type: multipart/alternative; boundary=\"" . $boundary . "\"\r\n";

// Send Mail with Bluehost envelope sender flag (-f)
$mail_sent = @mail($to_email, $email_subject, $full_body, $headers, "-f $from_email");



// Save a local JSON backup log (ensures zero lost leads on localhost / development)
$log_dir = __DIR__ . '/logs';
if (!is_dir($log_dir)) {
    @mkdir($log_dir, 0755, true);
}

$log_entry = [
    'timestamp' => date('c'),
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'inquiry_type' => $inquiry_label,
    'subject' => $subject_text,
    'message' => $message_text,
    'mail_sent' => $mail_sent ? true : false,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
];

@file_put_contents(
    $log_dir . '/inquiries.jsonl',
    json_encode($log_entry) . PHP_EOL,
    FILE_APPEND | LOCK_EX
);

// Response
echo json_encode([
    'status' => 'success',
    'message' => 'Thank you! Your inquiry has been sent successfully. Our team will review your message and get back to you shortly.'
]);
exit;
