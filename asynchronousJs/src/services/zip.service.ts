import ZipModel from '../models/zip.model'

export default class ZipService {
    static scope = 'scoped';
    zipModel: ZipModel;
    constructor(zipModel: ZipModel) {
        this.zipModel = zipModel;
    }

    process(zipFile) {
        return this.zipModel.process(zipFile);
    }
}