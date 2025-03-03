from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from CONFIG import Config
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

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

if __name__ == '__main__':
    app.run(debug=True)