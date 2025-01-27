import config from "@/lib/config";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const { privateKey, publicKey, urlEndpoint } = config.env.imagekit;

const imageKit = new ImageKit({
  publicKey: publicKey,
  privateKey: privateKey,
  urlEndpoint: urlEndpoint,
});

export async function GET() {
  return NextResponse.json(imageKit.getAuthenticationParameters());
}
