DROP DATABASE IF EXISTS cardInventory_db;
CREATE DATABASE IF NOT EXISTS cardInventory_db;
USE cardInventory_db;

-- Tabla para almacenar las expansiones principales
CREATE TABLE Expansions (
    expansion_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    CONSTRAINT unique_expansion UNIQUE (name)
);

-- Tabla para almacenar las subexpansiones relacionadas con cada expansión principal
CREATE TABLE Subexpansions (
    subexpansion_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    expansion_id INT NOT NULL,
    CONSTRAINT unique_subexpansion UNIQUE (name, expansion_id),
    FOREIGN KEY (expansion_id) REFERENCES Expansions(expansion_id)
);

-- Tabla para almacenar las cartas, cada carta pertenece a una subexpansión
CREATE TABLE Cards (
    card_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    subexpansion_id INT NOT NULL,
    rarity VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    card_number VARCHAR(20) NOT NULL,
    FOREIGN KEY (subexpansion_id) REFERENCES Subexpansions(subexpansion_id),
    UNIQUE (name, subexpansion_id, card_number)  -- Cada carta debe ser única en su subexpansión
);

-- Tabla para almacenar los estados de conservación de las cartas
CREATE TABLE CardConditions (
    condition_id INT AUTO_INCREMENT PRIMARY KEY,
    condition_name VARCHAR(50) NOT NULL,
    description TEXT,
    CONSTRAINT unique_condition UNIQUE (condition_name)
);

-- Insertar los posibles estados de conservación
INSERT INTO CardConditions (condition_name, description)
VALUES 
    ('Mint', 'Perfecta'),
    ('Near Mint', 'Fresca de refuerzo'),
    ('Excellent', 'Desgaste menor'),
    ('Good', 'Desgaste visible'),
    ('Light Played', 'Desgaste severo'),
    ('Played', 'Dañada'),
    ('Poor', 'Destruida');

-- Tabla para el inventario de cartas con su estado y precio
CREATE TABLE CardInventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    card_id INT NOT NULL,
    condition_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    FOREIGN KEY (card_id) REFERENCES Cards(card_id),
    FOREIGN KEY (condition_id) REFERENCES CardConditions(condition_id),
    UNIQUE (card_id, condition_id)
);

-- Procedimiento para agregar una nueva carta a una subexpansión específica en el inventario
DELIMITER //

CREATE PROCEDURE AddCardToInventory (
    IN mainExpansion VARCHAR(100),
    IN subExpansion VARCHAR(100),
    IN cardName VARCHAR(100),
    IN cardRarity VARCHAR(50),
    IN cardCategory VARCHAR(50),
    IN cardNumber VARCHAR(20),
    IN cardCondition VARCHAR(50),
    IN cardPrice DECIMAL(10, 2),
    IN cardStock INT
)
BEGIN
    DECLARE expansionID INT;
    DECLARE subexpansionID INT;
    DECLARE cardID INT;
    DECLARE conditionID INT;

    -- Verifica o inserta la expansión principal
    SELECT expansion_id INTO expansionID FROM Expansions WHERE name = mainExpansion;
    IF expansionID IS NULL THEN
        INSERT INTO Expansions (name) VALUES (mainExpansion);
        SET expansionID = LAST_INSERT_ID();
    END IF;

    -- Verifica o inserta la subexpansión
    SELECT subexpansion_id INTO subexpansionID FROM Subexpansions WHERE name = subExpansion AND expansion_id = expansionID;
    IF subexpansionID IS NULL THEN
        INSERT INTO Subexpansions (name, expansion_id) VALUES (subExpansion, expansionID);
        SET subexpansionID = LAST_INSERT_ID();
    END IF;

    -- Verifica o inserta la carta
    SELECT card_id INTO cardID FROM Cards WHERE name = cardName AND subexpansion_id = subexpansionID AND card_number = cardNumber;
    IF cardID IS NULL THEN
        INSERT INTO Cards (name, subexpansion_id, rarity, category, card_number)
        VALUES (cardName, subexpansionID, cardRarity, cardCategory, cardNumber);
        SET cardID = LAST_INSERT_ID();
    END IF;

    -- Verifica el estado de conservación
    SELECT condition_id INTO conditionID FROM CardConditions WHERE condition_name = cardCondition;
    IF conditionID IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Estado de conservación de carta no válido';
    END IF;

    -- Inserta o actualiza el inventario de la carta
    INSERT INTO CardInventory (card_id, condition_id, price, stock)
    VALUES (cardID, conditionID, cardPrice, cardStock)
    ON DUPLICATE KEY UPDATE price = cardPrice, stock = stock + cardStock;
END //

DELIMITER ;

-- Crea todas las categorías principales
INSERT INTO Expansions (name) VALUES
    ('Base Set'),
    ('Neo Genesis'),
    ('Legendary Collection'),
    ('Expedition Base Set'),
    ('Ruby & Sapphire'),
    ('Diamond & Pearl'),
    ('Platinum'),
    ('HeartGold & SoulSilver'),
    ('Black & White'),
    ('Kalos Starter Set'),
    ('Sun & Moon'),
    ('Sword & Shield'),
    ('Scarlet & Violet');

-- Crea las subcategorías, vinculándolas con las categorías principales mediante sus IDs
INSERT INTO SubExpansions (expansion_id, name) VALUES
    ((SELECT expansion_id FROM Expansions WHERE name = 'Base Set'), 'Base Set'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Base Set'), 'Jungle'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Base Set'), 'Fossil'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Base Set'), 'Base Set 2'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Base Set'), 'Team Rocket'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Base Set'), 'Gym Heroes'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Base Set'), 'Gym Challenge'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Neo Genesis'), 'Neo Genesis'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Neo Genesis'), 'Neo Discovery'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Neo Genesis'), 'Neo Revelation'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Neo Genesis'), 'Neo Destiny'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Legendary Collection'), 'Legendary Collection'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Expedition Base Set'), 'Expedition Base Set'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Expedition Base Set'), 'Aquapolis'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Expedition Base Set'), 'Skyridge'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Ruby & Sapphire'), 'Ruby & Sapphire'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Ruby & Sapphire'), 'Sandstorm'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Ruby & Sapphire'), 'Dragon'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Ruby & Sapphire'), 'Team Magma vs Team Aqua'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Ruby & Sapphire'), 'Hidden Legends'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Ruby & Sapphire'), 'FireRed & LeafGreen'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Ruby & Sapphire'), 'Team Rocket Returns'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Ruby & Sapphire'), 'Deoxys'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Ruby & Sapphire'), 'Emerald'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Ruby & Sapphire'), 'Unseen Forces'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Ruby & Sapphire'), 'Delta Species'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Ruby & Sapphire'), 'Legend Maker'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Ruby & Sapphire'), 'Holon Phantoms'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Ruby & Sapphire'), 'Crystal Guardians'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Ruby & Sapphire'), 'Dragon Frontiers'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Ruby & Sapphire'), 'Power Keepers'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Diamond & Pearl'), 'Diamond & Pearl'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Diamond & Pearl'), 'Mysterious Treasures'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Diamond & Pearl'), 'Secret Wonders'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Diamond & Pearl'), 'Great Encounters'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Diamond & Pearl'), 'Majestic Dawn'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Diamond & Pearl'), 'Legends Awakened'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Diamond & Pearl'), 'Stormfront'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Platinum'), 'Platinum'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Platinum'), 'Rising Rivals'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Platinum'), 'Supreme Victors'),
    ((SELECT expansion_id FROM Expansions WHERE name = 'Platinum'), 'Arceus'),
	((SELECT expansion_id FROM Expansions WHERE name = 'HeartGold & SoulSilver'), 'HeartGold & SoulSilver'),
	((SELECT expansion_id FROM Expansions WHERE name = 'HeartGold & SoulSilver'), 'Unleashed'),
	((SELECT expansion_id FROM Expansions WHERE name = 'HeartGold & SoulSilver'), 'Undaunted'),
	((SELECT expansion_id FROM Expansions WHERE name = 'HeartGold & SoulSilver'), 'Triumphant'),
	((SELECT expansion_id FROM Expansions WHERE name = 'HeartGold & SoulSilver'), 'Call of Legends'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Black & White'), 'Black & White'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Black & White'), 'Emerging Powers'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Black & White'), 'Noble Victories'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Black & White'), 'Next Destinies'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Black & White'), 'Dark Explorers'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Black & White'), 'Dragons Exalted'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Black & White'), 'Dragon Vault'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Black & White'), 'Boundaries Crossed'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Black & White'), 'Plasma Storm'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Black & White'), 'Plasma Freeze'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Black & White'), 'Plasma Blast'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Black & White'), 'Legendary Treasures'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Kalos Starter Set'), 'Kalos Starter Set'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Kalos Starter Set'), 'XY'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Kalos Starter Set'), 'Flashfire'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Kalos Starter Set'), 'Furious Fists'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Kalos Starter Set'), 'Phantom Forces'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Kalos Starter Set'), 'Primal Clash'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Kalos Starter Set'), 'Double Crisis'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Kalos Starter Set'), 'Roaring Skies'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Kalos Starter Set'), 'Ancient Origins'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Kalos Starter Set'), 'BREAKthrough'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Kalos Starter Set'), 'BREAKpoint'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Kalos Starter Set'), 'Generations'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Kalos Starter Set'), 'Fates Collide'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Kalos Starter Set'), 'Steam Siege'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Kalos Starter Set'), 'Evolutions'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sun & Moon'), 'Sun & Moon'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sun & Moon'), 'Guardians Rising'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sun & Moon'), 'Burning Shadows'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sun & Moon'), 'Shining Legends'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sun & Moon'), 'Crimson Invasion'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sun & Moon'), 'Ultra Prism'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sun & Moon'), 'Forbidden Light'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sun & Moon'), 'Celestial Storm'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sun & Moon'), 'Dragon Majesty'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sun & Moon'), 'Lost Thunder'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sun & Moon'), 'Team Up'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sun & Moon'), 'Detective Pikachu'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sun & Moon'), 'Unbroken Bonds'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sun & Moon'), 'Unified Minds'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sun & Moon'), 'Hidden Fates'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sun & Moon'), 'Cosmic Eclipse'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sword & Shield'), 'Sword & Shield'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sword & Shield'), 'Rebel Clash'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sword & Shield'), 'Darkness Ablaze'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sword & Shield'), 'Champions Path'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sword & Shield'), 'Vivid Voltage'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sword & Shield'), 'Shining Fates'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sword & Shield'), 'Battle Styles'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sword & Shield'), 'Chilling Reign'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sword & Shield'), 'Evolving Skies'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sword & Shield'), 'Celebrations'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sword & Shield'), 'Fusion Strike'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sword & Shield'), 'Brilliant Stars'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sword & Shield'), 'Astral Radiance'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sword & Shield'), 'Pokémon GO'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sword & Shield'), 'Lost Origin'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sword & Shield'), 'Silver Tempest'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Sword & Shield'), 'Crown Zenith'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Scarlet & Violet'), 'Scarlet & Violet'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Scarlet & Violet'), 'Paldea Evolved'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Scarlet & Violet'), 'Obsidian Flames'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Scarlet & Violet'), '151'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Scarlet & Violet'), 'Paradox Rift'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Scarlet & Violet'), 'Paldean Fates'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Scarlet & Violet'), 'Temporal Forces'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Scarlet & Violet'), 'Twilight Masquerade'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Scarlet & Violet'), 'Shrouded Fable'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Scarlet & Violet'), 'Stellar Crown'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Scarlet & Violet'), 'Surging Sparks'),
	((SELECT expansion_id FROM Expansions WHERE name = 'Scarlet & Violet'), 'Prismatic Evolutions');



/*
CALL AddCardToInventory(
    'Sword & Shield',  -- Expansión principal
    'Evolving Skies',  -- Subexpansión
    'Pinsir',          -- Nombre de la carta
    'Common',          -- Rareza
    'Plant',           -- Categoría (tipo)
    '001/203',         -- Número de carta
    'Near Mint',       -- Estado de conservación
    5.00,              -- Precio
    10                 -- Stock
);
*/

/*
CALL AddCardToInventory(
    'Sword & Shield',  -- Expansión principal
    'Evolving Skies',  -- Subexpansión
    'Pinsir',          -- Nombre de la carta
    'Common',          -- Rareza
    'Plant',           -- Categoría (tipo)
    '001/203',         -- Número de carta
    'Near Mint',       -- Estado de conservación
    5.00,              -- Precio
    10                 -- Stock
);
*/

-- Una carta puede tener mas de un estado de conservacion
-- Una carta puede tener mas de un solo precio
-- Una carta con el mismo nombre es la misma carta a menos de que sea otra rareza
