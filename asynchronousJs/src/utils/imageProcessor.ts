import {Worker} from "worker_threads";
import path from "path";

interface ImageProcessorResponse {
    stats?: {
        totalImages: number;
        processed: number;
        skipped: number;
    };
    thumbImages?: string[];
    error?: string;
}

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const imageProcessor = async (imagePaths: string[], thumbnailDir: string): Promise<ImageProcessorResponse> => {

    if (imagePaths.length === 0) {
        return { error: 'No images provided' };
    }
    const sharedBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 3);
    const counter = new Int32Array(sharedBuffer);
    const thumbImages: string[] = [];

    await Promise.allSettled(
      imagePaths.map(image =>
            new Promise((resolve) => {
                const worker = new Worker(path.join(__dirname,'../workers/thumbnail.js'), {
                    workerData: {
                        inputPath: image,
                        outputDir: thumbnailDir,
                        sharedBuffer,
                    }

                });

                worker.on('message', (msg) => {
                    if (msg.imagePath) thumbImages.push(msg.imagePath);
                });

                // @ts-ignore
                worker.on('exit', () => resolve());
            })
        )
    );
    return {stats: {totalImages: imagePaths.length, processed: counter[0], skipped: counter[1]}, thumbImages};
}