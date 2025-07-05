export default class BrewController {
    static scope = 'scoped';
    constructor(brewService) {
        this.brewService = brewService;
    }

    index = (_req, res) => res.json(this.brewService.getAll(_req.query));

    read = (req, res) => res.json(this.brewService.getOne(+req.params.id));

    create = (req, res) => res.status(201).json(this.brewService.create(req.body));

    update = (req, res) => res.status(201).json(this.brewService.update(+req.params.id, req.body));

    delete = (req, res) => res.status(204).json(this.brewService.delete(+req.params.id));

}