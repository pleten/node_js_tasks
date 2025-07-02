const FileSystem = require('../lib/fileSystem')

class Model {
    constructor() {
        this.fs = new FileSystem('document.json')
    }

    async get(key) {
        const data = await this.fs.read();

        return data[key];
    }

    async set(key, value) {
        const data = await this.fs.read();
        data[key] = value;
        return this.fs.save(data);
    }
}

module.exports = Model;