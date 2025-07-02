class Model {
    constructor() {
    }

    async get(key) {
        const queryParams = new URLSearchParams({
            key,
        }).toString();
        const url = process.env.REDIS_URL + '/get?' + queryParams;
        return (await fetch(url)).json();
    }

    async add(key, value) {
        const url = process.env.REDIS_URL + '/set';
        return (await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                key,
                value
            })
        })).json();
    }
}

module.exports = Model;