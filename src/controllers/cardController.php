<?php
  require BASE_PATH . '/repositories/cardRepository.php';
  require BASE_PATH . '/models/cardModel.php';

  class cardController {
    private $cardRepository;

    public function __construct() {
      $this->cardRepository = new cardRepository();
    }

    public function agregarCarta($carta) {
      return $this->cardRepository->agregarCarta($carta);
    }

    public function obtenerCartas() {
      return $this->cardRepository->obtenerCartas();
    }

    public function nuevoId() {
      return $this->cardRepository->nuevoId();
    }

    public function obtenerCartasPorNombre($name) {
      return $this->cardRepository->obtenerCartasPorNombre($name);  // Esto debería devolver un array de cartas
    }
    
    public function obtenerCartasPorCategoria($category) {
      return $this->cardRepository->obtenerCartasPorCategoria($category);  // Devolverá un array de cartas
    }    
    public function obtenerCartasPorSubexpansionId($subexpansion_id) {
      return $this->cardRepository->obtenerCartasPorSubexpansionId($subexpansion_id);  // Devolverá un array de cartas
    } 
  }
