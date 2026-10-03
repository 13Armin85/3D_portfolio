from pathlib import Path
from PIL import Image

# Full path to your folder
FOLDER_PATH = r"D:\\WebDevelopement\\3D website\\3dportfolio\\public\\projects"

folder = Path(FOLDER_PATH)

if not folder.exists():
    print(f"Folder not found: {folder}")
    raise SystemExit

converted = 0

for file_path in folder.iterdir():
    if file_path.is_file() and file_path.suffix.lower() == ".jfif":
        output_path = file_path.with_suffix(".jpg")

        try:
            with Image.open(file_path) as img:
                # JPEG does not support transparency
                if img.mode in ("RGBA", "LA", "P"):
                    img = img.convert("RGB")

                img.save(
                    output_path,
                    format="JPEG",
                    quality=95,
                    optimize=True
                )

            print(f"Converted: {file_path.name} -> {output_path.name}")
            converted += 1

        except Exception as e:
            print(f"Failed to convert {file_path.name}: {e}")

print(f"\nDone. Converted {converted} image(s).")