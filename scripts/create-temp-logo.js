import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a simple colored square as temporary logo
sharp({
  create: {
    width: 512,
    height: 512,
    channels: 4,
    background: { r: 66, g: 135, b: 245, alpha: 1 }
  }
})
.composite([{
  input: Buffer.from(`<svg width="512" height="512">
    <text x="50%" y="50%" font-family="Arial" font-size="200" fill="white" text-anchor="middle" dominant-baseline="middle">
      TF
    </text>
  </svg>`),
  top: 0,
  left: 0,
}])
.png()
.toFile(join(__dirname, '../src/assets/logo.png'))
.then(() => console.log('Temporary logo created!'))
.catch(err => console.error('Error creating temporary logo:', err)); 