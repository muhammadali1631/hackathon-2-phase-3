"""
Test script for the Todo API backend
This script tests various API endpoints to ensure they work as expected
"""
import requests
import json
from datetime import datetime

# Base URL for the API (adjust as needed)
BASE_URL = "http://localhost:8000/api"

# Example JWT token (this would come from Better Auth in real usage)
# For testing purposes, we'll use a mock token that decodes to user_id=1
# In a real implementation, you'd get this from the Better Auth frontend
MOCK_JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImV4cCI6MzQ3Mzg3ODQwMH0.zNlyKv0a_hYn3JUkH3uQy6d0gRrX6jZ0p6Yz9m8vY2o"

def get_headers():
    """Get headers with JWT token for authenticated requests"""
    return {
        "Authorization": f"Bearer {MOCK_JWT_TOKEN}",
        "Content-Type": "application/json"
    }

def test_task_creation():
    """Test task creation functionality"""
    print("Testing task creation...")

    # Create a test task
    task_data = {
        "title": "Test task from API test",
        "description": "This is a test task created via the API"
    }

    try:
        response = requests.post(f"{BASE_URL}/tasks",
                                headers=get_headers(),
                                json=task_data)

        if response.status_code == 201:
            print(f"✓ Task created successfully: {response.json()}")
            return response.json().get('id')
        else:
            print(f"✗ Failed to create task: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"✗ Error creating task: {e}")
        return None

def test_task_creation_without_auth():
    """Test that task creation fails without authentication"""
    print("Testing task creation without authentication...")

    task_data = {
        "title": "Unauthorized task creation",
        "description": "This should fail without auth"
    }

    try:
        response = requests.post(f"{BASE_URL}/tasks",
                                headers={"Content-Type": "application/json"},
                                json=task_data)

        if response.status_code == 401:
            print("✓ Correctly rejected unauthorized task creation")
            return True
        else:
            print(f"✗ Should have been rejected but got: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Error testing unauthorized creation: {e}")
        return False

def test_get_tasks():
    """Test getting tasks for the authenticated user"""
    print("Testing task retrieval...")

    try:
        response = requests.get(f"{BASE_URL}/tasks",
                               headers=get_headers())

        if response.status_code == 200:
            tasks = response.json()
            print(f"✓ Retrieved {len(tasks)} tasks")
            return tasks
        else:
            print(f"✗ Failed to retrieve tasks: {response.status_code} - {response.text}")
            return []
    except Exception as e:
        print(f"✗ Error retrieving tasks: {e}")
        return []

def run_tests():
    """Run all tests"""
    print("Starting API tests...\n")

    # Test unauthorized access first
    test_task_creation_without_auth()

    # Test task creation
    task_id = test_task_creation()

    # Test task retrieval
    tasks = test_get_tasks()

    print("\nTests completed!")

if __name__ == "__main__":
    run_tests()