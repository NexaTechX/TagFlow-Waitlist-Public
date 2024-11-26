const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = {
  'tagflow-16x16.png': 16,
  'tagflow-32x32.png': 32,
  'tagflow-apple-touch.png': 180,
  'tagflow-192x192.png': 192,
  'tagflow-512x512.png': 512,
  'tagflow-og-image.png': 1200
};

async function generateIcons() {
  const svgBuffer = fs.readFileSync(path.join(__dirname, '../public/tagflow-icon.svg'));

  for (const [filename, size] of Object.entries(sizes)) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, '../public', filename));
    
    console.log(`Generated ${filename}`);
  }
}

generateIcons().catch(console.error); 