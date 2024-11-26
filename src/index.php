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
  require_once BASE_PATH . '/controllers/subexpansionsController.php';
  require_once BASE_PATH . '/middleware/authMiddleware.php';

  $router = new SimpleRouter();
  $cardController = new cardController();
  $expansionsController = new expansionsController();
  $subexpansionsController = new subexpansionsController();

  $router->get('/cartas', function() use ($cardController) {
    return json_encode($cardController->obtenerCartas());
  });

  $router->get('/expansiones', function() use ($expansionsController) {
    return json_encode($expansionsController->obtenerExpansiones());
  });

  $router->get('/subexpansiones', function() use ($subexpansionsController) {
    return json_encode($subexpansionsController->obtenerSubexpansiones());
  });

  $router->post('/cartas/nombre', function() use ($cardController) {
    $name = json_decode(file_get_contents("php://input"), true);
    return json_encode($cardController->obtenerCartasPorNombre($name['name']));
  });

  $router->post('/cartas/category', function() use ($cardController) {
    $category= json_decode(file_get_contents("php://input"), true);
    return json_encode($cardController->obtenerCartasPorCategoria($category['category']));
  });

  $router->post('/cartas/subexpansion', function() use ($subexpansionsController) {
    $name = json_decode(file_get_contents("php://input"), true);
    return json_encode($subexpansionsController->obtenerCartasPorSubexpansion($name['name']));
  });
  
  $router->post('/cartas/expansion', function() use ($expansionsController) {
    $name = json_decode(file_get_contents("php://input"), true);
    return json_encode($expansionsController->obtenerCartasPorExpansion($name['name']));
  });
  
  $router->post('/expansion/insertar', function() use ($expansionsController) {
    $name = json_decode(file_get_contents("php://input"), true);
    return json_encode($expansionsController->crearExpansion($name['name']));
  });
  
  $router->post('/subexpansion/insertar', function() use ($subexpansionsController) {
    // Obtener los datos enviados en el cuerpo de la solicitud como un array asociativo
    $data = json_decode(file_get_contents("php://input"), true);

    // Comprobar que los datos necesarios estén presentes
    if (isset($data['name']) && isset($data['expansion_id'])) {
        // Llamar a la función con ambos parámetros: name y expansion_id
        $resultado = $subexpansionsController->crearSubExpansion($data['name'], $data['expansion_id']);
        
        // Retornar un JSON con el resultado
        return json_encode(["success" => $resultado]);
    } else {
        // Si faltan datos, devolver un error
        return json_encode(["error" => "Faltan parámetros necesarios: name o expansion_id."]);
    }
});


  $router->dispatch();

