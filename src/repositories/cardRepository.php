<?php
  require_once BASE_PATH . '/config/database.php';
  require_once BASE_PATH . '/interfaces/cardInterface.php';

  class cardRepository implements ICarta {
    private $conn;

    public function __construct() {
      $database = new Database();
      $this->conn = $database->getConnection();
    }

    public function obtenerCartas() {
      $sql = "SELECT * FROM Cards";
      $resultado = $this->conn->prepare($sql);
      $resultado->execute();
      return $resultado->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerCartasPorNombre($name) {
      $sql = "SELECT * FROM Cards WHERE name LIKE :name";
      $resultado = $this->conn->prepare($sql);
      $searchTerm = "%$name%";  // Usamos LIKE para hacer coincidencias parciales
      $resultado->bindParam(':name', $searchTerm);
      $resultado->execute();
      return $resultado->fetchAll(PDO::FETCH_ASSOC);  // Usamos fetchAll para devolver todas las coincidencias
    }
    
    
  }
