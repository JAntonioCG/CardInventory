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

    public function nuevoId () {
      $sql = "SELECT COUNT(card_id)+1 AS last_ID FROM Cards";
      $resultado = $this->conn->prepare($sql);
      $resultado->execute();
      return $resultado->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerCartasPorNombre($name) {
      // Preparar la consulta SQL para buscar por el nombre de la carta con coincidencias parciales
      $sql = "SELECT 
        e.name AS Expansion,
        se.name AS SubExpansion,
        c.name AS CardName,
        c.card_number AS CardNumber,
        c.rarity AS Rarity,
        c.category AS Category,
        c.card_url AS CardUrl,
        ci.price AS Price,
        ci.stock AS Stock,
        cc.condition_name AS Conditions
          FROM 
              expansions e
          JOIN 
              subexpansions se ON e.expansion_id = se.expansion_id
          JOIN 
              cards c ON se.subexpansion_id = c.subexpansion_id
          JOIN
              cardinventory ci ON c.card_id = ci.card_id
          JOIN
              cardconditions cc ON ci.condition_id = cc.condition_id
          WHERE 
              c.name LIKE ? 
          ORDER BY 
              e.name, se.name, c.card_number;";
  
      // Preparar la consulta
      $resultado = $this->conn->prepare($sql);
  
      // Agregar comodines para la búsqueda parcial
      $param = '%' . $name . '%'; // Comodines '%' antes y después permiten buscar coincidencias parciales
  
      // Ejecutar la consulta
      $resultado->execute([$param]);
  
      // Retornar los resultados
      return $resultado->fetchAll(PDO::FETCH_ASSOC);  // Devuelve todas las coincidencias
    }
  
    public function obtenerCartasPorCategoria($category) {
      // Preparar la consulta SQL para buscar por la categoría
      $sql = "SELECT 
          e.name AS Expansion,
          se.name AS SubExpansion,
          c.name AS CardName,
          c.card_number AS CardNumber,
          c.rarity AS Rarity,
          c.category AS Category,
          c.card_url AS CardUrl,
          ci.price AS Price,
          ci.stock AS Stock,
          cc.condition_name AS Conditions
            FROM 
                expansions e
            JOIN 
                subexpansions se ON e.expansion_id = se.expansion_id
            JOIN 
                cards c ON se.subexpansion_id = c.subexpansion_id
            JOIN
                cardinventory ci ON c.card_id = ci.card_id
            JOIN
                cardconditions cc ON ci.condition_id = cc.condition_id
            WHERE 
              c.category LIKE ?
            ORDER BY 
                e.name, se.name, c.card_number;";

      // Preparar la consulta
      $resultado = $this->conn->prepare($sql);

      // Asociar el término de búsqueda con un parámetro para la categoría
      $param = "%" . $category . "%";  // Esto permite que la búsqueda sea flexible y busque coincidencias parciales

      // Ejecutar la consulta
      $resultado->execute([$param]);

      // Retornar los resultados
      return $resultado->fetchAll(PDO::FETCH_ASSOC);  // Devuelve todas las coincidencias
    }

    public function obtenerCartasPorSubexpansionId($subexpansion_id) {
      $sql = "SELECT * FROM Cards WHERE subexpansion_id LIKE :subexpansion_id";
      $resultado = $this->conn->prepare($sql);
      $searchTerm = "$subexpansion_id";  // Usamos LIKE para hacer coincidencias parciales
      $resultado->bindParam(':subexpansion_id', $searchTerm);
      $resultado->execute();
      return $resultado->fetchAll(PDO::FETCH_ASSOC);  // Usamos fetchAll para devolver todas las coincidencias
    }

    public function agregarCarta ($carta) {
      $sql =  "INSERT INTO cards (card_id, name, subexpansion_id, rarity, category, card_number, card_url) 
              VALUES (:card_id, :name, :subexpansion_id, :rarity, :category, :card_number, :card_url)";
      $resultado = $this->conn->prepare($sql);
      $resultado->bindParam(':card_id', $carta->card_id);
      $resultado->bindParam(':name', $carta->name);
      $resultado->bindParam(':subexpansion_id', $carta->subexpansion_id);
      $resultado->bindParam(':rarity', $carta->rarity);
      $resultado->bindParam(':category', $carta->category);
      $resultado->bindParam(':card_number', $carta->card_number);
      $resultado->bindParam(':card_url', $carta->card_url);
      if ($resultado->execute()) {
        return ['mensaje' => $carta->card_id];
      }
      return ['mensaje' => 'Error al crear la carta'];
    }
  }
