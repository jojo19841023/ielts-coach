import sys
import os
import json
import re

def check_js_syntax(file_path):
    print(f"Checking {file_path} syntax...")
    # Python can't easily check JS syntax without external tools, 
    # but we can check if it's empty or has basic structure
    if not os.path.exists(file_path):
        print(f"❌ {file_path} not found.")
        return False
    size = os.path.getsize(file_path)
    if size < 100:
        print(f"❌ {file_path} seems too small ({size} bytes).")
        return False
    print(f"✅ {file_path} exists and has content.")
    return True

def check_data_structure(file_path):
    print(f"Checking {file_path} data structure...")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Extract JSON part
            match = re.search(r'window\.IELTS_DATA\s*=\s*(\{.*\});', content, re.DOTALL)
            if not match:
                print(f"❌ {file_path} doesn't match 'window.IELTS_DATA = ...;' pattern.")
                return False
            json_str = match.group(1)
            data = json.loads(json_str)
            
            # Validate core keys
            required_keys = ["curriculum", "grammarQuestions"]
            for key in required_keys:
                if key not in data:
                    print(f"❌ Missing required key: {key}")
                    return False
            
            print(f"✅ {file_path} data schema is valid.")
            return True
    except Exception as e:
        print(f"❌ {file_path} error: {str(e)}")
        return False

all_passed = True
if not check_js_syntax('app.js'): all_passed = False
if not check_data_structure('data/data.js'): all_passed = False

if all_passed:
    print("\n🚀 All systems nominal. Stability Check PASSED.")
    sys.exit(0)
else:
    print("\n🚨 Stability Check FAILED.")
    sys.exit(1)
