USE DEEPSEEK



-- Bảng người dùng
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NULL,users
    provider ENUM('email', 'google') NOT NULL DEFAULT 'email',
    provider_id VARCHAR(255),
    avatar_url VARCHAR(255),
    token_balance DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_provider_id (provider, provider_id),
    UNIQUE KEY unique_email_provider (provider, email),
    CONSTRAINT chk_auth_method CHECK (
        (provider = 'email' AND password_hash IS NOT NULL AND provider_id IS NULL) OR
        (provider = 'google' AND provider_id IS NOT NULL AND password_hash IS NULL)
    )
);


-- Bảng giao dịch
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    amount DECIMAL(15, 2) COMMENT 'Số tiền thực tế',
    token_amount DECIMAL(15, 2) COMMENT 'Số token tương ứng',
    transaction_type ENUM('deposit', 'token_purchase', 'api_usage') NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);



-- Bảng lịch sử API
CREATE TABLE api_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    tokens_used DECIMAL(10, 2) NOT NULL,
    prompt TEXT NOT NULL,
    response TEXT,
    model_used VARCHAR(50),
    request_params JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);



-- Bảng tỷ giá token (tuỳ chọn)
CREATE TABLE token_rates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    rate DECIMAL(15, 2) NOT NULL COMMENT 'Số token nhận được trên 1 đơn vị tiền',
    effective_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

