import decompress from "decompress";

export const unzip = async (zipPath: string, unzipPath?: string) => {
    decompress(zipPath, unzipPath).then(files => {
        console.log(files);
    }).catch(e => e);
}