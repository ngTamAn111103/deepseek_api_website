USE DEEPSEEK

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fullname VARCHAR(50) NOT NULL, -- Tên hiển thị
    email VARCHAR(100) UNIQUE NOT NULL, -- email/tài khoản
    password_hash VARCHAR(255) NOT NULL, -- mật khẩu 
    balance DECIMAL(15,2) DEFAULT 0.00 CHECK (balance >= 0), -- số token người dùng đang có
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
DROP TABLE users;




CREATE TABLE topup_packages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    package_name VARCHAR(100) NOT NULL,  -- tên gói
    package_price DECIMAL(15,2) NOT NULL CHECK (package_price > 0), -- giá gói
    base_tokens INT NOT NULL CHECK (base_tokens > 0), -- token mặc định 
    bonus_tokens INT DEFAULT 0 CHECK (bonus_tokens >= 0), -- token tặng kèm
    is_active BOOLEAN DEFAULT TRUE, -- gói này có đang cho người dùng chọn không
    isBestSeller BOOLEAN DEFAULT TRUE, -- thể hiện tính nên mua
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
DROP TABLE topup_packages;
INSERT INTO topup_packages (
    package_name,
    package_price,
    base_tokens,
    bonus_tokens,
    isBestSeller
) VALUES 
    ('Gói Trải Nghiệm', 10000, 1000000, 10000, False),
    ('Gói Tiết Kiệm', 20000, 2850000, 50000, True),
    ('Gói Lớn', 50000, 6250000, 100000, False);



CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL, -- người nạp
    package_id INT, -- khoá ngoại
    amount DECIMAL(15,2) NOT NULL CHECK (amount >= 0), -- số tiền nạp (để đối chiếu với lúc nạp)
    payment_method VARCHAR(50) NOT NULL,  -- phương thức nạp
    status ENUM('pending', 'success', 'failed', 'refunded') DEFAULT 'pending',
    transaction_code VARCHAR(255) UNIQUE, -- lúc api check ok thì bỏ vào đây
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES topup_packages(id) ON DELETE SET NULL
) ENGINE=InnoDB;