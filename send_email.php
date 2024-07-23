<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recibir datos del formulario
    $formTitle = $_POST['formTitle'];
    $emailInput = $_POST['emailInput'];
    $files = $_FILES['fileInput'];

    // Crear el cuerpo del correo electrónico con los datos del formulario
    $formBody = "<h2>Reporte: $formTitle</h2>";
    foreach ($_POST as $key => $value) {
        if ($key != 'formTitle' && $key != 'emailInput') {
            $formBody .= "<p><strong>$key:</strong> $value</p>";
        }
    }

    $mail = new PHPMailer(true);

    try {
        // Configuración del servidor SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.titan.email'; // Cambia esto por el host de tu servidor SMTP
        $mail->SMTPAuth = true;
        $mail->Username = 'reportes@tumarkettumodelo.com.mx'; // Cambia esto por tu dirección de correo
        $mail->Password = '.d{DLr=W^_N*+;}'; // Cambia esto por tu contraseña de correo
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Usar SMTPS en lugar de STARTTLS para el puerto 465
        $mail->Port = 465; // Usar el puerto 465 para SMTPS

        // Destinatario
        $mail->setFrom('reportes@tumarkettumodelo.com.mx', 'Reportes modelorama');
        $emailAddresses = explode(',', $emailInput);
        foreach ($emailAddresses as $emailAddress) {
            $mail->addAddress(trim($emailAddress));
        }

        // Contenido del correo
        $mail->isHTML(true);
        $mail->Subject = "Reporte de formulario: " . $formTitle;
        $mail->Body = $formBody;

         // Adjuntar archivos
         for ($i = 0; $i < count($files['name']); $i++) {
            if ($files['error'][$i] == UPLOAD_ERR_OK) {
                $mail->addAttachment($files['tmp_name'][$i], $files['name'][$i]);
            }
        }

        // Enviar correo
        $mail->send();
        echo "El reporte ha sido enviado exitosamente a " . $emailInput;
    } catch (Exception $e) {
        echo "Error al enviar el reporte. Mailer Error: {$mail->ErrorInfo}";
    }
}
?>
