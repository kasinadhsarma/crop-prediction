from pathlib import Path
import sys

# Add the project root to Python path
project_root = str(Path(__file__).parent.parent)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from backend import app
from backend import create_app
from backend import CropInput
from backend import DEFAULT_CROP_DETAILS

def test_imports():
    # Test that components are correctly imported
    assert app is not None, "Failed to import app"
    assert create_app is not None, "Failed to import create_app"
    assert CropInput is not None, "Failed to import CropInput"
    assert DEFAULT_CROP_DETAILS is not None, "Failed to import DEFAULT_CROP_DETAILS"
    
    print("All imports successful")

if __name__ == "__main__":
    test_imports()
