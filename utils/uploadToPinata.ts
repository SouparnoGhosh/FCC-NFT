import pinataSDK from "@pinata/sdk";
import fs from "fs";
import path from "path";

const pinataApiKey = process.env.PINATA_API_KEY || "";
const pinataApiSecret = process.env.PINATA_API_SECRET || "";
const pinata = pinataSDK(pinataApiKey, pinataApiSecret);

export async function storeImages(imageFilePath: string) {
  const fullImagesPath = path.resolve(imageFilePath);
  return fullImagesPath;
}
