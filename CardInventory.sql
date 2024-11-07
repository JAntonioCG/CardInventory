DROP DATABASE IF EXISTS cardInventory_db;
CREATE DATABASE IF NOT EXISTS cardInventory_db;
USE cardInventory_db;

-- Tabla para almacenar las cartas
CREATE TABLE Cards (
    card_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    expansion VARCHAR(100) NOT NULL,
    rarity VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL
);

-- Tabla para almacenar los estados de conservación de las cartas
CREATE TABLE CardConditions (
    condition_id INT AUTO_INCREMENT PRIMARY KEY,
    condition_name VARCHAR(50) NOT NULL,
    description TEXT,
    CONSTRAINT unique_condition UNIQUE (condition_name)
);

-- Insertamos los posibles estados de las cartas en la tabla CardConditions
INSERT INTO CardConditions (condition_name, description)
VALUES 
    ('Mint', 'Perfecta'),
    ('Near Mint', 'Fresca de refuerzo'),
    ('Excellent', 'Desgaste menor'),
    ('Good', 'Desgaste visible'),
    ('Light Played', 'Desgaste severo'),
    ('Played', 'Dañada'),
    ('Poor', 'Destruida');

-- Tabla para almacenar los detalles de inventario, incluyendo el estado y precio de cada carta
CREATE TABLE CardInventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    card_id INT NOT NULL,
    condition_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    FOREIGN KEY (card_id) REFERENCES Cards(card_id),
    FOREIGN KEY (condition_id) REFERENCES CardConditions(condition_id),
    UNIQUE (card_id, condition_id) -- Cada carta solo puede tener un estado único en esta tabla
);

-- Función para agregar una nueva carta al inventario con un estado específico
DELIMITER //

CREATE PROCEDURE AddCardToInventory (
    IN cardName VARCHAR(100),
    IN cardExpansion VARCHAR(100),
    IN cardRarity VARCHAR(50),
    IN cardCategory VARCHAR(50),
    IN cardCondition VARCHAR(50),
    IN cardPrice DECIMAL(10, 2),
    IN cardStock INT
)
BEGIN
    DECLARE cardID INT;
    DECLARE conditionID INT;

    -- Verifica si la carta ya existe
    SELECT card_id INTO cardID FROM Cards WHERE name = cardName AND expansion = cardExpansion;

    -- Si la carta no existe, la insertamos
    IF cardID IS NULL THEN
        INSERT INTO Cards (name, expansion, rarity, category)
        VALUES (cardName, cardExpansion, cardRarity, cardCategory);
        SET cardID = LAST_INSERT_ID();
    END IF;

    -- Verifica si el estado de la carta existe
    SELECT condition_id INTO conditionID FROM CardConditions WHERE condition_name = cardCondition;

    -- Si el estado no existe, se termina la operación
    IF conditionID IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Estado de carta no válido';
    END IF;

    -- Agrega o actualiza el inventario de la carta con el estado específico
    INSERT INTO CardInventory (card_id, condition_id, price, stock)
    VALUES (cardID, conditionID, cardPrice, cardStock)
    ON DUPLICATE KEY UPDATE price = cardPrice, stock = stock + cardStock;
END //

DELIMITER ;

-- Función para actualizar el stock de una carta específica
DELIMITER //

CREATE PROCEDURE UpdateCardStock (
    IN cardName VARCHAR(100),
    IN cardExpansion VARCHAR(100),
    IN cardCondition VARCHAR(50),
    IN newStock INT
)
BEGIN
    DECLARE cardID INT;
    DECLARE conditionID INT;

    -- Obtiene el ID de la carta y el ID del estado
    SELECT card_id INTO cardID FROM Cards WHERE name = cardName AND expansion = cardExpansion;
    SELECT condition_id INTO conditionID FROM CardConditions WHERE condition_name = cardCondition;

    -- Actualiza el inventario si se encuentra la carta y el estado
    IF cardID IS NOT NULL AND conditionID IS NOT NULL THEN
        UPDATE CardInventory
        SET stock = newStock
        WHERE card_id = cardID AND condition_id = conditionID;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Carta o estado no encontrado';
    END IF;
END //

DELIMITER ;

-- Función para consultar el inventario de una carta específica con todos sus estados y precios
DELIMITER //

CREATE PROCEDURE GetCardInventory (
    IN cardName VARCHAR(100),
    IN cardExpansion VARCHAR(100)
)
BEGIN
    DECLARE cardID INT;

    -- Busca el ID de la carta
    SELECT card_id INTO cardID FROM Cards WHERE name = cardName AND expansion = cardExpansion;

    -- Muestra la información si la carta existe
    IF cardID IS NOT NULL THEN
        SELECT 
            c.name AS CardName,
            c.expansion AS Expansion,
            cc.condition_name AS CardCondition,
            ci.price AS Price,
            ci.stock AS Stock
        FROM CardInventory ci
        JOIN Cards c ON ci.card_id = c.card_id
        JOIN CardConditions cc ON ci.condition_id = cc.condition_id
        WHERE ci.card_id = cardID;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Carta no encontrada en el inventario';
    END IF;
END //

DELIMITER ;

-- Ejemplo de inserciones --
CALL AddCardToInventory(
    'Pikachu',         -- Nombre de la carta
    'Base Set',        -- Expansión
    'Common',          -- Rareza
    'Electric',        -- Categoría
    'Mint',            -- Estado de conservación
    15.00,             -- Precio de venta
    10                 -- Cantidad en stock
);

CALL AddCardToInventory(
    'Pikachu', 
    'Base Set', 
    'Common', 
    'Electric', 
    'Near Mint', 
    12.00, 
    5
);

-- Actualizar inventario --
CALL UpdateCardStock(
    'Pikachu',         -- Nombre de la carta
    'Base Set',        -- Expansión
    'Mint',            -- Estado de conservación
    20                 -- Nuevo stock
);

-- Consultar el inventario --

CALL GetCardInventory(
    'Pikachu',         -- Nombre de la carta
    'Base Set'         -- Expansión
);

-- Una carta puede tener mas de un estado de conservacion
-- Una carta puede tener mas de un solo precio
-- Una carta con el mismo nombre es la misma carta a menos de que sea otra rareza
