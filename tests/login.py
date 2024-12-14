import pytest
import sqlite3
from datetime import datetime
from backend.logindatabase import UserDatabase  # Replace with the actual script name

# Fixture to set up a test database
@pytest.fixture
def db():
    # Use an in-memory SQLite database for testing
    db = UserDatabase(db_name=':memory:')
    return db

@pytest.fixture(autouse=True)
def clear_logs(db):
    cursor = db.conn.cursor()
    cursor.execute('DELETE FROM logs')
    db.conn.commit()

# Test registering a new user
def test_register_user(db):
    db.register_user('test_user', 'test_password')
    cursor = db.conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ?', ('test_user',))
    user = cursor.fetchone()
    assert user is not None
    assert user[1] == 'test_user'
    # Generate the hashed password for comparison
    expected_hashed_password = db._hash_password('test_password')
    assert user[2] == expected_hashed_password

# Test registering a duplicate user
def test_register_duplicate_user(db):
    # Register a user
    db.register_user('duplicate_user', 'password123')
    # Try to register the same username
    db.register_user('duplicate_user', 'another_password')
    # Verify only one user exists with that username
    cursor = db.conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ?', ('duplicate_user',))
    users = cursor.fetchall()
    assert len(users) == 1

# Test successful login
def test_login_user(db):
    db.register_user('login_user', 'login_password')
    result = db.login_user('login_user', 'login_password')
    assert result is True
    cursor = db.conn.cursor()
    cursor.execute('SELECT * FROM logs WHERE action = ?', ('login',))
    log = cursor.fetchone()
    assert log is not None
    assert log[1] == 'login'  # action is at index 1

# Test login with incorrect password
def test_login_incorrect_password(db):
    # Register a user
    db.register_user('incorrect_user', 'correct_password')
    # Get the current log count
    cursor = db.conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM logs')
    initial_count = cursor.fetchone()[0]
    # Login with incorrect password
    result = db.login_user('incorrect_user', 'wrong_password')
    assert result is False
    # Verify no new login action is logged
    cursor.execute('SELECT COUNT(*) FROM logs')
    final_count = cursor.fetchone()[0]
    assert final_count == initial_count

# Test login with nonexistent username
def test_login_nonexistent_user(db):
    # Try to login with a nonexistent username
    result = db.login_user('nonexistent_user', 'any_password')
    assert result is False
    # Verify no login action is logged
    cursor = db.conn.cursor()
    cursor.execute('SELECT * FROM logs WHERE action = ?', ('login',))
    logs = cursor.fetchall()
    assert len(logs) == 0

# Test successful logout
def test_logout_user(db):
    db.register_user('logout_user', 'logout_password')
    db.login_user('logout_user', 'logout_password')
    db.logout_user('logout_user')
    cursor = db.conn.cursor()
    cursor.execute('SELECT * FROM logs WHERE action = ?', ('logout',))
    log = cursor.fetchone()
    assert log is not None
    assert log[1] == 'logout'  # action is at index 1

# Test logout with nonexistent username
def test_logout_nonexistent_user(db):
    # Try to logout a nonexistent user
    db.logout_user('nonexistent_user')
    # Verify no logout action is logged
    cursor = db.conn.cursor()
    cursor.execute('SELECT * FROM logs WHERE action = ?', ('logout',))
    logs = cursor.fetchall()
    assert len(logs) == 0