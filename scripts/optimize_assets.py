import os
import subprocess
import glob

PROJECT_ROOT = "/Users/darkkwang/.openclaw/workspace-developer/dating-site"
PUBLIC_DIR = os.path.join(PROJECT_ROOT, "public/profiles")
BACKUP_DIR = os.path.join(PROJECT_ROOT, "public/profiles_backup")
SRC_DIR = os.path.join(PROJECT_ROOT, "src")
PRISMA_DIR = os.path.join(PROJECT_ROOT, "prisma")

# Ensure backup dir exists
os.makedirs(BACKUP_DIR, exist_ok=True)

def convert_images():
    png_files = glob.glob(os.path.join(PUBLIC_DIR, "*.png"))
    print(f"Found {len(png_files)} PNG files to convert.")

    for file_path in png_files:
        file_name = os.path.basename(file_path)
        name_only = os.path.splitext(file_name)[0]
        jpg_path = os.path.join(PUBLIC_DIR, f"{name_only}.jpg")
        
        # Skip if already exists
        if os.path.exists(jpg_path):
            print(f"Skipping {file_name} (jpg exists)")
            continue

        print(f"Converting {file_name} to JPG...")
        try:
            # sips -s format jpeg -s formatOptions 80 input.png --out output.jpg
            subprocess.run([
                "sips", "-s", "format", "jpeg", "-s", "formatOptions", "80",
                file_path, "--out", jpg_path
            ], check=True, stdout=subprocess.DEVNULL)
            
            # Move original to backup
            backup_path = os.path.join(BACKUP_DIR, file_name)
            os.rename(file_path, backup_path)
            
        except subprocess.CalledProcessError as e:
            print(f"Error converting {file_name}: {e}")

def update_references(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith((".ts", ".tsx", ".js", ".json", ".prisma")):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                    
                    if ".png" in content:
                        # Replace .png with .jpg
                        new_content = content.replace(".png", ".jpg")
                        
                        if content != new_content:
                            print(f"Updating references in {file_path}")
                            with open(file_path, "w", encoding="utf-8") as f:
                                f.write(new_content)
                except Exception as e:
                    print(f"Could not read {file_path}: {e}")

if __name__ == "__main__":
    print("Starting optimization...")
    convert_images()
    print("Updating source code references...")
    update_references(SRC_DIR)
    update_references(PRISMA_DIR)
    print("Done!")
