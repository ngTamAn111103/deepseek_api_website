from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from CONFIG import Config
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from openai import OpenAI
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

# API endpoint for Google login/signup
@app.route('/api/auth/google', methods=['POST'])
def google_login():
    token = request.json.get('token')
    if not token:
        return jsonify({'error': 'Token is required'}), 400

    try:
        # Verify the token with Google
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)

        # Check if the token is valid and issued by Google
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        # Extract user information from the token
        user_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo.get('name', '')
        picture = idinfo.get('picture', '')

        # Connect to the database
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = conn.cursor(dictionary=True)

        # Check if the user already exists
        cursor.execute("SELECT * FROM users WHERE google_id = %s", (user_id,))
        user = cursor.fetchone()

        if not user:
            # If the user does not exist, create a new user
            cursor.execute(
                "INSERT INTO users (google_id, email, name, picture) VALUES (%s, %s, %s, %s)",
                (user_id, email, name, picture)
            )
            conn.commit()
            user_id = cursor.lastrowid
            user = {
                'id': user_id,
                'google_id': user_id,
                'email': email,
                'name': name,
                'picture': picture
            }
        else:
            # If the user exists, return the existing user
            user = {
                'id': user['id'],
                'google_id': user['google_id'],
                'email': user['email'],
                'name': user['name'],
                'picture': user['picture']
            }

        # Generate a token (you can use JWT or any other method to generate a token)
        # For simplicity, we'll just return a dummy token
        token = 'dummy_token'

        # Return the token and user information
        return jsonify({
            'success': True,
            'token': token,
            'user': user
        })

    except ValueError as e:
        # Invalid token
        return jsonify({'error': 'Invalid token', 'details': str(e)}), 401
    except Exception as e:
        # Other errors
        print("Error:", e)
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        if conn:
            conn.close()

# Test route
@app.route('/api/test', methods=['GET'])
def test_connection():
    return jsonify({'message': 'Backend is working!'})

# Sample API endpoint
@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users")
        results = cursor.fetchall()
        return jsonify(results)
    except Exception as e:
        print("Query error:", e)
        return jsonify({'error': 'Database query failed'}), 500
    finally:
        if conn:
            conn.close()

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
    
# API Chat deepseek
@app.route('/api/deepseek', methods=['POST'])
def deepseek_api():
    # Lấy dữ liệu JSON từ request
    data = request.get_json()
    user_text = data.get('text')
    if not user_text:
        return jsonify({'error': 'Chưa cung cấp text'}), 400
    print(user_text)
    try:
        # Đọc API key từ file
        api_key = read_api_key()
        if not api_key:
            return jsonify({'error': 'API key không tồn tại'}), 500

        # Tạo client cho Deepseek
        client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")

        # Gọi API của Deepseek với text người dùng gửi
        response = client.chat.completions.create(
            model="deepseek-reasoner",
            messages=[
                {"role": "system", "content": "You are a front end programmer"},
                {"role": "user", "content": user_text},
            ],
            stream=False
        )
        answer = response.choices[0].message.content

        return jsonify({'response': answer})

    except Exception as e:
        print("Deepseek API error:", e)
        return jsonify({'error': 'Lỗi khi xử lý yêu cầu'}), 500


if __name__ == '__main__':
    app.run(debug=True)