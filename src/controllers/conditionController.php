<?php
require BASE_PATH . '/repositories/conditionRepository.php';
require BASE_PATH . '/models/conditionModel.php';

class conditionController {
  private $conditionRepository;

  public function __construct() {
    $this->conditionRepository = new conditionRepository();
  }

  public function obtenerCondiciones() {
    return $this->conditionRepository->obtenerCondiciones();
  }
}