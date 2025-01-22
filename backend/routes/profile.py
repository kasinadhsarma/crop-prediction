# backend/routes/profile.py
from flask import Blueprint, request, jsonify
from backend.database import UserDatabase
import hashlib

profile = Blueprint('profile', __name__)
db = UserDatabase()

@profile.route('/api/profile', methods=['POST'])
def update_profile():
    try:
        data = request.json
        user_id = request.headers.get('user-id')  # Get from auth header
        
        if not user_id:
            return jsonify({'error': 'Unauthorized'}), 401
            
        # Hash password if provided
        if data.get('password'):
            data['password'] = hashlib.sha256(
                data['password'].encode()
            ).hexdigest()
            
        # Update user in database
        success = db.update_user(
            user_id=user_id,
            name=data.get('name'),
            email=data.get('email'),
            password=data.get('password')
        )
        
        if success:
            return jsonify({'message': 'Profile updated successfully'})
        else:
            return jsonify({'error': 'Failed to update profile'}), 400
            
    except Exception as e:
        print(f"Error updating profile: {e}")
        return jsonify({'error': 'Internal server error'}), 500