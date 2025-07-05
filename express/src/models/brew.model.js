export default class BrewModel {
    static scope = 'singleton';
    #store = new Map();
    constructor() {
    }

    getAll(filters = {}) {
        let data = [...this.#store.values()];
        if (filters.method) {
            data = data.filter(item => item.method === filters.method);
        }
        if (filters.ratingMin) {
            data = data.filter(item => item.rating >= filters.ratingMin);
        }
        return data;
    }

    getById(id) {
        return this.#store.get(id);
    }

    add(data) {
        const ids = [...this.#store.keys()];
        if(ids.length > 0) {
            const id = ids[ids.length-1] + 1;

            return this.#store.set(id, {id, ...data});
        } else {
            const id = 1;
            return this.#store.set(id, {id, ...data});
        }
    }

    update(id, data){
        if(!this.#store.has(id)) return null;
        const newBrew = {id, ...data};
        this.#store.set(id, newBrew);
        return newBrew;
    }

    delete(id) {
        return this.#store.delete(id);
    }
}