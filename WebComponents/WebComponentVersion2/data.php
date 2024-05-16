<?php
header('Content-Type: application/json');

$jsonFile = __DIR__ . '/cuentas.json';

// Verifico si el archivo centas.json existe
if (!file_exists($jsonFile)) {
    echo json_encode(['error' => 'El archivo cuentas.json no existe.']);
    exit;
}

$jsonData = file_get_contents($jsonFile);

$data = json_decode($jsonData, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['error' => 'Error al decodificar el JSON.']);
    exit;
}

echo json_encode($data['cuentas']);
?>
