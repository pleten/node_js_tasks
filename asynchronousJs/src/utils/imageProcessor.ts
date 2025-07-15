import fs from "fs";
import path from "path";
import os from "os";
import {Worker} from "worker_threads";
import unzipper from 'unzipper';

export const imageProcessor = async (folderPath) => {
    await fs.createReadStream(folderPath)
        .pipe(unzipper.Parse())
        .on('entry', (entry) => {
            const fileName = entry.path;
            const ext = path.extname(fileName).toLowerCase();
            const imagePath = path.join(os.tmpdir(), fileName);

            if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                extractedImages.push(imagePath);
                entry.pipe(fs.createWriteStream(imagePath));
            } else {
                entry.autodrain();
            }
        })
        .promise();

    if (extractedImages.length === 0) {
        return res.status(400).json({ error: 'No valid image files in zip.' });
    }

    const stats = {
        totalImages: extractedImages.length,
        thumbnailsCreated: 0,
        failed: 0,
    };

    await Promise.all(
        extractedImages.map(image =>
            new Promise((resolve) => {
                const worker = new Worker('./worker.js', {
                    workerData: {
                        inputPath: image,
                        outputDir: THUMBNAIL_DIR
                    }
                });

                worker.on('message', (msg) => {
                    if (msg.success) stats.thumbnailsCreated++;
                    else stats.failed++;
                });

                worker.on('error', () => stats.failed++);
                worker.on('exit', () => resolve());
            })
        )
    );

    const duration = Date.now() - startTime;
    res.json({ ...stats, durationMs: duration });
}