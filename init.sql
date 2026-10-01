CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    stock_quantity INT NOT NULL,
    alert_threshold INT NOT NULL,
    store_location VARCHAR(100) NOT NULL
);

INSERT INTO inventory (sku, item_name, department, stock_quantity, alert_threshold, store_location) VALUES
('SKU-1004-891', 'Premium Kiln-Dried Lumber 2x4x8', 'Lumber & Building Materials', 420, 100, 'Aisle 24, Bay 002'),
('SKU-2015-442', 'Milwaukie 18V Cordless Drill Driver Kit', 'Hardware & Tools', 14, 25, 'Aisle 04, Bay 012'),
('SKU-3098-115', 'Behr Ultra Pure White Satin Interior Paint', 'Paint & Decor', 85, 30, 'Aisle 11, Bay 005'),
('SKU-4412-073', 'Sovereign Brass Smart Entry Deadbolt', 'Hardware & Tools', 8, 15, 'Aisle 02, Bay 008'),
('SKU-5201-928', 'Stainless Steel Hinges 3-inch Pack', 'Hardware & Tools', 156, 50, 'Aisle 03, Bay 014'),
('SKU-6789-334', 'Concrete Mix 50lb Bag', 'Lumber & Building Materials', 22, 40, 'Aisle 25, Bay 001'),
('SKU-7845-012', 'LED Recessed Light Fixtures', 'Electrical Supplies', 45, 20, 'Aisle 18, Bay 009'),
('SKU-8912-445', 'Cabinet Hardware Assortment', 'Hardware & Tools', 5, 12, 'Aisle 02, Bay 011');