"use client";

import { toast } from "@/hooks/use-toast";
import config from "@/lib/config";
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { set } from "zod";

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imageKit`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();

    const { signature, expire, token } = data;

    return { signature, expire, token };
  } catch (e: any) {
    throw new Error(`Authentication failed: ${e.message}`);
  }
};

const { publicKey, urlEndpoint } = config.env.imagekit;

const ImageUpload = ({
  onFileChange,
}: {
  onFileChange: (filePath: string) => void;
}) => {
  const iKUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const onError = (error: any) => {
    console.log(error);
    toast({
      title: "Image Upload Failed",
      description: "Your image could not be uploaded. Please try again.",
      variant: "destructive",
    });
  };

  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);
    setUploading(false);
    toast({
      title: "Image uploaded successfully",
      description: `${res.filePath} uploaded successfully`,
    });
  };

  const onUploadStart = () => {
    setUploading(true);
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        className="hidden"
        ref={iKUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        onUploadStart={onUploadStart}
        fileName="test-upload.png"
      ></IKUpload>
      <button
        className="upload-btn"
        onClick={(e) => {
          e.preventDefault();
          if (iKUploadRef.current) {
            // @ts-ignore
            iKUploadRef.current.click();
          }
        }}
        disabled={uploading}
      >
        {uploading ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <>
            <Image
              src="/icons/upload.svg"
              alt="upload-icon"
              width={20}
              height={20}
              className="object-contain"
            />
            <p className="text-base text-light-100">Upload a File</p>
            {file && <p className="upload-filename">{file.filePath}</p>}
          </>
        )}
      </button>
      {file && (
        <IKImage
          path={file.filePath}
          alt={file.filePath}
          width={500}
          height={300}
        />
      )}
    </ImageKitProvider>
  );
};

export default ImageUpload;
