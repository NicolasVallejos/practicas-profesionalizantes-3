<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "cuentas_db";

$conn = new mysqli($servername, $username, $password);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

$db_created = false;
$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($conn->query($sql) === TRUE) {
    $db_created = true;
} else {
    echo json_encode(['error' => 'Error creating database: ' . $conn->error]);
    exit;
}

$conn->close();

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

$table_created = false;
$table_check_sql = "SHOW TABLES LIKE 'cuentas'";
$result = $conn->query($table_check_sql);

if ($result->num_rows == 0) {
    $sql = "CREATE TABLE cuentas (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(30) NOT NULL,
        saldo FLOAT NOT NULL
    )";

    if ($conn->query($sql) === TRUE) {
        $table_created = true;
    } else {
        echo json_encode(['error' => 'Error creating table: ' . $conn->error]);
        exit;
    }
}

if ($table_created) {
    $json_data = file_get_contents(__DIR__ . '/cuentas.json');  // Ruta relativa
    $cuentas = json_decode($json_data, true)['cuentas'];

    foreach ($cuentas as $cuenta) {
        $username = $cuenta['username'];
        $saldo = floatval(str_replace('$', '', $cuenta['saldo']));

        $sql = "INSERT INTO cuentas (username, saldo) VALUES ('$username', $saldo)";
        $conn->query($sql);
    }
}

// Manejo de opciones
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'list':
        listAccounts($conn);
        break;
    case 'create':
        createAccount($conn);
        break;
    case 'edit':
        editAccount($conn);
        break;
    case 'delete':
        deleteAccount($conn);
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}

$conn->close();

function listAccounts($conn) {
    $sql = "SELECT * FROM cuentas";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $accounts = [];
        while($row = $result->fetch_assoc()) {
            $accounts[] = $row;
        }
        echo json_encode($accounts);
    } else {
        echo json_encode([]);
    }
}

function createAccount($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'];
    $saldo = $data['saldo'];

    $sql = "INSERT INTO cuentas (username, saldo) VALUES ('$username', $saldo)";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['id' => $conn->insert_id]);
    } else {
        echo json_encode(['error' => 'Error: ' . $sql . '<br>' . $conn->error]);
    }
}

function editAccount($conn) {
    $id = $_GET['id'];
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'];
    $saldo = $data['saldo'];

    $sql = "UPDATE cuentas SET username='$username', saldo=$saldo WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['changes' => $conn->affected_rows]);
    } else {
        echo json_encode(['error' => 'Error: ' . $sql . '<br>' . $conn->error]);
    }
}

function deleteAccount($conn) {
    $id = $_GET['id'];

    $sql = "DELETE FROM cuentas WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['changes' => $conn->affected_rows]);
    } else {
        echo json_encode(['error' => 'Error: ' . $sql . '<br>' . $conn->error]);
    }
}
?>
