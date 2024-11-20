<?php
  require BASE_PATH . '/repositories/expansionsRepository.php';
  require BASE_PATH . '/models/expansionsModel.php';

  class expansionsController {
    private $expansionsRepository;

    public function __construct() {
      $this->expansionsRepository = new expansionsRepository();
    }
    
    public function obtenerExpansiones() {
      return $this->expansionsRepository->obtenerExpansiones(); // Devolverá un array de cartas
    }

    public function obtenerCartasPorExpansion ($name) {
      return $this->expansionsRepository->obtenerCartasPorExpansion($name);  // Devolverá un array de cartas
    }  
  }
