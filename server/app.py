# Viết api cho client
from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from CONFIG import Config
from google.auth.transport import requests as google_requests
from openai import OpenAI
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
import jwt
from datetime import datetime, timedelta


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database connection
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=Config.DB_HOST,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME
        )
        return conn
    except Exception as e:
        print("Database connection error:", e)
        return None

# Google OAuth2 client ID
GOOGLE_CLIENT_ID = '978174562297-0chrdrf37tm0ftt7cri62oco0esuklm9.apps.googleusercontent.com'


def read_api_key(path='API_KEY.txt'):
    """
    Reads the API key from a file.

    Args:
        path: The path to the file containing the API key.

    Returns:
        The API key as a string, or None if the file does not exist or is empty.
    """
    try:
        with open(path, 'r') as f:
            api_key = f.read().strip()
            if not api_key:
                print(f"Warning: API key file '{path}' is empty.")
                return None
            return api_key
    except FileNotFoundError:
        print(f"Error: API key file not found at '{path}'.")
        return None

# Đăng ký
@app.route('/register', methods=['POST'])
def register():
    # {"email":"user@example.com", "password":"your_strong_password"}
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Nếu không có trường email/password
    if not email or not password:
        return jsonify({
            'success': False,
            'message': 'Email và password là bắt buộc'
        }), 400

    # kết nối tới db
    conn = get_db_connection()
    if not conn:
        return jsonify({
            'success': False,
            'message': 'Lỗi kết nối database'
        }), 500

    try:
        cursor = conn.cursor(dictionary=True)
        
        # Kiểm tra email tồn tại
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({
                'success': False,
                'message': 'Email đã được đăng ký'
            }), 400

        # Hash password và tạo fullname từ email
        hashed_password = generate_password_hash(password)
        fullname = email  # Gán fullname bằng email ban đầu

        # Thêm user mới
        cursor.execute(
            """INSERT INTO users (fullname, email, password_hash)
               VALUES (%s, %s, %s)""",
            (fullname, email, hashed_password)
        )
        conn.commit()

        # Lấy thông tin user vừa tạo
        cursor.execute(
            """SELECT id, fullname, email, balance, created_at 
               FROM users WHERE id = %s""",
            (cursor.lastrowid,)
        )
        new_user = cursor.fetchone()

        # Format lại thời gian
        new_user['created_at'] = new_user['created_at'].isoformat()

        return jsonify({
            'success': True,
            'message': 'Đăng ký thành công',
            'user': new_user
        }), 201

    except mysql.connector.Error as err:
        conn.rollback()
        print("Database error:", err)
        return jsonify({
            'success': False,
            'message': 'Lỗi database'
        }), 500
    except Exception as e:
        conn.rollback()
        print("Error:", e)
        return jsonify({
            'success': False,
            'message': 'Lỗi server'
        }), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

# Đăng nhập
# Thêm secret key vào config (nên đặt trong file Config.py)
app.config['SECRET_KEY'] = Config.SECRET_KEY
@app.route('/login', methods=['POST'])
def login():
    # {"email":"user@example2.com", "password":"your_strong_password"}
    """Đăng nhập bằng email và password"""
    # Lấy thông tin từ request
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Validate input
    if not email or not password:
        return jsonify({
            'success': False,
            'message': 'Email và password là bắt buộc'
        }), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({
            'success': False,
            'message': 'Lỗi kết nối database'
        }), 500

    try:
        cursor = conn.cursor(dictionary=True)
        
        # Tìm user bằng email
        cursor.execute(
            """SELECT id, fullname, email, password_hash, 
                      balance, created_at, updated_at 
               FROM users WHERE email = %s""",
            (email,)
        )
        user = cursor.fetchone()

        # Kiểm tra user tồn tại và password đúng
        if not user or not check_password_hash(user['password_hash'], password):
            return jsonify({
                'success': False,
                'message': 'Email hoặc mật khẩu không đúng'
            }), 401

        # Tạo JWT token
        token = jwt.encode(
            payload={
                'user_id': user['id'],
                'exp': datetime.utcnow() + timedelta(hours=24)
            },
            key=app.config['SECRET_KEY'],
            algorithm='HS256'
        )
        # Chuyển token bytes sang string nếu cần
        if isinstance(token, bytes):
            token = token.decode('utf-8')

        # Chuẩn bị dữ liệu user trả về
        user_data = {
            'id': user['id'],
            'fullname': user['fullname'],
            'email': user['email'],
            'balance': float(user['balance']),
            'created_at': user['created_at'].isoformat(),
            'updated_at': user['updated_at'].isoformat() if user['updated_at'] else None
        }

        return jsonify({
            'success': True,
            'message': 'Đăng nhập thành công',
            'user': user_data,
            'token': token
        }), 200

    except mysql.connector.Error as err:
        print("Database error:", err)
        return jsonify({
            'success': False,
            'message': 'Lỗi database'
        }), 500
    except Exception as e:
        print("Error:", e)
        return jsonify({
            'success': False,
            'message': 'Lỗi server'
        }), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == '__main__':
    app.run(debug=True)