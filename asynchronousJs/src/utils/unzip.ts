import decompress from "decompress";

export const unzip = async (zipPath: string, unzipPath: string): Promise<string[]> => {
  console.log(`Unzipping ${zipPath} to ${unzipPath}`);
  return decompress(zipPath, unzipPath).then((files: decompress.File[]) => {
      return files.map((file: decompress.File) => unzipPath + '/' + file.path)
    }).catch(e => e);
}