CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    plu VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS shops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT
);

CREATE TABLE IF NOT EXISTS inventories (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    shop_id INTEGER REFERENCES shops(id),
    shelf_quantity INTEGER DEFAULT 0,
    order_quantity INTEGER DEFAULT 0,
    UNIQUE(product_id, shop_id)
);

CREATE TABLE IF NOT EXISTS inventory_logs (
    id SERIAL PRIMARY KEY,
    inventory_id INTEGER REFERENCES inventories(id),
    action VARCHAR(50) NOT NULL,
    old_shelf_quantity INTEGER,
    new_shelf_quantity INTEGER,
    old_order_quantity INTEGER,
    new_order_quantity INTEGER,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO shops (id, name, address)
VALUES
    (1, 'Тестовый магаз', 'г. Москва, ул. Тестовая, д. 1'),
    (2, 'Тестовый магазин', 'г. Санкт-Петербург, ул. Тестовая, д. 1')
ON CONFLICT (id)
DO UPDATE SET
    name = EXCLUDED.name,
    address = EXCLUDED.address;
