const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'src', 'assets', 'images');
const outputDir = assetsDir;

// Lista de imágenes a optimizar
const images = [
  'imagen-1',
  'imagen-2',
  'imagen-3',
  'imagen-4',
  'imagen-5',
  'imagen-6',
  'imagen-7',
  'imagen-8',
  'imagen-9'
];

// Tamaños para generar
const sizes = [
  { width: 400, suffix: '-small' },
  { width: 800, suffix: '-medium' },
  { width: 1200, suffix: '-large' }
];

// Encontrar archivos existentes
function findImageFile(baseName) {
  const extensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
  for (const ext of extensions) {
    const filePath = path.join(assetsDir, baseName + ext);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  return null;
}

async function optimizeImages() {
  console.log('Iniciando optimización de imágenes...\n');

  let processedCount = 0;
  const results = [];

  for (const image of images) {
    const inputPath = findImageFile(image);

    if (!inputPath) {
      console.log(`⚠ ${image}: No encontrado\n`);
      continue;
    }

    const baseName = image;
    const originalStats = fs.statSync(inputPath);
    const originalSize = originalStats.size;

    console.log(`Procesando ${path.basename(inputPath)}...`);
    console.log(`  Tamaño original: ${(originalSize / 1024).toFixed(2)} KB\n`);

    // Generar múltiples tamaños en WebP
    for (const size of sizes) {
      const outputFileName = `${baseName}${size.suffix}.webp`;
      const outputPath = path.join(outputDir, outputFileName);

      try {
        await sharp(inputPath)
          .resize(size.width, null, { withoutEnlargement: true })
          .webp({ quality: 75 })
          .toFile(outputPath);

        const stats = fs.statSync(outputPath);
        console.log(`  ✓ ${outputFileName} (${(stats.size / 1024).toFixed(2)} KB)`);

        results.push({
          name: outputFileName,
          size: stats.size,
          originalSize: originalSize,
          format: 'WebP'
        });
      } catch (err) {
        console.error(`  ✗ Error creando ${outputFileName}:`, err.message);
      }
    }

    console.log('');
    processedCount++;
  }

  console.log(`\n✓ Optimización completada! (${processedCount} imágenes procesadas)`);

  // Mostrar resumen
  if (results.length > 0) {
    console.log('\n📊 RESUMEN DE OPTIMIZACIÓN:\n');
    console.log('Formato | Archivo | Tamaño Original | Tamaño Optimizado | Reducción %');
    console.log('-'.repeat(80));

    for (const result of results) {
      const reduction = ((1 - result.size / result.originalSize) * 100).toFixed(1);
      console.log(`${result.format.padEnd(7)} | ${result.name.padEnd(25)} | ${((result.originalSize / 1024).toFixed(2) + ' KB').padEnd(15)} | ${((result.size / 1024).toFixed(2) + ' KB').padEnd(17)} | ${reduction}%`);
    }
  }
}

optimizeImages().catch(err => {
  console.error('Error durante la optimización:', err);
  process.exit(1);
});
