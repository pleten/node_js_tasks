import { readFile, writeFile } from 'node:fs/promises';
import { existsSync, mkdirSync} from 'fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DBPath = join(__dirname, '../../db');
const DB = join(DBPath, 'executions.json');

class ExecutionModel {
    constructor() {
    }

    async #read() {
        return !existsSync(DB) ? [] : JSON.parse(await readFile(DB, 'utf8'));
    }

    async #save(data) {
        if (!existsSync(DBPath)){
            mkdirSync(DBPath, { recursive: true });
        }
        return writeFile(DB, JSON.stringify(data, null, 2));
    }

    async done(id, daysPast = 0) {
        const executions = await this.#read();
        const date = new Date();
        const newItem = {
            id,
            date: date.setDate(date.getDate() - daysPast)
        };
        executions.push(newItem);
        return  this.#save(executions)
            .then(() => true)
            .catch(() => false);
    }

    async stats() {
        return this.#read();
    }

    async delete(id) {
        const executions = await this.#read();
        const newExecutions = executions.filter(item => item.id !== id);
        return  this.#save(newExecutions)
            .then(() => true)
            .catch(() => false);
    }
}

export default ExecutionModel;