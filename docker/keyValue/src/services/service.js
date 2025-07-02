const Model = require('../models/model');

class Service {
    constructor() {
        this.model = new Model();
    }

   async get(key) {
       return this.model.get(key);
    }

    async post(data) {
        if(!data.key || !data.value) {
            const missingFields = [];
            if(!data.key) missingFields.push('key');
            if(!data.value) missingFields.push('value');
            return {
                error: `Following required fields are missing: ${missingFields.join(', ')}!`,
            };
        }

        const response = await this.model.add(data.key, data.value);

        return (response['ok']) ? { message: 'Record has been added!' } : { error: 'Adding record has been failed!' };
    }
}

module.exports = Service;