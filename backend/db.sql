-- Active: 1731573468002@@127.0.0.1@5432@mjst_invoicing@public

CREATE DATABASE mjst_invoicing;

-- Connect to the mjst_invoicing database
\c mjst_invoicing;

-- ============================
-- USERS TABLE
-- ============================
CREATE TABLE Users(
    UserID SERIAL PRIMARY KEY,
    UserFullName VARCHAR(255),
    UserName VARCHAR(255),
    UserDepartment VARCHAR(255),
    UserEmail VARCHAR(255),
    UserPassword VARCHAR(255),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- CLIENTS TABLE
-- ============================

-- Step 1: Create a sequence for auto-incrementing ClientID
CREATE SEQUENCE client_id_seq START 1;

-- Step 2: Create the Clients table
CREATE TABLE Clients(
    ClientID VARCHAR(255) PRIMARY KEY,
    ClientName VARCHAR(255),
    ClientAddress VARCHAR(255),
    ClientProvince VARCHAR(255),
    ClientZipCode VARCHAR(255),
    ClientPhone VARCHAR(255),
    ClientPIC VARCHAR(255),
    ClientPICTitle VARCHAR(255),
    BusinessSector VARCHAR(255),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedUser VARCHAR(255),
    ModifiedUser VARCHAR(255)
);

-- Step 3: Create a trigger function to generate ClientID with prefix "CLI"
CREATE OR REPLACE FUNCTION generate_client_id()
RETURNS TRIGGER AS $$
DECLARE
    new_id VARCHAR;
BEGIN
    new_id := 'CLI' || LPAD(nextval('client_id_seq')::TEXT, 3, '0');
    NEW.ClientID := new_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create a trigger for the Clients table
CREATE TRIGGER client_id_trigger
BEFORE INSERT ON Clients
FOR EACH ROW
WHEN (NEW.ClientID IS NULL)
EXECUTE FUNCTION generate_client_id();


-- ============================
-- COMPANY MASTER TABLE
-- ============================

-- Step 1: Create a sequence for auto-incrementing CompanyID
CREATE SEQUENCE company_id_seq START 1;

-- Step 2: Create the CompanyMaster table
CREATE TABLE CompanyMaster(
    CompanyID VARCHAR(255) PRIMARY KEY,
    CompanyName VARCHAR(255),
    CompanyAddress VARCHAR(255),
    CompanyProvince VARCHAR(255),
    CompanyZipCode VARCHAR(255),
    CompanyPhone VARCHAR(255),
    CompanyPIC VARCHAR(255),
    CompanyPICTitle VARCHAR(255),
    InvoiceNotes TEXT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedUser VARCHAR(255),
    ModifiedUser VARCHAR(255)
);

-- Step 3: Create a trigger function to generate CompanyID with prefix "CMP"
CREATE OR REPLACE FUNCTION generate_company_id()
RETURNS TRIGGER AS $$
DECLARE
    new_id VARCHAR;
BEGIN
    new_id := 'CMP' || LPAD(nextval('company_id_seq')::TEXT, 3, '0');
    NEW.CompanyID := new_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create a trigger for the CompanyMaster table
CREATE TRIGGER company_id_trigger
BEFORE INSERT ON CompanyMaster
FOR EACH ROW
WHEN (NEW.CompanyID IS NULL)
EXECUTE FUNCTION generate_company_id();


-- ============================
-- ORDERS TABLE
-- ============================
CREATE TABLE Orders (
    OrderID VARCHAR(255) PRIMARY KEY,
    OrderDate TIMESTAMP,
    OrderTotal DECIMAL(10,2),
    ClientID VARCHAR(255),
    CompanyID VARCHAR(255),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedUser VARCHAR(255),
    ModifiedUser VARCHAR(255),
    FOREIGN KEY (ClientID) REFERENCES Clients(ClientID),
    FOREIGN KEY (CompanyID) REFERENCES CompanyMaster(CompanyID)
);


-- ============================
-- INVOICES TABLE
-- ============================
CREATE TABLE Invoices (
    InvoiceID SERIAL PRIMARY KEY,
    InvoiceDate TIMESTAMP,
    InvoiceNo VARCHAR(255),
    ClientID VARCHAR(255),
    CompanyID VARCHAR(255),
    ContractNumber VARCHAR(255),
    BillingDescription TEXT,
    BillingQty INT,
    BillingPrice DECIMAL(10,2),
    LineTotal DECIMAL(10,2),
    SubTotal DECIMAL(10,2),
    VAT DECIMAL(10,2),
    SalesTax DECIMAL(10,2),
    InvoiceTotal DECIMAL(10,2),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedUser VARCHAR(255),
    ModifiedUser VARCHAR(255),
    FOREIGN KEY (ClientID) REFERENCES Clients(ClientID),
    FOREIGN KEY (CompanyID) REFERENCES CompanyMaster(CompanyID)
);

SELECT * FROM users;

SELECT * FROM Invoices;

SELECT * FROM Clients;

DELETE FROM Clients
WHERE ClientID < 'CLI042';

DROP TABLE invoices;

ALTER TABLE Clients DROP COLUMN ClientAddress2;
ALTER TABLE Clients ALTER COLUMN ClientProvince TYPE VARCHAR(20);
ALTER TABLE Clients RENAME COLUMN ClientStreetAddress TO ClientAddress;
ALTER TABLE CLients RENAME COLUMN ClientAddress4 TO ClientZipCode;
ALTER TABLE Clients ADD COLUMN ClientZipCode VARCHAR(255);
ALTER TABLE Users ADD COLUMN UserFullName VARCHAR(255);
ALTER TABLE Users ADD COLUMN UserDepartment VARCHAR(255);