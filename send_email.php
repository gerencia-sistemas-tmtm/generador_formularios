<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recibir datos del formulario
    $formTitle = $_POST['formTitle'];
    $emailInput = $_POST['emailInput'];
    $formHtml = $_POST['formHtml'];

    // Configuración de envío de correo electrónico
    $to = $emailInput;
    $subject = "Reporte de formulario: " . $formTitle;
    $message = $formHtml;

    // Encabezados para el correo electrónico
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: <reportes@tumarkettumodelo.com.mx>"; // Cambiar por tu dirección de correo

    // Enviar correo electrónico
    if (mail($to, $subject, $message, $headers)) {
        echo "El reporte ha sido enviado exitosamente a " . $emailInput;
    } else {
        echo "Error al enviar el reporte.";
    }
}
?>
