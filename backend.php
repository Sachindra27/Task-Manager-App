<?php
header('Content-Type: application/json');
require 'database.php';

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'create':
            $stmt = $conn->prepare("INSERT INTO tasks (title, priority, deadline) VALUES (?, ?, ?)");
            $stmt->execute([
                $_POST['title'],
                $_POST['priority'] ?? 'medium',
                $_POST['deadline'] ?? null
            ]);
            echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
            break;

        case 'read':
            $stmt = $conn->query("SELECT * FROM tasks ORDER BY created_at DESC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'update':
            $stmt = $conn->prepare("UPDATE tasks SET status = ? WHERE id = ?");
            $stmt->execute([$_POST['status'], $_POST['id']]);
            echo json_encode(['success' => true]);
            break;

        case 'delete':
            $stmt = $conn->prepare("DELETE FROM tasks WHERE id = ?");
            $stmt->execute([$_POST['id']]);
            echo json_encode(['success' => true]);
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>