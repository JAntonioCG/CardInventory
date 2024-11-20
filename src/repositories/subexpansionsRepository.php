<?php
require_once BASE_PATH . '/config/database.php';
require_once BASE_PATH . '/interfaces/subexpansionsInterface.php';

class subexpansionsRepository implements ISubexpansions {
	private $conn;

	public function __construct() {
		$database = new Database();
		$this->conn = $database->getConnection();
	}

  public function obtenerSubexpansiones() {
    $sql = "SELECT name FROM subexpansions";
    $resultado = $this->conn->prepare($sql);
    $resultado->execute();
    return $resultado->fetchAll(PDO::FETCH_ASSOC);
  }

  public function obtenerCartasPorSubexpansion($name){
        // Definir la lista de expansiones que se deben considerar
        $subexpansions = ['Base Set', 'Jungle', 'Fossil', 'Base Set 2', 'Team Rocket', 'Gym Heroes', 'Gym Challenge', 'Neo Genesis',
                          'Neo Discovery', 'Neo Revelation', 'Neo Destiny', 'Legendary Collection', 'Expedition Base Set', 'Aquapolis',
                          'Skyridge', 'Ruby & Sapphire', 'Sandstorm', 'Dragon', 'Team Magma vs Team Aqua', 'Hidden Legends', 
                          'FireRed & LeafGreen', 'Team Rocket Returns', 'Deoxys', 'Emerald', 'Unseen Forces', 'Delta Species',
                          'Legend Maker', 'Holon Phantoms', 'Crystal Guardians', 'Dragon Frontiers', 'Power Keepers', 'Diamond & Pearl',
                          'Mysterious Treasures', 'Secret Wonders', 'Great Encounters', 'Majestic Dawn', 'Legends Awakened', 'Stormfront',
                          'Platinum', 'Rising Rivals', 'Supreme Victors', 'Arceus', 'HeartGold & SoulSilver', 'Unleashed', 'Undaunted',
                          'Triumphant', 'Call of Legends', 'Black & White', 'Emerging Powers', 'Noble Victories', 'Next Destinies',
                          'Dark Explorers', 'Dragons Exalted', 'Dragon Vault', 'Boundaries Crossed', 'Plasma Storm', 'Plasma Freeze',
                          'Plasma Blast', 'Legendary Treasures', 'Kalos Starter Set', 'XY', 'Flashfire', 'Furious Fists',
                          'Phantom Forces', 'Primal Clash', 'Double Crisis', 'Roaring Skies', 'Ancient Origins', 'BREAKthrough',
                          'BREAKpoint', 'Generations', 'Fates Collide', 'Steam Siege', 'Evolutions', 'Sun & Moon',
                          'Guardians Rising', 'Burning Shadows', 'Shining Legends', 'Crimson Invasion', 'Ultra Prism',
                          'Forbidden Light', 'Celestial Storm', 'Dragon Majesty', 'Lost Thunder', 'Team Up', 'Detective Pikachu',
                          'Unbroken Bonds', 'Unified Minds', 'Hidden Fates', 'Cosmic Eclipse', 'Sword & Shield', 'Rebel Clash',
                          'Darkness Ablaze', 'Champions Path', 'Vivid Voltage', 'Shining Fates', 'Battle Styles', 'Chilling Reign',
                          'Evolving Skies', 'Celebrations', 'Fusion Strike', 'Brilliant Stars', 'Astral Radiance', 'Pokémon GO',
                          'Lost Origin', 'Silver Tempest', 'Crown Zenith', 'Scarlet & Violet', 'Paldea Evolved', 'Obsidian Flames',
                          '151', 'Paradox Rift', 'Paldean Fates', 'Temporal Forces', 'Twilight Masquerade', 'Shrouded Fable',
                          'Stellar Crown', 'Surging Sparks', 'Prismatic Evolutions'];
    
        // Construir la parte de la consulta con los nombres de expansión
        $placeholders = implode(',', array_fill(0, count($subexpansions), '?'));

        // Preparar la consulta SQL
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
                    se.name IN ($placeholders)
                AND 
                    se.name LIKE ?
                ORDER BY 
                    e.name, se.name, c.card_number;";
        
        // Preparar la consulta
        $resultado = $this->conn->prepare($sql);

        // Asociar los valores de expansión y el término de búsqueda
        $params = array_merge($subexpansions, ["%$name%"]);

        // Ejecutar la consulta con los parámetros
        $resultado->execute($params);

        // Retornar los resultados
        return $resultado->fetchAll(PDO::FETCH_ASSOC);
    }
}
