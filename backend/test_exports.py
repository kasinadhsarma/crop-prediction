from pathlib import Path
import sys

# Add the project root to Python path
project_root = str(Path(__file__).parent.parent)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

print("Testing imports from backend.croppredection...")

try:
    from backend.croppredection import DEFAULT_CROP_DETAILS
    print("✓ DEFAULT_CROP_DETAILS imported successfully:", DEFAULT_CROP_DETAILS is not None)
except Exception as e:
    print("✗ Failed to import DEFAULT_CROP_DETAILS:", e)

try:
    from backend.croppredection import CropInput
    print("✓ CropInput imported successfully:", CropInput is not None)
except Exception as e:
    print("✗ Failed to import CropInput:", e)

try:
    from backend.croppredection import create_app
    print("✓ create_app imported successfully:", create_app is not None)
except Exception as e:
    print("✗ Failed to import create_app:", e)

try:
    from backend.croppredection import app
    print("✓ app imported successfully:", app is not None)
except Exception as e:
    print("✗ Failed to import app:", e)

print("\nTesting imports from backend package...")

try:
    from backend import DEFAULT_CROP_DETAILS
    print("✓ DEFAULT_CROP_DETAILS imported successfully:", DEFAULT_CROP_DETAILS is not None)
except Exception as e:
    print("✗ Failed to import DEFAULT_CROP_DETAILS:", e)

try:
    from backend import CropInput
    print("✓ CropInput imported successfully:", CropInput is not None)
except Exception as e:
    print("✗ Failed to import CropInput:", e)

try:
    from backend import create_app
    print("✓ create_app imported successfully:", create_app is not None)
except Exception as e:
    print("✗ Failed to import create_app:", e)

try:
    from backend import app
    print("✓ app imported successfully:", app is not None)
except Exception as e:
    print("✗ Failed to import app:", e)
