<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Get the path from the query parameter
    $path = isset($_GET['path']) ? $_GET['path'] : '.';

    // Check if the path is a directory
    if (!is_dir($path)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid directory path']);
        exit;
    }

    // Get the list of directories
    $directories = array_filter(glob($path . '/*'), 'is_dir');
    
    // Get only the directory names
    $directoryNames = array_map('basename', $directories);

    // Return the directory names as a JSON response
    echo json_encode($directoryNames);
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Invalid request method']);
}
?>
