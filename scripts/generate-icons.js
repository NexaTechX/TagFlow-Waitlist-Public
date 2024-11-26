import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [16, 32, 48, 64, 128, 256];
const inputImage = join(__dirname, '../src/assets/logo.png');

async function generateIcons() {
  try {
    // Generate apple touch icon
    await sharp(inputImage)
      .resize(180, 180)
      .toFile(join(__dirname, '../public/tagflow-apple-touch.png'));

    // Generate favicons
    for (const size of sizes) {
      await sharp(inputImage)
        .resize(size, size)
        .toFile(join(__dirname, `../public/favicon-${size}x${size}.png`));
    }

    console.log('Icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons(); 