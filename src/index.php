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
  require_once BASE_PATH . '/controllers/expansionsController.php';
  require_once BASE_PATH . '/middleware/authMiddleware.php';

  $router = new SimpleRouter();
  $cardController = new cardController();
  $expansionsController = new expansionsController();

  $router->get('/cartas', function() use ($cardController) {
    return json_encode($cardController->obtenerCartas());
  });

  $router->post('/cartas/nombre', function() use ($cardController) {
    $name = json_decode(file_get_contents("php://input"), true);
    return json_encode($cardController->obtenerCartasPorNombre($name['name']));
  });

  $router->post('/cartas/category', function() use ($cardController) {
    $category= json_decode(file_get_contents("php://input"), true);
    return json_encode($cardController->obtenerCartasPorCategoria($category['category']));
  });

  $router->post('/cartas/subexpansion', function() use ($cardController) {
    $subexpansion_id = json_decode(file_get_contents("php://input"), true);
    return json_encode($cardController->obtenerCartasPorSubexpansion($subexpansion_id['subexpansion_id']));
  });

  $router->post('/cartas/expansion', function() use ($expansionsController) {
    $name = json_decode(file_get_contents("php://input"), true);
    return json_encode($expansionsController->obtenerCartasPorExpansion($name['name']));
  });
  
  $router->dispatch();

