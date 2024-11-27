<?php
require BASE_PATH . '/repositories/inventoryRepository.php';
require BASE_PATH . '/models/inventoryModel.php';

class inventoryController {
  private $inventoryRepository;

  public function __construct() {
    $this->inventoryRepository = new inventoryRepository();
  }

  public function anadirInventario($data) {
    return $this->inventoryRepository->anadirInventario($data);
  }
}