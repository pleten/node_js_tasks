import ZipModel from '../models/zip.model.js'

export default class ZipService {
    static scope = 'scoped';
    zipModel: ZipModel;
    constructor(zipModel: ZipModel) {
        this.zipModel = zipModel;
    }

    process(zipFile: Buffer | string, requestId: string): Promise<any> {
        return this.zipModel.process(zipFile, requestId);
    }
}