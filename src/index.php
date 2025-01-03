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
  require_once BASE_PATH . '/controllers/conditionController.php';
  require_once BASE_PATH . '/controllers/inventoryController.php';
  require_once BASE_PATH . '/controllers/expansionsController.php';
  require_once BASE_PATH . '/controllers/subexpansionsController.php';
  require_once BASE_PATH . '/middleware/authMiddleware.php';

  $router = new SimpleRouter();
  $cardController = new cardController();
  $conditionController = new conditionController();
  $inventoryController = new inventoryController();
  $expansionsController = new expansionsController();
  $subexpansionsController = new subexpansionsController();

  $router->get('/cartas', function() use ($cardController) {
    return json_encode($cardController->obtenerCartas());
  });

  $router->get('/cartas/newId', function() use ($cardController) {
    return json_encode($cardController->nuevoId());
  });

  $router->get('/condiciones', function() use ($conditionController) {
    return json_encode($conditionController->obtenerCondiciones());
  });

  $router->get('/expansiones', function() use ($expansionsController) {
    return json_encode($expansionsController->obtenerExpansiones());
  });

  $router->get('/subexpansiones', function() use ($subexpansionsController) {
    return json_encode($subexpansionsController->obtenerSubexpansiones());
  });

  $router->post('/subexpansiones/expansion_id', function() use ($subexpansionsController) {
    $data = json_decode(file_get_contents("php://input"), true);
    $expansion_id = $data['expansion_id'];  // Asegúrate de que 'expansion_id' esté presente en el cuerpo de la solicitud
    return json_encode($subexpansionsController->obtenerSubexpansionesPorExpansion($expansion_id));
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

  $router->post('/cartas/subexpansionId', function() use ($cardController) {
    $subexpansion_id = json_decode(file_get_contents("php://input"), true);
    return json_encode($cardController->obtenerCartasPorSubexpansionId($subexpansion_id['subexpansion_id']));
  });
  
  $router->post('/cartas/expansion', function() use ($expansionsController) {
    $name = json_decode(file_get_contents("php://input"), true);
    return json_encode($expansionsController->obtenerCartasPorExpansion($name['name']));
  });
  
  $router->post('/cartas/insertar', function() use ($cardController) {
    $carta = json_decode(file_get_contents("php://input"));
    return json_encode($cardController->agregarCarta($carta));
  });
  
  $router->post('/inventory/insertar', function() use ($inventoryController) {
    $data = json_decode(file_get_contents("php://input"));
    if (!$data || !isset($data->card_id, $data->condition_id, $data->price, $data->stock)) {
        return json_encode([
            'error' => true,
            'mensaje' => 'Datos inválidos o incompletos en la solicitud.'
        ]);
    }
    return json_encode($inventoryController->anadirInventario($data));
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
        return json_encode(["error" => "Faltan parametros necesarios: name o expansion_id."]);
    }
  });

  $router->dispatch();