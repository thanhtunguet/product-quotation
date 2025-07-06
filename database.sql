-- Product Management and Quotation Database Schema
-- Using MySQL with InnoDB engine for foreign key support

-- =======================
-- MASTER DATA TABLES
-- =======================

-- Categories with tree structure (parent-child relationship)
CREATE TABLE Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parentId INT,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_parent_id (parentId),
    INDEX idx_code (code),
    INDEX idx_active_deleted (isActive, deletedAt),
    FOREIGN KEY (parentId) REFERENCES Categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Brands master data
CREATE TABLE Brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_code (code),
    INDEX idx_active_deleted (isActive, deletedAt)
) ENGINE=InnoDB;

-- Manufacturers master data
CREATE TABLE Manufacturers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_code (code),
    INDEX idx_active_deleted (isActive, deletedAt)
) ENGINE=InnoDB;

-- Materials master data
CREATE TABLE Materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_code (code),
    INDEX idx_active_deleted (isActive, deletedAt)
) ENGINE=InnoDB;

-- Manufacturing Methods master data
CREATE TABLE ManufacturingMethods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_code (code),
    INDEX idx_active_deleted (isActive, deletedAt)
) ENGINE=InnoDB;

-- Colors master data
CREATE TABLE Colors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    hexCode VARCHAR(7), -- For color representation #FFFFFF
    description TEXT,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_code (code),
    INDEX idx_active_deleted (isActive, deletedAt)
) ENGINE=InnoDB;

-- Sizes master data
CREATE TABLE Sizes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_code (code),
    INDEX idx_active_deleted (isActive, deletedAt)
) ENGINE=InnoDB;

-- Product Types master data
CREATE TABLE ProductTypes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_code (code),
    INDEX idx_active_deleted (isActive, deletedAt)
) ENGINE=InnoDB;

-- Packaging Types master data
CREATE TABLE PackagingTypes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_code (code),
    INDEX idx_active_deleted (isActive, deletedAt)
) ENGINE=InnoDB;

-- =======================
-- DYNAMIC ATTRIBUTES
-- =======================

-- Dynamic Product Attributes Definition
CREATE TABLE ProductAttributes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    dataType ENUM('TEXT', 'NUMBER') NOT NULL DEFAULT 'TEXT',
    description TEXT,
    isRequired BOOLEAN NOT NULL DEFAULT FALSE,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_code (code),
    INDEX idx_data_type (dataType),
    INDEX idx_active_deleted (isActive, deletedAt)
) ENGINE=InnoDB;

-- Dynamic Product Attribute Values (for dropdown options)
CREATE TABLE ProductAttributeValues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attributeId INT NOT NULL,
    value VARCHAR(500) NOT NULL,
    displayOrder INT DEFAULT 0,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_attribute_id (attributeId),
    INDEX idx_display_order (displayOrder),
    INDEX idx_active_deleted (isActive, deletedAt),
    FOREIGN KEY (attributeId) REFERENCES ProductAttributes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attribute_value (attributeId, value)
) ENGINE=InnoDB;

-- =======================
-- PRODUCT TABLES
-- =======================

-- Main Products table
CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    sku VARCHAR(100) UNIQUE,
    categoryId INT NOT NULL,
    brandId INT,
    manufacturerId INT,
    materialId INT,
    manufacturingMethodId INT,
    colorId INT,
    sizeId INT,
    productTypeId INT,
    packagingTypeId INT,
    imageUrl VARCHAR(1000),
    description TEXT,
    basePrice DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_code (code),
    INDEX idx_sku (sku),
    INDEX idx_category_id (categoryId),
    INDEX idx_brand_id (brandId),
    INDEX idx_manufacturer_id (manufacturerId),
    INDEX idx_active_deleted (isActive, deletedAt),
    
    FOREIGN KEY (categoryId) REFERENCES Categories(id),
    FOREIGN KEY (brandId) REFERENCES Brands(id),
    FOREIGN KEY (manufacturerId) REFERENCES Manufacturers(id),
    FOREIGN KEY (materialId) REFERENCES Materials(id),
    FOREIGN KEY (manufacturingMethodId) REFERENCES ManufacturingMethods(id),
    FOREIGN KEY (colorId) REFERENCES Colors(id),
    FOREIGN KEY (sizeId) REFERENCES Sizes(id),
    FOREIGN KEY (productTypeId) REFERENCES ProductTypes(id),
    FOREIGN KEY (packagingTypeId) REFERENCES PackagingTypes(id)
) ENGINE=InnoDB;

-- Product Dynamic Attributes Assignment
CREATE TABLE ProductDynamicAttributes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productId INT NOT NULL,
    attributeId INT NOT NULL,
    textValue TEXT,
    numberValue DECIMAL(15,4),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_product_id (productId),
    INDEX idx_attribute_id (attributeId),
    INDEX idx_deleted (deletedAt),
    
    FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE,
    FOREIGN KEY (attributeId) REFERENCES ProductAttributes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_attribute (productId, attributeId)
) ENGINE=InnoDB;

-- =======================
-- QUOTATION TABLES
-- =======================

-- Quotations
CREATE TABLE Quotations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quotationNumber VARCHAR(100) UNIQUE NOT NULL,
    customerName VARCHAR(255) NOT NULL,
    companyName VARCHAR(255),
    phoneNumber VARCHAR(50) NOT NULL,
    quotationDate DATE NOT NULL,
    validUntil DATE,
    status ENUM('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED') NOT NULL DEFAULT 'DRAFT',
    totalAmount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_quotation_number (quotationNumber),
    INDEX idx_customer_name (customerName),
    INDEX idx_phone_number (phoneNumber),
    INDEX idx_quotation_date (quotationDate),
    INDEX idx_status (status),
    INDEX idx_active_deleted (deletedAt)
) ENGINE=InnoDB;

-- Quotation Items
CREATE TABLE QuotationItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quotationId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unitPrice DECIMAL(15,2) NOT NULL,
    totalPrice DECIMAL(15,2) NOT NULL,
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_quotation_id (quotationId),
    INDEX idx_product_id (productId),
    INDEX idx_deleted (deletedAt),
    
    FOREIGN KEY (quotationId) REFERENCES Quotations(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(id)
) ENGINE=InnoDB;

-- =======================
-- SAMPLE DATA INSERTS
-- =======================

-- Sample Categories (with tree structure)
INSERT INTO Categories (name, code, description, parentId) VALUES
('Electronics', 'ELEC', 'Electronic products', NULL),
('Computers', 'COMP', 'Computer products', 1),
('Laptops', 'LAPTOP', 'Laptop computers', 2),
('Desktops', 'DESKTOP', 'Desktop computers', 2),
('Clothing', 'CLOTH', 'Clothing products', NULL),
('Men Clothing', 'MEN_CLOTH', 'Men clothing', 5),
('Women Clothing', 'WOMEN_CLOTH', 'Women clothing', 5);

-- Sample Brands
INSERT INTO Brands (name, code, description) VALUES
('Apple', 'APPLE', 'Apple Inc.'),
('Dell', 'DELL', 'Dell Technologies'),
('Nike', 'NIKE', 'Nike Inc.'),
('Adidas', 'ADIDAS', 'Adidas AG');

-- Sample Dynamic Attributes
INSERT INTO ProductAttributes (name, code, dataType, description) VALUES
('CPU Type', 'CPU_TYPE', 'TEXT', 'Processor type for computers'),
('RAM Size', 'RAM_SIZE', 'NUMBER', 'Memory size in GB'),
('Storage Capacity', 'STORAGE_CAP', 'NUMBER', 'Storage capacity in GB'),
('Screen Size', 'SCREEN_SIZE', 'NUMBER', 'Screen size in inches'),
('Clothing Size', 'CLOTH_SIZE', 'TEXT', 'Clothing size (S, M, L, XL, etc.)'),
('Shoe Size', 'SHOE_SIZE', 'NUMBER', 'Shoe size in numbers');

-- Sample Attribute Values
INSERT INTO ProductAttributeValues (attributeId, value, displayOrder) VALUES
(1, 'Intel Core i3', 1),
(1, 'Intel Core i5', 2),
(1, 'Intel Core i7', 3),
(1, 'Intel Core i9', 4),
(1, 'AMD Ryzen 5', 5),
(1, 'AMD Ryzen 7', 6),
(5, 'XS', 1),
(5, 'S', 2),
(5, 'M', 3),
(5, 'L', 4),
(5, 'XL', 5),
(5, 'XXL', 6);
