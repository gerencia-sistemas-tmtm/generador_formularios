<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Get the path from the query parameter
    $path = isset($_GET['path']) ? $_GET['path'] : '';

    // Check if the path is provided
    if (empty($path)) {
        http_response_code(400);
        echo json_encode(['error' => 'Path parameter is required']);
        exit;
    }

    // Check if the file exists
    $filePath = $path . '/form_data.txt';
    if (!file_exists($filePath)) {
        http_response_code(404);
        echo json_encode(['error' => 'File not found']);
        exit;
    }

    // Read the content of the file
    $fileContent = file_get_contents($filePath);

    // Extract the form HTML
    $formHtml = extractFormHtml($fileContent);

    if (empty($formHtml)) {
        http_response_code(404);
        echo json_encode(['error' => 'Form not found in the file']);
        exit;
    }

    // Load the HTML into DOMDocument
    $dom = new DOMDocument();
    libxml_use_internal_errors(true); // Disable libxml errors
    $dom->loadHTML($formHtml);
    libxml_clear_errors();

    // Use DOMXPath to find the form element
    $xpath = new DOMXPath($dom);
    $form = $xpath->query('//form[@id="submitForm" and contains(@class, "mt-3")]')->item(0);

    if (!$form) {
        http_response_code(404);
        echo json_encode(['error' => 'Form element not found']);
        exit;
    }

    // Extract the children elements of the form
    $children = [];
    foreach ($form->childNodes as $child) {
        $children[] = $dom->saveHTML($child);
    }

    // Return the children elements as JSON response
    echo json_encode($children);
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Invalid request method']);
}

// Function to extract form HTML from file content
function extractFormHtml($content) {
    $matches = [];
    preg_match('/<form id="submitForm" class="mt-3">(.+?)<\/form>/s', $content, $matches);
    return $matches[0] ?? '';
}
?>
