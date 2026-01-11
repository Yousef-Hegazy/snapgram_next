import Image from "next/image";
import { useCallback, useState } from "react";
import { type FileWithPath, useDropzone } from "react-dropzone";

type ProfileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [fieldChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} className="cursor-pointer" />

      <div className="cursor-pointer flex-center gap-4">
        <div className="relative h-24 w-24 rounded-full overflow-hidden">
          <Image
            fill
            src={fileUrl || "/assets/icons/profile-placeholder.svg"}
            alt="image"
            className="object-cover object-top"
          />
        </div>
        <p className="text-primary-500 small-regular md:bbase-semibold">Change profile photo</p>
      </div>
    </div>
  );
};

export default ProfileUploader;
