

import mysql.connector
from mysql.connector import Error
from mysql.connector import pooling
import os
from dotenv import load_dotenv
import threading
import time

# 1. Cài đặt thư viện cần thiết
# pip install mysql-connector-python python-dotenv

# 2. Tạo file .env
"""
DB_HOST=localhost
DB_DATABASE=deepseek_token_system
DB_USER=your_username
DB_PASSWORD=your_password
DB_PORT=3306
"""

load_dotenv()

# 3. Tạo connection pool
class Database:
    def __init__(self):
        self.pool = self.create_connection_pool()
    
    def create_connection_pool(self):
        try:
            pool = pooling.MySQLConnectionPool(
                pool_name="my_pool",
                pool_size=5,
                host=os.getenv('DB_HOST'),
                database=os.getenv('DB_DATABASE'),
                user=os.getenv('DB_USER'),
                password=os.getenv('DB_PASSWORD'),
                port=os.getenv('DB_PORT', 3306)
            )
            return pool
        except Error as e:
            print(f"Error creating connection pool: {e}")
            return None

# 4. CRUD Operations
class UserService:
    def __init__(self):
        self.db = Database().pool
    
    # CREATE User
    def create_user(self, user_data):
        connection = None
        try:
            connection = self.db.get_connection()
            cursor = connection.cursor()

            query = """
            INSERT INTO users (
                username, 
                email, 
                password_hash, 
                provider, 
                provider_id, 
                avatar_url
            ) VALUES (%s, %s, %s, %s, %s, %s)
            """
            
            cursor.execute(query, (
                user_data.get('username'),
                user_data['email'],
                user_data.get('password_hash'),
                user_data['provider'],
                user_data.get('provider_id'),
                user_data.get('avatar_url')
            ))
            
            connection.commit()
            return cursor.lastrowid
        except Error as e:
            print(f"Error creating user: {e}")
            return None
        finally:
            if connection:
                connection.close()

    # READ User by ID
    def get_user_by_id(self, user_id):
        try:
            connection = self.db.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM users WHERE id = %s"
            cursor.execute(query, (user_id,))
            
            return cursor.fetchone()
        except Error as e:
            print(f"Error getting user: {e}")
            return None
        finally:
            if connection:
                connection.close()

    # UPDATE User
    def update_user(self, user_id, update_data):
        try:
            connection = self.db.get_connection()
            cursor = connection.cursor()
            
            set_clause = ", ".join([f"{key} = %s" for key in update_data.keys()])
            values = list(update_data.values())
            values.append(user_id)
            
            query = f"UPDATE users SET {set_clause} WHERE id = %s"
            cursor.execute(query, values)
            
            connection.commit()
            return cursor.rowcount
        except Error as e:
            print(f"Error updating user: {e}")
            return None
        finally:
            if connection:
                connection.close()

    # DELETE User
    def delete_user(self, user_id):
        try:
            connection = self.db.get_connection()
            cursor = connection.cursor()
            
            query = "DELETE FROM users WHERE id = %s"
            cursor.execute(query, (user_id,))
            
            connection.commit()
            return cursor.rowcount
        except Error as e:
            print(f"Error deleting user: {e}")
            return None
        finally:
            if connection:
                connection.close()

def simulate_user_operations(user_service, user_id, iterations=100000):
    """Hàm mô phỏng các thao tác get, update, delete của user trong vòng lặp."""
    for i in range(iterations):
        try:
            # Lấy thông tin user
            user = user_service.get_user_by_id(user_id)
            print(f"{threading.current_thread().name} - User details: {user}")
            
            # Cập nhật user
            update_result = user_service.update_user(user_id, {"username": f"new_username_{i}"})
            print(f"{threading.current_thread().name} - Updated {update_result} rows")
            
            # Xóa user
            delete_result = user_service.delete_user(user_id)
            print(f"{threading.current_thread().name} - Deleted {delete_result} rows")
        except Exception as e:
            print(f"{threading.current_thread().name} encountered error: {e}")
        time.sleep(0.01)  # Tạm dừng 10ms giữa các lần lặp

# 5. Usage Examples
if __name__ == "__main__":
    user_service = UserService()
    
    # Tạo user đăng ký bằng email
    new_user = {
        "email": "user@example.com",
        "password_hash": "hashed_password_123",
        "provider": "email"
    }
    user_id = user_service.create_user(new_user)
    print(f"Created user ID: {user_id}")
    
    # Tạo user Google
    google_user = {
        "email": "google_user@example.com",
        "provider": "google",
        "provider_id": "google_id_123",
        "avatar_url": "https://avatar.example.com/123.jpg"
    }
    google_user_id = user_service.create_user(google_user)
    print(f"Created Google user ID: {google_user_id}")
    
     # Khởi tạo và chạy 10 luồng cùng lúc
    threads = []
    num_threads = 30  # Số lượng luồng giả lập
    for i in range(num_threads):
        t = threading.Thread(target=simulate_user_operations, args=(user_service, user_id), name=f"Thread-{i}")
        threads.append(t)
        t.start()
    
    # Chờ tất cả các luồng kết thúc
    for t in threads:
        t.join()