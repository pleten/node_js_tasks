const {existsSync, mkdirSync} = require("fs");
const {readFile, writeFile} = require( "node:fs/promises");

class FileSystem {
    constructor(fileName) {
        this.fileName = fileName;
        this.dbPath = join(__dirname, '../../db');
        this.db = join(this.dbPath, fileName);
    }

    async read() {
        return !existsSync(this.db) ? {} : JSON.parse(await readFile(this.db, 'utf8'));
    }

    async save(data) {
        if (!existsSync(this.dbPath)) {
            mkdirSync(this.dbPath, { recursive: true });
        }
        try {
            await writeFile(this.db, JSON.stringify(data, null, 2));
            return true;
        }
        catch (e) {
            return false;
        }
    }
}

module.exports = FileSystem;