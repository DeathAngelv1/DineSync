import uvicorn
import os
import sys

if __name__ == "__main__":
    # Ensure current directory is in sys.path
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    print("==========================================================")
    print("[*] DINESYNC: Smart Restaurant IoT & AI Platform Starting")
    print("[*] Server URL: http://localhost:8000")
    print("[*] WebSocket : ws://localhost:8000/ws")
    print("[*] API Docs  : http://localhost:8000/docs")
    print("==========================================================")
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
