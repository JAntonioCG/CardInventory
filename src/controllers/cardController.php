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
      return $this->cardRepository->obtenerCartasPorNombre($name);
    }
  }
