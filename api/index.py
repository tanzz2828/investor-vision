from pathlib import Path
import importlib.util
import sys

backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))
backend_index = backend_dir / "api" / "index.py"
spec = importlib.util.spec_from_file_location("backend_api_index", backend_index)
backend_module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(backend_module)
app = backend_module.app
