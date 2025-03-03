import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DB_HOST = os.getenv('DB_HOST')
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_NAME = os.getenv('DB_NAME')
    SECRET_KEY = '$2y$04$JTYOqJ7BFwg44SuhFH7Viu0JbNpErxvoT8XWjCAU3.8zAJMJFk42e' 
