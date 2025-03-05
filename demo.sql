-- Tạo database
CREATE DATABASE ai_chat_platform;
USE ai_chat_platform;

-- Bảng người dùng
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fullname VARCHAR(255) NOT NULL COMMENT 'Họ và tên người dùng',
    email VARCHAR(255) UNIQUE NOT NULL COMMENT 'Email đăng nhập',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã mã hóa',
    token_balance INT DEFAULT 0 COMMENT 'Số token hiện có',
    avatar TEXT COMMENT 'Đường dẫn ảnh đại diện',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT 'Bảng lưu thông tin người dùng';
-- Sửa đổi bảng users để thêm ràng buộc CHECK
ALTER TABLE users 
ADD CONSTRAINT chk_token_balance_non_negative 
CHECK (token_balance >= 0);

-- Bảng gói nạp token
CREATE TABLE topup_packages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    package_name VARCHAR(255) NOT NULL COMMENT 'Tên gói (ví dụ: Gói 1000 token)',
    package_price INT NOT NULL COMMENT 'Giá tiền của gói',
    tokens INT NOT NULL COMMENT 'Số token trong gói',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Gói có đang khả dụng không?',
    is_best_seller BOOLEAN DEFAULT FALSE COMMENT 'Gói bán chạy',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT 'Bảng quản lý các gói nạp token';
ALTER TABLE topup_packages 
ADD CONSTRAINT chk_tokens_non_negative 
CHECK (tokens >= 0);

-- Bảng giao dịch
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    package_id INT NOT NULL,
    amount INT NOT NULL COMMENT 'Số tiền thanh toán thực tế',
    tokens_added INT NOT NULL COMMENT 'Số token được cộng vào tài khoản',
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    transaction_code VARCHAR(255) UNIQUE COMMENT 'Mã giao dịch từ cổng thanh toán',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (package_id) REFERENCES topup_packages(id)
) COMMENT 'Bảng lưu lịch sử giao dịch nạp token';

ALTER TABLE transactions 
ADD CONSTRAINT chk_amount_negative 
CHECK (amount >= 0);

ALTER TABLE transactions 
ADD CONSTRAINT chk_tokens_added_negative 
CHECK (tokens_added >= 0);


-- Bảng phiên chat
CREATE TABLE sessions_chat (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) COMMENT 'Tiêu đề phiên chat (ví dụ: "Hỏi về AI")',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) COMMENT 'Bảng quản lý các phiên chat';

-- Bảng lịch sử chat
CREATE TABLE chat_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_id INT NOT NULL,
    message TEXT COMMENT 'Nội dung tin nhắn người dùng',
    response TEXT COMMENT 'Phản hồi từ AI',
    tokens_used INT NOT NULL COMMENT 'Tổng token đã sử dụng cho cặp message-response',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (session_id) REFERENCES sessions_chat(id)
) COMMENT 'Bảng lưu lịch sử chat chi tiết';

-- Thêm dữ liệu mẫu
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Nguyễn Văn A', 'nguyenvana1@example.com', 'hashed_password_1', 100, 'avatar1.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Trần Thị B', 'tranthib2@example.com', 'hashed_password_2', 200, 'avatar2.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Lê Công C', 'lecongc3@example.com', 'hashed_password_3', 50, 'avatar3.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Phạm Thị D', 'phamthid4@example.com', 'hashed_password_4', 150, 'avatar4.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Hoàng Anh E', 'hoanganhe5@example.com', 'hashed_password_5', 300, 'avatar5.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Vũ Đức F', 'vuducf6@example.com', 'hashed_password_6', 75, 'avatar6.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Đỗ Thị G', 'dothig7@example.com', 'hashed_password_7', 125, 'avatar7.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Trịnh Văn H', 'trinhvanh8@example.com', 'hashed_password_8', 250, 'avatar8.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Bùi Thị I', 'buithii9@example.com', 'hashed_password_9', 90, 'avatar9.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Hồ Sỹ K', 'hosyk10@example.com', 'hashed_password_10', 180, 'avatar10.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Lưu Thị L', 'luuthil11@example.com', 'hashed_password_11', 60, 'avatar11.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Phan Bá M', 'phanbam12@example.com', 'hashed_password_12', 110, 'avatar12.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Tôn Nữ N', 'tonnun13@example.com', 'hashed_password_13', 220, 'avatar13.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Cao Xuân O', 'caoxuano14@example.com', 'hashed_password_14', 85, 'avatar14.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Diệp Thị P', 'diepthip15@example.com', 'hashed_password_15', 170, 'avatar15.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Quách Văn Q', 'quachvanq16@example.com', 'hashed_password_16', 40, 'avatar16.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Lâm Thị R', 'lamthir17@example.com', 'hashed_password_17', 130, 'avatar17.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Sơn Tùng S', 'sontungs18@example.com', 'hashed_password_18', 280, 'avatar18.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Uông Thị T', 'uongthit19@example.com', 'hashed_password_19', 95, 'avatar19.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Việt Anh U', 'vietanhu20@example.com', 'hashed_password_20', 210, 'avatar20.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Xuân Thị V', 'xuanthiv21@example.com', 'hashed_password_21', 70, 'avatar21.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Yến Văn W', 'yenvanw22@example.com', 'hashed_password_22', 160, 'avatar22.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('An Bình X', 'anbinhx23@example.com', 'hashed_password_23', 35, 'avatar23.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Bích Chi Y', 'bichchiy24@example.com', 'hashed_password_24', 140, 'avatar24.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Công Danh Z', 'congdanhz25@example.com', 'hashed_password_25', 260, 'avatar25.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Đức Em A', 'ducema26@example.com', 'hashed_password_26', 80, 'avatar26.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Gia Hân B', 'giahanb27@example.com', 'hashed_password_27', 190, 'avatar27.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Hoàng Yến C', 'hoangyenc28@example.com', 'hashed_password_28', 55, 'avatar28.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Khánh Linh D', 'khanhlinhd29@example.com', 'hashed_password_29', 120, 'avatar29.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Minh Ngọc E', 'minhnge30@example.com', 'hashed_password_30', 230, 'avatar30.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Ngọc Phương F', 'ngocphuongf31@example.com', 'hashed_password_31', 65, 'avatar31.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Quốc Trung G', 'quoctrungg32@example.com', 'hashed_password_32', 155, 'avatar32.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Thanh Tú H', 'thanhtuh33@example.com', 'hashed_password_33', 30, 'avatar33.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Uyên Nhi I', 'uyennhii34@example.com', 'hashed_password_34', 135, 'avatar34.jpg');
INSERT INTO users (fullname, email, password_hash, token_balance, avatar) VALUES ('Văn Quyết K', 'vanquyetk35@example.com', 'hashed_password_35', 270, 'avatar35.jpg');


INSERT INTO topup_packages (package_name, package_price, tokens, is_active, is_best_seller) VALUES
('Gói 100 Token', 10000, 100, TRUE, FALSE),
('Gói 500 Token', 45000, 500, TRUE, FALSE),
('Gói 1000 Token', 80000, 1000, TRUE, TRUE), -- Gói bán chạy
('Gói 2000 Token', 150000, 2000, FALSE, FALSE),
('Gói 5000 Token', 350000, 5000, FALSE, FALSE),
('Gói 10000 Token', 600000, 10000, FALSE, FALSE),
('Gói 200 Token', 18000, 200, FALSE, FALSE),
('Gói 750 Token', 60000, 750, FALSE, FALSE),
('Gói 1500 Token', 110000, 1500, FALSE, FALSE),
('Gói 3000 Token', 200000, 3000, FALSE, FALSE);

INSERT INTO transactions (user_id, package_id, amount, tokens_added, status, transaction_code) VALUES
							(1, 1, 10000, 100, 'completed', 'TXN123456'),
							(2, 3, 80000, 1000, 'completed', 'TXN789012'),
							(3, 2, 45000, 500, 'pending', NULL),
							(4, 5, 350000, 5000, 'failed', 'TXN345678'),
							(5, 1, 10000, 100, 'completed', 'TXN901234'),
							(6, 3, 80000, 1000, 'completed', 'TXN567890'),
							(7, 2, 45000, 500, 'pending', NULL),
							(8, 5, 350000, 5000, 'failed', 'TXN123789'),
							(9, 1, 10000, 100, 'completed', 'TXN456012'),
							(10, 3, 80000, 1000, 'completed', 'TXN789345'),
							(1, 2, 45000, 500, 'pending', NULL),
							(2, 5, 350000, 5000, 'failed', 'TXN012678'),
							(3, 1, 10000, 100, 'completed', 'TXN345901'),
							(4, 3, 80000, 1000, 'completed', 'TXN678234'),
							(5, 2, 45000, 500, 'pending', NULL),
							(6, 5, 350000, 5000, 'failed', 'TXN901567'),
							(7, 1, 10000, 100, 'completed', 'TXN234890'),
							(8, 3, 80000, 1000, 'completed', 'TXN567123'),
							(9, 2, 45000, 500, 'pending', NULL),
							(10, 5, 350000, 5000, 'failed', 'TXN890456'),
							(1, 4, 150000, 2000, 'completed', 'TXN112233'),
							(2, 6, 600000, 10000, 'completed', 'TXN445566'),
							(3, 7, 18000, 200, 'pending', NULL),
							(4, 8, 60000, 750, 'failed', 'TXN778899'),
							(5, 9, 110000, 1500, 'completed', 'TXN001122'),
							(6, 10, 200000, 3000, 'completed', 'TXN334455'),
							(7, 4, 150000, 2000, 'pending', NULL),
							(8, 6, 600000, 10000, 'failed', 'TXN667788'),
							(9, 7, 18000, 200, 'completed', 'TXN990011'),
							(10, 8, 60000, 750, 'completed', 'TXN223344'),
							(1, 9, 110000, 1500, 'pending', NULL),
							(2, 10, 200000, 3000, 'failed', 'TXN556677');
                            
                            
INSERT INTO sessions_chat (user_id, title) VALUES
(1, 'Hỏi về AI'),
(2, 'Thảo luận về Deep Learning'),
(3, 'Phiên chat về NLP'),
(4, 'Tư vấn về Machine Learning'),
(5, 'Chatbot và ứng dụng'),
(6, 'Hỏi đáp về Big Data'),
(7, 'Cloud Computing và AI'),
(8, 'IoT và AI'),
(9, 'Robot học và AI'),
(10, 'Phân tích dữ liệu với AI'),
(1, 'Hỏi về Python'),
(3, 'Thảo luận về Java'),
(5, 'Phiên chat về C++'),
(7, 'Tư vấn về JavaScript'),
(9, 'Chat về HTML/CSS'),
(2, 'Hỏi đáp về SQL'),
(4, 'Cloud Computing và DevOps'),
(6, 'IoT và Embedded Systems'),
(8, 'Robot học và Robotics'),
(10, 'Phân tích dữ liệu với Pandas'),
(1, 'Hỏi về AI trong y tế'),
(3, 'Thảo luận về AI trong giáo dục'),
(5, 'Phiên chat về AI trong tài chính'),
(7, 'Tư vấn về AI trong marketing'),
(9, 'Chat về AI trong game'),
(2, 'Hỏi đáp về AI trong nông nghiệp'),
(4, 'Cloud Computing và AI trong sản xuất'),
(6, 'IoT và AI trong giao thông'),
(8, 'Robot học và AI trong dịch vụ'),
(10, 'Phân tích dữ liệu với AI trong bán lẻ'),
(1, 'Hỏi về AI trong an ninh mạng'),
(3, 'Thảo luận về AI trong năng lượng'),
(5, 'Phiên chat về AI trong môi trường'),
(7, 'Tư vấn về AI trong logistics'),
(9, 'Chat về AI trong du lịch'),
(2, 'Hỏi đáp về AI trong bất động sản'),
(4, 'Cloud Computing và AI trong xây dựng'),
(6, 'IoT và AI trong đô thị thông minh'),
(8, 'Robot học và AI trong nhà hàng'),
(10, 'Phân tích dữ liệu với AI trong thể thao'),
(1, 'Hỏi về AI trong nghệ thuật'),
(3, 'Thảo luận về AI trong âm nhạc'),
(5, 'Phiên chat về AI trong văn học'),
(7, 'Tư vấn về AI trong điện ảnh'),
(9, 'Chat về AI trong nhiếp ảnh'),
(2, 'Hỏi đáp về AI trong thiết kế'),
(4, 'Cloud Computing và AI trong kiến trúc'),
(6, 'IoT và AI trong thời trang'),
(8, 'Robot học và AI trong quảng cáo'),
(10, 'Phân tích dữ liệu với AI trong báo chí');

INSERT INTO chat_history (user_id, session_id, message, response, tokens_used) VALUES
(1, 1, 'Chào bạn, AI có thể giúp gì cho tôi?', NULL, 10),
(1, 1, NULL, 'Chào bạn, tôi là AI. Tôi có thể trả lời các câu hỏi của bạn về AI.', 15),
(2, 2, 'Deep Learning là gì?', NULL, 8),
(2, 2, NULL, 'Deep Learning là một nhánh của Machine Learning sử dụng mạng nơ-ron sâu để học từ dữ liệu.', 20),
(3, 3, 'NLP được dùng để làm gì?', NULL, 12),
(3, 3, NULL, 'NLP được dùng để xử lý và hiểu ngôn ngữ tự nhiên.', 18),
(4, 4, 'Tôi muốn học Machine Learning thì nên bắt đầu từ đâu?', NULL, 15),
(4, 4, NULL, 'Bạn có thể bắt đầu bằng cách học Python, sau đó học các thư viện như Scikit-learn và TensorFlow.', 25),
(5, 5, 'Chatbot hoạt động như thế nào?', NULL, 10),
(5, 5, NULL, 'Chatbot sử dụng NLP và Machine Learning để hiểu và trả lời câu hỏi của người dùng.', 18),
(6, 6, 'Big Data có ứng dụng gì trong AI?', NULL, 14),
(6, 6, NULL, 'Big Data cung cấp dữ liệu lớn cho các mô hình AI để học và cải thiện hiệu suất.', 22),
(7, 7, 'Cloud Computing có liên quan gì đến AI?', NULL, 11),
(7, 7, NULL, 'Cloud Computing cung cấp tài nguyên tính toán và lưu trữ cho các ứng dụng AI.', 19),
(8, 8, 'IoT và AI có thể kết hợp như thế nào?', NULL, 13),
(8, 8, NULL, 'IoT cung cấp dữ liệu từ các thiết bị, AI phân tích dữ liệu và đưa ra quyết định.', 21),
(9, 9, 'Robot học có liên quan gì đến AI?', NULL, 16),
(9, 9, NULL, 'Robot học sử dụng AI để học cách thực hiện các nhiệm vụ.', 24),
(10, 10, 'AI có thể giúp phân tích dữ liệu như thế nào?', NULL, 12),
(10, 10, NULL, 'AI có thể phân tích dữ liệu lớn và phức tạp để tìm ra các mẫu và xu hướng.', 20),
(1, 1, 'Cảm ơn AI, tôi hiểu rồi.', NULL, 8),
(1, 1, NULL, 'Không có gì, nếu bạn có câu hỏi gì khác, đừng ngần ngại hỏi.', 12),
(2, 2, 'Tôi muốn tìm hiểu thêm về mạng nơ-ron sâu.', NULL, 10),
(2, 2, NULL, 'Mạng nơ-ron sâu có nhiều lớp ẩn, giúp chúng học được các biểu diễn phức tạp của dữ liệu.', 22),
(3, 3, 'NLP có thể được dùng để tạo ra chatbot không?', NULL, 9),
(3, 3, NULL, 'Đúng vậy, NLP là một phần quan trọng của việc tạo ra chatbot.', 15),
(4, 4, 'Tôi cần học những kỹ năng nào để làm việc trong lĩnh vực Machine Learning?', NULL, 15),
(4, 4, NULL, 'Bạn cần học Python, Machine Learning, Deep Learning, NLP, và các kỹ năng liên quan đến dữ liệu.', 28),
(5, 5, 'Chatbot có thể được dùng để chăm sóc khách hàng không?', NULL, 11),
(5, 5, NULL, 'Có, chatbot có thể được dùng để trả lời các câu hỏi thường gặp và hỗ trợ khách hàng 24/7.', 19),
(6, 6, 'Big Data có thể được dùng để dự đoán xu hướng không?', NULL, 13),
(6, 6, NULL, 'Đúng vậy, Big Data có thể được dùng để phân tích dữ liệu lịch sử và dự đoán xu hướng trong tương lai.', 21),
(7, 7, 'Cloud Computing có thể giúp giảm chi phí cho AI không?', NULL, 10),
(7, 7, NULL, 'Có, Cloud Computing cho phép bạn trả tiền cho những gì bạn sử dụng, giúp giảm chi phí đầu tư ban đầu.', 18),
(8, 8, 'IoT và AI có thể được dùng để tạo ra nhà thông minh không?', NULL, 14),
(8, 8, NULL, 'Đúng vậy, IoT và AI có thể được dùng để tạo ra các thiết bị và hệ thống tự động trong nhà.', 22),
(9, 9, 'Robot học có thể được dùng để tạo ra robot tự hành không?', NULL, 12),
(9, 9, NULL, 'Có, Robot học là một phần quan trọng của việc tạo ra robot tự hành.', 20),
(10, 10, 'AI có thể được dùng để tạo ra các mô hình dự đoán không?', NULL, 16),
(10, 10, NULL, 'Đúng vậy, AI có thể được dùng để tạo ra các mô hình dự đoán cho nhiều lĩnh vực khác nhau.', 24);
-- Truy vấn kiểm tra
SELECT * FROM users;
SELECT * FROM topup_packages;
SELECT * FROM transactions;
SELECT * FROM sessions_chat;
SELECT * FROM chat_history;

