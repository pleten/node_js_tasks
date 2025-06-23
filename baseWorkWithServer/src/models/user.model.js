const { readFile, writeFile } =  require('node:fs/promises');
const { existsSync, mkdirSync}  =  require( 'fs');
const { join }  =  require( 'node:path');

const DBPath = join(__dirname, '../../db');
const DB = join(DBPath, 'user.db.json');

class UserModel {
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

    async get() {
        return this.#read();
    }

    async getById(id) {
        const users = await this.#read();
        return users.filter(item => item.id === id);
    }

    async create({firstName, lastName, email, role}) {

        const users = await this.#read();
        let newUserId;
        if(users.length > 0) {
            newUserId = users[users.length-1].id + 1;
        } else {
            newUserId = 1;
        }
        const newUser = {firstName, lastName, email, role, id: newUserId};
        users.push(newUser);
        return  this.#save(users)
            .then(() => newUser)
            .catch(() => null);
    }

    async delete(id) {
        const users = await this.#read();
        const newUserList = users.filter(item => item.id !== id);
        return  this.#save(newUserList)
            .then(() => true)
            .catch(() => null);
    }

    async update(id, {firstName, lastName, email, role}) {
        const users = await this.#read();
        const [userToUpdate] = users.filter(item => item.id === id);
        if(userToUpdate) {
            const habitIndex = users.indexOf(userToUpdate);
            users[habitIndex].firstName = firstName || users[habitIndex].firstName;
            users[habitIndex].lastName = lastName || users[habitIndex].lastName;
            users[habitIndex].email = email || users[habitIndex].email;
            users[habitIndex].role = role || users[habitIndex].firstName;
            return this.#save(users)
                .then(() => users[habitIndex])
                .catch(() => null);
        } else {
            return false;
        }
    }
}

module.exports = UserModel;