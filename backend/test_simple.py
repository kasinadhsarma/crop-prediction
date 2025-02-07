try:
    from backend.croppredection import app
    print("✓ Successfully imported app directly from croppredection")
except Exception as e:
    print(f"✗ Failed to import app directly: {e}")

try:
    from backend import app
    print("✓ Successfully imported app from backend package")
except Exception as e:
    print(f"✗ Failed to import app from backend package: {e}")

try:
    from backend.croppredection import CropInput
    print("✓ Successfully imported CropInput directly from croppredection")
except Exception as e:
    print(f"✗ Failed to import CropInput directly: {e}")

try:
    from backend import CropInput
    print("✓ Successfully imported CropInput from backend package")
except Exception as e:
    print(f"✗ Failed to import CropInput from backend package: {e}")
