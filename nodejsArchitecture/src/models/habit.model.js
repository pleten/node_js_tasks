import { readFile, writeFile } from 'node:fs/promises';
import { existsSync, mkdirSync} from 'fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DBPath = join(__dirname, '../../db');
const DB = join(DBPath, 'habits.json');

class HabitModel {
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

    async add(name, freq) {
        const habits = await this.#read();
        const newHabit = {
            name,
            freq
        };
        if(habits.length > 0) {
            newHabit.id = habits[habits.length-1].id + 1;
        } else {
            newHabit.id = 1;
        }
        habits.push(newHabit);
        return  this.#save(habits)
            .then(() => true)
            .catch(() => false);
    }

    async list() {
        return this.#read();
    }

    async exist(id) {
        const habits = await this.#read();
        return habits.some(habit => habit.id === id);
    }

    async delete(id) {
        const habits = await this.#read();
        const newHabits = habits.filter(item => item.id !== id);
        return this.#save(newHabits)
            .then(() => true)
            .catch(() => false);
    }

    async update(id, {name, freq}) {
        const habits = await this.#read();
        const [habitToUpdate] = habits.filter(item => item.id === id);
        if(habitToUpdate) {
            const habitIndex = habits.indexOf(habitToUpdate);
            habits[habitIndex].name = name || habits[habitIndex].name;
            habits[habitIndex].freq = freq || habits[habitIndex].freq;
            return this.#save(habitToUpdate)
                .then(() => true)
                .catch(() => false);
        } else {
            return false;
        }
    }
}

export default HabitModel;