<?php
require_once BASE_PATH . '/config/database.php';
require_once BASE_PATH . '/interfaces/inventoryInterface.php';

class inventoryRepository implements IInventory {
	private $conn;

	public function __construct() {
		$database = new Database();
		$this->conn = $database->getConnection();
	}

  public function anadirInventario($data) {
    $sql = "INSERT INTO cardinventory (card_id, condition_id, price, stock)
            VALUES (:card_id, :condition_id, :price, :stock)";
    $resultado = $this->conn->prepare($sql);
    $resultado->bindParam(':card_id', $data->card_id);
    $resultado->bindParam(':condition_id', $data->condition_id);
    $resultado->bindParam(':price', $data->price);
    $resultado->bindParam(':stock', $data->stock);
    if ($resultado->execute()) {
      return ['mensaje' => $data];
    }
    return ['mensaje' => 'Error al crear la carta'];
  }
}
