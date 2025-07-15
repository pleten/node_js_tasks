import path from "path";
import fs from "fs";
import os from "os";
import {writeFile} from "node:fs/promises"

export default class ZipModel {
    static scope = 'singleton';
    private THUMBNAIL_DIR = path.join(__dirname, 'thumbnails');
    constructor() {
    }

    async process(zipFile) {
        if (!fs.existsSync(this.THUMBNAIL_DIR)) fs.mkdirSync(this.THUMBNAIL_DIR);
        const startTime = performance.now();

        const tmpZipPath = path.join(os.tmpdir(), `upload_${Date.now()}.zip`);
        await writeFile(tmpZipPath, zipFile);

        let data = [...this.#store.values()];
        if (filters.method) {
            data = data.filter(item => item.method === filters.method);
        }
        if (filters.ratingMin) {
            data = data.filter(item => item.rating >= filters.ratingMin);
        }
        return data;
    }
}