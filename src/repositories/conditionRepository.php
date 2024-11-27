<?php
require_once BASE_PATH . '/config/database.php';
require_once BASE_PATH . '/interfaces/conditionInterface.php';

class conditionRepository implements ICondition {
	private $conn;

	public function __construct() {
		$database = new Database();
		$this->conn = $database->getConnection();
	}

  public function obtenerCondiciones() {
    $sql = "SELECT * FROM cardconditions";
    $resultado = $this->conn->prepare($sql);
    $resultado->execute();
    return $resultado->fetchAll(PDO::FETCH_ASSOC);
  }
}
