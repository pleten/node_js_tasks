const Model = require('../models/model');

class Service {
    constructor() {
        this.model = new Model();
    }

   async get(key) {
       return {
           value: await this.model.get(key) || null
       }
    }

    async set(data) {
        if(!data.key || !data.value) {
            const missingFields = [];
            if(!data.key) missingFields.push('key');
            if(!data.value) missingFields.push('value');
            return {
                error: `Following required fields are missing: ${missingFields.join(', ')}!`,
            };
        }

        const resp = await this.model.set(data.key, data.value);
        console.log('response', )

        return (resp) ? { 'ok': true } : { 'ok': false }
    }
}

module.exports = Service;