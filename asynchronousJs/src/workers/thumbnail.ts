import sharp from "sharp";
import { workerData, parentPort } from "node:worker_threads";
import path from "path";
import { CustomMutex } from "../utils/mutex.js";

const { inputPath, outputDir, sharedBuffer } = workerData;
const fileName = `thumb_${path.basename(inputPath)}`;
const counter = new Int32Array(sharedBuffer as SharedArrayBuffer);
const customMutex = new CustomMutex(counter);
const LOCK_INDEX = 2;
const outputPath = path.join(outputDir, fileName);
(async () => {
        try {
            await sharp(inputPath)
                .resize({ width: 150 })
                .toFile(outputPath);
            customMutex.lock(LOCK_INDEX);
            const current = counter[0];
            counter[0] = current + 1;
            parentPort?.postMessage({ imagePath: path.join(outputDir, encodeURI(fileName)) });
            customMutex.unlock(LOCK_INDEX);
        } catch (err) {
            customMutex.lock(LOCK_INDEX);
            console.error(`Error processing image ${fileName}:`, err);
            const current = counter[1];
            counter[1] = current + 1;
            customMutex.unlock(LOCK_INDEX);
        }
    })();

