from PIL import Image, ImageDraw
import math

def distance(c1, c2):
    (r1, g1, b1) = c1
    (r2, g2, b2) = c2
    return math.sqrt((r1 - r2)**2 + (g1 - g2)**2 + (b1 - b2)**2)

def remove_background_and_artifacts():
    img_path = 'frontend/public/hcv-logo.png'
    out_path = 'frontend/public/hcv-logo-transparent.png'
    
    img = Image.open(img_path)
    img = img.convert("RGBA")
    
    datas = img.getdata()
    
    newData = []
    
    # Sample background color - likely white (255,255,255) if it's a standard logo image
    bg_color = (255, 255, 255)
    
    # Check top-left pixel to be sure
    top_left = img.getpixel((0,0))
    print(f"Top-left pixel: {top_left}")
    
    if distance(top_left[:3], (255, 255, 255)) < 50:
         bg_color = top_left[:3]
    
    # Tolerance
    cutoff = 50 
    
    for item in datas:
        # item is (r,g,b,a)
        if distance(item[:3], bg_color) < cutoff:
            newData.append((255, 255, 255, 0)) # Transparent
        else:
            newData.append(item)
    
    img.putdata(newData)
    
    # We don't need Artifact removal for this one probably, but let's just save.
    img.save(out_path, "PNG")
    print("Saved transparent HCV logo.")

if __name__ == '__main__':
    remove_background_and_artifacts()
