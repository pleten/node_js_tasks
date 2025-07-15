const sharp = require('sharp');
const { workerData, parentPort } = require('worker_threads');
const path = require('path');
const fs = require('fs');

(async () => {
    const { inputPath, outputDir } = workerData;
    const fileName = path.basename(inputPath);
    const outputPath = path.join(outputDir, `thumb_${fileName}`);

    try {
        await sharp(inputPath)
            .resize({ width: 150 })
            .toFile(outputPath);

        fs.unlinkSync(inputPath); // Remove original after processing

        parentPort.postMessage({ success: true });
    } catch (err) {
        console.error(`Error processing ${inputPath}:`, err);
        parentPort.postMessage({ success: false });
    }
})();
