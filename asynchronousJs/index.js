const express = require('express');
const unzipper = require('unzipper');
const fs = require('fs');
const path = require('path');
const { Worker } = require('worker_threads');
const os = require('os');

const app = express();
const THUMBNAIL_DIR = path.join(__dirname, 'thumbnails');
if (!fs.existsSync(THUMBNAIL_DIR)) fs.mkdirSync(THUMBNAIL_DIR);

// Accept raw binary
app.use(express.raw({ type: 'application/zip', limit: '50mb' }));

app.post('/upload', async (req, res) => {
    const startTime = Date.now();

    const tmpZipPath = path.join(os.tmpdir(), `upload_${Date.now()}.zip`);
    fs.writeFileSync(tmpZipPath, req.body);

    const extractedImages = [];

    try {
        await fs.createReadStream(tmpZipPath)
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

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process images.' });
    } finally {
        fs.rm(tmpZipPath,{recursive:true});
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
