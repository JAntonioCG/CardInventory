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
      $sql = "SELECT * FROM Cards WHERE name = :name";
      $resultado = $this->conn->prepare($sql);
      $resultado->bindParam(':name', $name);
      $resultado->execute();
      return $resultado->fetch(PDO::FETCH_ASSOC);
    }
  }
