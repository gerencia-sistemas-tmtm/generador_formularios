<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recibir datos del formulario
    $formTitle = $_POST['formTitle'];
    $emailInput = $_POST['emailInput'];
    $formHtml = $_POST['formHtml'];

    // Create directory if not exists
    $directory = 'forms/' . $formTitle;
    if (!file_exists($directory)) {
        mkdir($directory, 0777, true);
    }

    // Save form HTML to a file
    $formFileName = $directory . '/index.html';
    file_put_contents($formFileName, $formHtml);

    // Save form data to a file
    $data = "Título del Formulario: $formTitle\n";
    $data .= "Correo Destino: $emailInput\n";

    $dataFileName = $directory . '/form_data.txt';
    file_put_contents($dataFileName, $data);

    echo "Formulario generado y guardado en '$directory'.";
}
?>
