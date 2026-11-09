#!/usr/bin/env python3
import subprocess
import gzip
import base64
import sys
import os

def upload_file_to_runpod(local_path: str, remote_path: str):
    if not os.path.exists(local_path):
        print(f"Error: {local_path} does not exist")
        sys.exit(1)
        
    print(f"Compressing {local_path} ({os.path.getsize(local_path)} bytes)...")
    with open(local_path, "rb") as f:
        compressed = gzip.compress(f.read())
    b64_data = base64.b64encode(compressed).decode("ascii")
    print(f"Compressed size: {len(compressed)} bytes (Base64 payload: {len(b64_data)} chars)")
    
    # Send in chunks or via python script over SSH
    chunk_size = 50000
    chunks = [b64_data[i:i+chunk_size] for i in range(0, len(b64_data), chunk_size)]
    
    remote_cmds = [
        "rm -f /tmp/transfer.b64",
    ]
    for c in chunks:
        remote_cmds.append(f"cat << 'EOF' >> /tmp/transfer.b64\n{c}\nEOF")
        
    remote_cmds.append(f"""python3 -c "
import gzip, base64
with open('/tmp/transfer.b64', 'r') as f:
    raw_b64 = f.read().replace('\\n', '').strip()
data = gzip.decompress(base64.b64decode(raw_b64))
with open('{remote_path}', 'wb') as f:
    f.write(data)
print('Decompressed and wrote {remote_path}:', len(data), 'bytes')
"
rm -f /tmp/transfer.b64
ls -lh {remote_path}
exit
""")

    payload = "\n".join(remote_cmds)
    
    print("Uploading to RunPod pod owyydwxxemchsy...")
    ssh_cmd = ["ssh", "-tt", "-o", "StrictHostKeyChecking=no", "owyydwxxemchsy-64411ea1@ssh.runpod.io"]
    res = subprocess.run(ssh_cmd, input=payload, capture_output=True, text=True)
    for line in res.stdout.splitlines():
        if "Decompressed" in line or "total" in line or remote_path in line:
            print("[POD]", line.strip())
    print("Upload complete!")

if __name__ == "__main__":
    local_p = sys.argv[1] if len(sys.argv) > 1 else "/Users/hrushi/Downloads/robot.usda"
    remote_p = sys.argv[2] if len(sys.argv) > 2 else "/workspace/robot.usda"
    upload_file_to_runpod(local_p, remote_p)
