import sqlite3
from datetime import datetime
import hashlib

class UserDatabase:
    def __init__(self, db_name='users.db'):
        self.db_name = db_name
        self.conn = sqlite3.connect(self.db_name)
        self.create_user_table()
        self.create_log_table()

    def create_user_table(self):
        cursor = self.conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        ''')
        self.conn.commit()

    def create_log_table(self):
        cursor = self.conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS logs (
                log_id INTEGER PRIMARY KEY AUTOINCREMENT,
                action TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                timestamp TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(user_id)
            )
        ''')
        self.conn.commit()

    def _hash_password(self, password):
        return hashlib.sha256(password.encode()).hexdigest()

    def _get_user_id(self, username):
        cursor = self.conn.cursor()
        cursor.execute('SELECT user_id FROM users WHERE username = ?', (username,))
        result = cursor.fetchone()
        return result[0] if result else None

    def register_user(self, username, password):
        cursor = self.conn.cursor()
        try:
            hashed_password = self._hash_password(password)
            cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', 
                         (username, hashed_password))
            self.conn.commit()
            print(f"User '{username}' registered successfully.")
            return True
        except sqlite3.IntegrityError:
            print(f"Username '{username}' is already taken.")
            return False

    def login_user(self, username, password):
        cursor = self.conn.cursor()
        hashed_password = self._hash_password(password)
        cursor.execute('SELECT user_id FROM users WHERE username = ? AND password = ?', 
                      (username, hashed_password))
        result = cursor.fetchone()
        if result:
            user_id = result[0]
            self.log_action(user_id, 'login')
            print(f"User '{username}' logged in.")
            return True
        else:
            print("Invalid username or password.")
            return False

    def logout_user(self, username):
        user_id = self._get_user_id(username)
        if user_id:
            self.log_action(user_id, 'logout')
            print(f"User '{username}' logged out.")
            return True
        else:
            print(f"User '{username}' not found.")
            return False

    def log_action(self, user_id, action):
        try:
            cursor = self.conn.cursor()
            timestamp = datetime.now().isoformat()
            cursor.execute('INSERT INTO logs (action, user_id, timestamp) VALUES (?, ?, ?)', 
                         (action, user_id, timestamp))
            self.conn.commit()
            return True
        except sqlite3.Error as e:
            print(f"Error logging action: {e}")
            return False

    def clear_logs(self):
        cursor = self.conn.cursor()
        cursor.execute('DELETE FROM logs')
        self.conn.commit()

    def close(self):
        self.conn.close()

if __name__ == "__main__":
    db = UserDatabase()
    db.register_user('new_user', 'secure_password')
    db.login_user('new_user', 'secure_password')
    db.logout_user('new_user')
    db.close()