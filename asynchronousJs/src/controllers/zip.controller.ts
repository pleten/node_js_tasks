import ZipService from "../services/zip.service";

export default class ZipController {
    static scope = 'scoped';
    zipService: ZipService;
    constructor(zipService: ZipService) {
        this.zipService = zipService;
    }

    upload = (req, res) => res.status(201).json(this.zipService.process(req.body));
}