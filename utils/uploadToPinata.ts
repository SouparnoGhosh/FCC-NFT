import pinataSDK from "@pinata/sdk";
import fs from "fs";
import path from "path";

const pinataApiKey = process.env.PINATA_API_KEY || "";
const pinataApiSecret = process.env.PINATA_API_SECRET || "";
const pinata = pinataSDK(pinataApiKey, pinataApiSecret);

export async function storeImages(imageFilePath: string) {
  const fullImagesPath = path.resolve(imageFilePath);
  const files = fs.readdirSync(fullImagesPath);
  const responses = [];
  for (const fileIndex in files) {
    const readableStreamForFile = fs.createReadStream(
      `${fullImagesPath}/${files[fileIndex]}`
    );
    try {
      const response = await pinata.pinFileToIPFS(readableStreamForFile);
      responses.push(response);
    } catch (error) {
      console.log(error);
    }
  }
  return { responses, files };
}

export async function storeTokeUriMetadata(metadata: Object) {
  try {
    const response = await pinata.pinJSONToIPFS(metadata);
    return response;
  } catch (error) {
    console.log(error);
  }
  return null;
}
