import sys
import importlib.util

def debug_import(module_name):
    print(f"\nDebugging import for {module_name}:")
    
    # Check if module is in sys.modules
    if module_name in sys.modules:
        print(f"Module already in sys.modules at: {sys.modules[module_name].__file__}")
    else:
        print("Module not in sys.modules")

    # Try to find the spec
    spec = importlib.util.find_spec(module_name)
    if spec:
        print(f"Found module spec at: {spec.origin}")
        if spec.submodule_search_locations:
            print(f"Submodule search locations: {spec.submodule_search_locations}")
    else:
        print("Could not find module spec")

    # Print sys.path
    print("\nPython path:")
    for path in sys.path:
        print(f"  {path}")

print("=== Import Debug Information ===")
debug_import('backend')
debug_import('backend.croppredection')
debug_import('backend.results')
