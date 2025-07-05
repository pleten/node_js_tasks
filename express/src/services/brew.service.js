export default class BrewService {
    static scope = 'scoped';
    constructor(brewModel) {
        this.brewModel = brewModel;
    }

    getAll(filters) {
        return this.brewModel.getAll(filters);
    }

    getOne(id) {
        const brew = this.brewModel.getById(id);
        if (!brew) throw Object.assign(new Error('Brew record is not found'), { status: 404 });
        return brew;
    }

    create(data) {
        return this.brewModel.add(data);
    }

    update(id, data) {
        const brew = this.brewModel.update(id, data);
        if (!brew) throw Object.assign(new Error('Brew record is not found'), { status: 404 });
        return brew;
    }

    delete(id) {
        const brew = this.brewModel.delete(id);
        if (!brew) throw Object.assign(new Error('Brew record is not found'), { status: 404 });
        return brew;
    }
}