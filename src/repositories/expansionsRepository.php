<?php
  require_once BASE_PATH . '/config/database.php';
  require_once BASE_PATH . '/interfaces/expansionsInterface.php';

  class expansionsRepository implements IExpansions {
    private $conn;

    public function __construct() {
      $database = new Database();
      $this->conn = $database->getConnection();
    }

    public function obtenerCartasPorExpansion($name) {
      // Definir la lista de expansiones que se deben considerar
      $expansions = [
          'Base Set',
          'Black & White',
          'Diamond & Pearl',
          'Expedition Base Set',
          'HeartGold & SoulSilver',
          'Kalos Starter Set',
          'Legendary Collection',
          'Neo Genesis',
          'Platinum',
          'Ruby & Sapphire',
          'Scarlet & Violet',
          'Sun & Moon',
          'Sword & Shield'
      ];
  
      // Construir la parte de la consulta con los nombres de expansión
      $placeholders = implode(',', array_fill(0, count($expansions), '?'));
  
      // Preparar la consulta SQL
      $sql = "SELECT 
                e.name AS Expansion,
                se.name AS SubExpansion,
                c.name AS CardName,
                c.card_number AS CardNumber,
                c.rarity AS Rarity,
                c.category AS Category
            FROM 
                expansions e
            JOIN 
                subexpansions se ON e.expansion_id = se.expansion_id
            JOIN 
                cards c ON se.subexpansion_id = c.subexpansion_id
            WHERE 
                e.name IN ($placeholders)
            AND 
                e.name LIKE ?
            ORDER BY 
                e.name, se.name, c.card_number;";
  
      // Preparar la consulta
      $resultado = $this->conn->prepare($sql);
  
      // Asociar los valores de expansión y el término de búsqueda
      $params = array_merge($expansions, ["%$name%"]);
  
      // Ejecutar la consulta con los parámetros
      $resultado->execute($params);
  
      // Retornar los resultados
      return $resultado->fetchAll(PDO::FETCH_ASSOC);  // Usamos fetchAll para devolver todas las coincidencias
  }
  
  
  }
