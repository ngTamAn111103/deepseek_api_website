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
import urllib.parse


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

# Lấy danh sách các gói nạp
@app.route('/topup-packages', methods=['GET'])
def get_topup_packages():
    """Lấy danh sách các gói nạp đang hoạt động"""
    conn = get_db_connection()
    if not conn:
        return jsonify({
            'success': False,
            'message': 'Lỗi kết nối database'
        }), 500

    try:
        cursor = conn.cursor(dictionary=True)
        
        # Lấy các gói active và sắp xếp
        cursor.execute("""
            SELECT id, package_name, package_price, 
                   base_tokens, bonus_tokens, isBestSeller
            FROM topup_packages 
            WHERE is_active = TRUE
            ORDER BY package_price ASC
        """)
        
        packages = cursor.fetchall()
        
        # Format dữ liệu
        formatted_packages = []
        for p in packages:
            formatted = {
                'id': p['id'],
                'package_name': p['package_name'],
                'package_price': float(p['package_price']),
                'total_tokens': p['base_tokens'] + p['bonus_tokens'],
                'is_best_seller': bool(p['isBestSeller']),
            }
            formatted_packages.append(formatted)

        return jsonify({
            'success': True,
            'message': 'Lấy danh sách gói thành công',
            'packages': formatted_packages
        }), 200

    except mysql.connector.Error as err:
        print("Database error:", err)
        return jsonify({
            'success': False,
            'message': 'Lỗi truy vấn database'
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

# Thêm route tạo giao dịch
@app.route('/create-transaction', methods=['POST'])
def create_transaction():
    """Tạo mới một giao dịch nạp tiền"""
    data = request.get_json()
    
    # Validate input
    required_fields = ['user_id', 'payment_method']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'success': False,
                'message': f'Thiếu trường bắt buộc: {field}'
            }), 400

    # Kiểm tra có package_id hoặc amount
    if 'package_id' not in data and 'amount' not in data:
        return jsonify({
            'success': False,
            'message': 'Cần cung cấp package_id hoặc amount'
        }), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({
            'success': False,
            'message': 'Lỗi kết nối database'
        }), 500

    try:
        cursor = conn.cursor(dictionary=True)
        
        # Kiểm tra user tồn tại
        cursor.execute("SELECT id FROM users WHERE id = %s", (data['user_id'],))
        if not cursor.fetchone():
            return jsonify({
                'success': False,
                'message': 'User không tồn tại'
            }), 404

        # Xử lý amount
        amount = None
        if 'package_id' in data and data['package_id']:
            # Lấy giá từ package
            cursor.execute(
                "SELECT package_price FROM topup_packages WHERE id = %s",
                (data['package_id'],)
            )
            package = cursor.fetchone()
            if not package:
                return jsonify({
                    'success': False,
                    'message': 'Gói nạp không tồn tại'
                }), 404
            amount = float(package['package_price'])
        else:
            # Validate amount từ input
            try:
                amount = float(data['amount'])
                if amount <= 0:
                    raise ValueError
            except ValueError:
                return jsonify({
                    'success': False,
                    'message': 'Số tiền không hợp lệ'
                }), 400

        # Tạo transaction code nếu không có
        transaction_code = data.get('transaction_code')
        if transaction_code:
            cursor.execute(
                "SELECT id FROM transactions WHERE transaction_code = %s",
                (transaction_code,)
            )
            if cursor.fetchone():
                return jsonify({
                    'success': False,
                    'message': 'Mã giao dịch đã tồn tại'
                }), 400

        # Thêm giao dịch vào database
        cursor.execute(
            """INSERT INTO transactions (
                user_id, 
                package_id, 
                amount, 
                payment_method, 
                status, 
                transaction_code
               ) VALUES (%s, %s, %s, %s, %s, %s)""",
            (
                data['user_id'],
                data.get('package_id'),
                amount,
                data['payment_method'],
                'pending',  # Trạng thái mặc định
                transaction_code
            )
        )
        conn.commit()

        # Lấy thông tin giao dịch vừa tạo
        cursor.execute(
            """SELECT * FROM transactions WHERE id = %s""",
            (cursor.lastrowid,)
        )
        new_transaction = cursor.fetchone()

        # Format dữ liệu
        new_transaction['amount'] = float(new_transaction['amount'])
        new_transaction['created_at'] = new_transaction['created_at'].isoformat()
        new_transaction['updated_at'] = new_transaction['updated_at'].isoformat()

        return jsonify({
            'success': True,
            'message': 'Tạo giao dịch thành công',
            'transaction': new_transaction
        }), 201

    except mysql.connector.Error as err:
        conn.rollback()
        print("Database error:", err)
        return jsonify({
            'success': False,
            'message': 'Lỗi database: ' + str(err)
        }), 500
    except Exception as e:
        conn.rollback()
        print("Error:", e)
        return jsonify({
            'success': False,
            'message': 'Lỗi server: ' + str(e)
        }), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
# Khi người dùng nhấn giao dịch thành công
@app.route('/confirm-transaction', methods=['POST'])
def confirm_transaction():
    """Xác nhận giao dịch thành công và cộng token cho user"""
    data = request.get_json()
    transaction_id = data.get('transaction_id')
    transaction_code = data.get('transaction_code')

    if not transaction_id and not transaction_code:
        return jsonify({
            'success': False,
            'message': 'Cần cung cấp transaction_id hoặc transaction_code'
        }), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({
            'success': False,
            'message': 'Lỗi kết nối database'
        }), 500

    try:
        cursor = conn.cursor(dictionary=True)
        # Tìm giao dịch
        query = """SELECT * FROM transactions 
                   WHERE status = 'pending' AND 
                   (id = %s OR transaction_code = %s)"""
        cursor.execute(query, (transaction_id, transaction_code))
        transaction = cursor.fetchone()

        if not transaction:
            return jsonify({
                'success': False,
                'message': 'Giao dịch không tồn tại hoặc đã xử lý'
            }), 404

        # Tính toán số token cần cộng
        tokens_to_add = 0
        if transaction['package_id']:
            # Lấy thông tin package
            cursor.execute(
                """SELECT base_tokens, bonus_tokens 
                   FROM topup_packages 
                   WHERE id = %s""",
                (transaction['package_id'],))
            package = cursor.fetchone()
            tokens_to_add = package['base_tokens'] + package['bonus_tokens']
        else:
            # Tính token dựa trên amount (ví dụ: 1,000 VND = 1 token)
            tokens_to_add = int(transaction['amount'] / 1000)

        # Bắt đầu transaction
        # conn.start_transaction()

        # Cập nhật trạng thái giao dịch
        cursor.execute(
            """UPDATE transactions 
               SET status = 'success', 
                   updated_at = NOW() 
               WHERE id = %s""",
            (transaction['id'],))
        
        # Cộng token cho user
        cursor.execute(
            """UPDATE users 
               SET balance = balance + %s 
               WHERE id = %s""",
            (tokens_to_add, transaction['user_id']))
        
        # Lấy số dư mới
        cursor.execute(
            """SELECT balance FROM users WHERE id = %s""",
            (transaction['user_id'],))
        new_balance = cursor.fetchone()['balance']

        conn.commit()

        return jsonify({
            'success': True,
            'message': 'Cập nhật giao dịch thành công',
            'new_balance': float(new_balance),
            'transaction_id': transaction['id']
        }), 200

    except mysql.connector.Error as err:
        conn.rollback()
        print("Database error:", err)
        return jsonify({
            'success': False,
            'message': f'Lỗi database: {err}'
        }), 500
    except Exception as e:
        conn.rollback()
        print("Error:", e)
        return jsonify({
            'success': False,
            'message': f'Lỗi server: {e}'
        }), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

# Tạo phiên chat mới
@app.route('/create-session', methods=['POST'])
def create_chat_session():
    """Tạo mới một phiên chat"""
    data = request.get_json()
    
    # Validate input
    required_fields = ['user_id', 'title']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'success': False,
                'message': f'Thiếu trường bắt buộc: {field}'
            }), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({
            'success': False,
            'message': 'Lỗi kết nối database'
        }), 500

    try:
        cursor = conn.cursor(dictionary=True)
        
        # Kiểm tra user tồn tại
        cursor.execute("SELECT id FROM users WHERE id = %s", (data['user_id'],))
        if not cursor.fetchone():
            return jsonify({
                'success': False,
                'message': 'Người dùng không tồn tại'
            }), 404

        # Thêm phiên chat mới
        cursor.execute(
            """INSERT INTO sessions_chat (
                user_id, 
                title
               ) VALUES (%s, %s)""",
            (data['user_id'], data['title'])
        )
        conn.commit()

        # Lấy thông tin phiên vừa tạo
        cursor.execute(
            """SELECT * FROM sessions_chat WHERE id = %s""",
            (cursor.lastrowid,)
        )
        new_session = cursor.fetchone()

        # Format thời gian
        new_session['created_at'] = new_session['created_at'].isoformat()
        new_session['updated_at'] = new_session['updated_at'].isoformat()

        return jsonify({
            'success': True,
            'message': 'Tạo phiên chat thành công',
            'session': new_session
        }), 201

    except mysql.connector.Error as err:
        conn.rollback()
        print("Lỗi database:", err)
        return jsonify({
            'success': False,
            'message': 'Lỗi database: ' + str(err)
        }), 500
    except Exception as e:
        conn.rollback()
        print("Lỗi:", e)
        return jsonify({
            'success': False,
            'message': 'Lỗi server: ' + str(e)
        }), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

# Route tạo phiên chat
@app.route('/create-session', methods=['POST'])
def create_chat_session():
    """Tạo mới một phiên chat"""
    # Lấy dữ liệu từ request JSON
    data = request.get_json()
    
    # Kiểm tra các trường bắt buộc
    required_fields = ['user_id', 'title']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'success': False,
                'message': f'Thiếu trường bắt buộc: {field}'
            }), 400

    # Kết nối database
    conn = get_db_connection()
    if not conn:
        return jsonify({
            'success': False,
            'message': 'Lỗi kết nối database'
        }), 500

    try:
        cursor = conn.cursor(dictionary=True)
        
        # Kiểm tra user tồn tại
        cursor.execute("SELECT id FROM users WHERE id = %s", (data['user_id'],))
        if not cursor.fetchone():
            return jsonify({
                'success': False,
                'message': 'Người dùng không tồn tại'
            }), 404

        # Thêm phiên chat mới
        cursor.execute(
            """INSERT INTO sessions_chat (
                user_id, 
                title
               ) VALUES (%s, %s)""",
            (data['user_id'], data['title'])
        )
        conn.commit()

        # Lấy thông tin phiên vừa tạo
        cursor.execute(
            """SELECT * FROM sessions_chat WHERE id = %s""",
            (cursor.lastrowid,)
        )
        new_session = cursor.fetchone()

        # Format thời gian
        new_session['created_at'] = new_session['created_at'].isoformat()
        new_session['updated_at'] = new_session['updated_at'].isoformat()

        return jsonify({
            'success': True,
            'message': 'Tạo phiên chat thành công',
            'session': new_session
        }), 201

    except mysql.connector.Error as err:
        conn.rollback()
        print("Lỗi database:", err)
        return jsonify({
            'success': False,
            'message': 'Lỗi database: ' + str(err)
        }), 500
    except Exception as e:
        conn.rollback()
        print("Lỗi:", e)
        return jsonify({
            'success': False,
            'message': 'Lỗi server: ' + str(e)
        }), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()


# Lấy danh sách phiên chat của người dùng
@app.route('/sessions', methods=['GET'])
def get_user_sessions():
    # Xác thực token từ header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({
            'success': False,
            'message': 'Thiếu token xác thực'
        }), 401
    
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = payload['user_id']
    except jwt.ExpiredSignatureError:
        return jsonify({
            'success': False,
            'message': 'Token đã hết hạn'
        }), 401
    except jwt.InvalidTokenError:
        return jsonify({
            'success': False,
            'message': 'Token không hợp lệ'
        }), 401

    # Kết nối database
    conn = get_db_connection()
    if not conn:
        return jsonify({
            'success': False,
            'message': 'Lỗi kết nối database'
        }), 500

    try:
        cursor = conn.cursor(dictionary=True)
        # Truy vấn các phiên chat của user, sắp xếp mới nhất trước
        cursor.execute("""
            SELECT id, title, created_at, updated_at 
            FROM sessions_chat 
            WHERE user_id = %s 
            ORDER BY created_at DESC
        """, (user_id,))
        sessions = cursor.fetchall()

        # Format lại thời gian
        for session in sessions:
            session['created_at'] = session['created_at'].isoformat()
            session['updated_at'] = session['updated_at'].isoformat() if session['updated_at'] else None

        return jsonify({
            'success': True,
            'message': 'Lấy danh sách phiên chat thành công',
            'sessions': sessions
        }), 200

    except mysql.connector.Error as err:
        print("Lỗi database:", err)
        return jsonify({
            'success': False,
            'message': 'Lỗi truy vấn database'
        }), 500
    except Exception as e:
        print("Lỗi:", e)
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


