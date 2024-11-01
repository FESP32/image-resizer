import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload } from 'react-icons/fa';
import { RxReset } from 'react-icons/rx';
import { BsFileEarmarkArrowDownFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { useGallery } from '@/context/GalleryContext';

import GradientButton from '@/components/common/GradientButton';
import Loader from '@/components/common/Loader';
import { GalleryImageDto, ResizeResultDto } from '@/types';

const Resizer: React.FC = () => {
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { setImages } = useGallery();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setSelectedFile(file);
      const img = new Image();
      img.src = previewUrl;
      img.onload = () => {
        setHeight(img.naturalHeight);
        setWidth(img.naturalWidth);
      };
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
    },
  });

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
        console.log('Cleanup: Releasing preview URL');
      }
    };
  }, [preview]);

  const uploadImage = useCallback(async () => {
    if (!selectedFile) {
      return;
    }

    if (height === 0 || width === 0) {
      toast.error('Height and width must be greater than 0', {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        theme: 'dark',
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const url = `/api/resize?width=${width}&height=${height}`;
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = (await response.json()) as ResizeResultDto;

      const addedImage: GalleryImageDto = {
        url: result.url,
        key: result.key,
      };

      setImages((prevState) => (prevState ? [...prevState, addedImage] : [addedImage]));
      toast.success(result.message, {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        theme: 'dark',
      });
    } catch (error) {
      toast.error('Error resizing image', {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        theme: 'dark',
      });
      console.error('Error resizing image:', error);
    } finally {
      setLoading(false);
      setPreview(null);
      setSelectedFile(null);
    }
  }, [selectedFile, width, height, setImages]);

  return (
    <div className="flex justify-center">
      {!preview && (
        <div
          className={`h-full w-full cursor-pointer rounded-lg bg-white p-8 shadow-md transition hover:bg-gray-100 md:w-1/2`}
        >
          <div
            className={`flex h-full items-center justify-center border-4 border-dashed ${isDragActive ? 'border-primary' : 'border-gray-300'}`}
          >
            <div {...getRootProps({ className: 'dropzone h-full w-full' })}>
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-4 p-8">
                {isDragActive ? (
                  <>
                    <p>Drop the Image here ...</p>
                    <BsFileEarmarkArrowDownFill className="h-16 w-16 animate-bounce text-black" />
                  </>
                ) : (
                  <>
                    <h2>Drag and Drop an image or browse to upload</h2>
                    <FaUpload className="h-16 w-16 text-black transition hover:scale-110" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {preview && (
        <div className="mx-auto mt-4 flex w-full flex-col justify-center space-y-4 rounded-lg bg-gray-200 p-4 text-gray-500 md:max-w-md lg:max-w-lg">
          {!loading ? (
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 w-full rounded-lg object-cover sm:max-h-80 md:max-h-96"
            />
          ) : (
            <div className="p-16 sm:p-24 md:p-32">
              <Loader />
            </div>
          )}

          <div className="mt-2 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex w-full flex-col sm:w-1/2">
              <label className="text-sm sm:text-base">Height</label>
              <input
                type="number"
                min={0}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="rounded border p-1 text-sm sm:text-base"
              />
            </div>
            <div className="flex w-full flex-col sm:w-1/2">
              <label className="text-sm sm:text-base">Width</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="rounded border p-1 text-sm sm:text-base"
              />
            </div>
            <span className="flex items-center justify-center py-1 text-sm sm:text-base">px</span>
          </div>

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <button
              className="flex w-full items-center justify-center rounded-full bg-gray-300 p-2 text-lg font-semibold text-black sm:w-1/2"
              onClick={() => {
                setPreview(null);
              }}
            >
              <RxReset className="mr-2 h-5 w-5 text-black" /> Reset
            </button>
            <GradientButton onClick={uploadImage}>Resize Image</GradientButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resizer;
