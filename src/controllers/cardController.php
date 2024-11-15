<?php
  require BASE_PATH . '/repositories/cardRepository.php';
  require BASE_PATH . '/models/cardModel.php';

  class cardController {
    private $cardRepository;

    public function __construct() {
      $this->cardRepository = new cardRepository();
    }

    public function obtenerCartas() {
      return $this->cardRepository->obtenerCartas();
    }

    public function obtenerCartasPorNombre($name) {
      return $this->cardRepository->obtenerCartasPorNombre($name);  // Esto debería devolver un array de cartas
    }
    
    public function obtenerCartasPorCategoria($category) {
      return $this->cardRepository->obtenerCartasPorCategoria($category);  // Devolverá un array de cartas
    }    
    public function obtenerCartasPorExpancion($Expancion) {
      return $this->cardRepository->obtenerCartasPorExpancion($Expancion);  // Devolverá un array de cartas
    } 
    public function obtenerCartasPorExpanciont ($Expancion) {
      return $this->cardRepository->obtenerCartasPorExpancion($Expancion);  // Devolverá un array de cartas
    } 
    public function obtenerCartasPorExpancions ($Expancion) {
      return $this->cardRepository->obtenerCartasPorExpancion($Expancion);  // Devolverá un array de cartas
    }  
  }
