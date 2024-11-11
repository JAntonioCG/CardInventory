<?php
  define('BASE_PATH', __DIR__);

  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
      http_response_code(200);
      exit();
  }

  require_once BASE_PATH . '/simpleRouter.php';
  require_once BASE_PATH . '/controllers/cardController.php';
  require_once BASE_PATH . '/middleware/authMiddleware.php';

  $router = new SimpleRouter();
  $cardController = new cardController();

  $router->get('/cartas', function() use ($cardController) {
    return json_encode($cardController->obtenerCartas());
  });

  $router->post('/carta/detalle', function() use ($cardController) {
    $name = json_decode(file_get_contents("php://input"), true);
    return json_encode($cardController->obtenerCartasPorNombre($name));
  });

  $router->dispatch();

