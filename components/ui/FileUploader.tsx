import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from './button'
import type { FileWithPath } from 'react-dropzone'

const FileUploader = ({
  fieldChange,
  mediaUrl,
}: {
  fieldChange: (...event: Array<any>) => void
  mediaUrl: string | undefined
}) => {
  const [_, setFile] = useState<Array<File>>([])
  const [fileUrl, setFileUrl] = useState(mediaUrl || '')
  const onDrop = (acceptedFiles: Array<FileWithPath>) => {
    setFile(acceptedFiles.length > 0 ? acceptedFiles : [])
    fieldChange(acceptedFiles.length > 0 ? acceptedFiles : [])
    setFileUrl(acceptedFiles[0] ? URL.createObjectURL(acceptedFiles[0]) : '')
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.svg'],
    },
  })

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <div className="file_uploader-img relative overflow-hidden">
              <img src={fileUrl} alt="image" className="size-full" />
            </div>
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/icons/file-upload.svg"
            width={96}
            height={77}
            alt="file-upload"
          />
          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag photo here
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>
          <Button type="button" className="shad-button-dark_4">
            Select a photo
          </Button>
        </div>
      )}
    </div>
  )
}

export default FileUploader
