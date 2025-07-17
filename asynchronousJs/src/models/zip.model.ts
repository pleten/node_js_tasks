import path from "path";
import fs from "fs";
import os from "os";
import { writeFile } from "node:fs/promises";
import { unzip } from "../utils/unzip.js";
import { imageProcessor } from "../utils/imageProcessor.js";

export default class ZipModel {
  static scope = "singleton";
  private THUMBNAIL_DIR = path.join(process.cwd(), "thumbnails");

  constructor() {}

  async process(zipFile: Buffer | string, requestId: string): Promise<object> {
    let tmpDir = path.join(os.tmpdir(), requestId);
    const imagePaths = [];
    const startTime = performance.now();
    const imageThumbFolder = path.join(this.THUMBNAIL_DIR, requestId);
    if (!fs.existsSync(this.THUMBNAIL_DIR)) fs.mkdirSync(this.THUMBNAIL_DIR);
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    fs.mkdirSync(imageThumbFolder);
    const tmpZipPath = typeof zipFile == 'string' && zipFile.includes('upload')
        ? path.join(process.cwd(), zipFile)
        : path.join(tmpDir, `upload_${requestId}.zip`);

    if(typeof zipFile !== 'string') {
      await writeFile(tmpZipPath, zipFile);
    }

    imagePaths.push(...(await unzip(tmpZipPath, tmpDir)));

    return imageProcessor(imagePaths, imageThumbFolder).then((resp) => {
      if(resp?.error) return resp;
      fs.rm(tmpZipPath, { recursive: true }, () => {});
      fs.rm(tmpDir, { recursive: true }, () => {});
      return {
        stats: { ...resp.stats, duration: performance.now() - startTime},
        thumbImages: resp.thumbImages
      };
    });
  }
}
