import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { GrGallery } from 'react-icons/gr';
import { GalleryImageDto } from '@/types';
import GallerySkeletons from '@/components/common/GallerySkeletons';
import { motion } from 'framer-motion';
import { useGallery } from '@/context/GalleryContext';
import { toast } from 'react-toastify';

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImageDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { images, setImages } = useGallery();

  const openOverlay = (image: GalleryImageDto) => {
    setSelectedImage(image);
  };

  const closeOverlay = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/resize');
        if (!response.ok) {
          toast.error('Error loading images', {
            position: 'bottom-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            progress: undefined,
            theme: 'dark',
          });
          throw new Error('Failed to load images');
        }
        const data = await response.json();
        setImages([]);
        setImages(data.images || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [setImages]);

  return (
    <div>
      <div className="flex items-center space-x-3 pl-8">
        <GrGallery className="h-12 w-12 text-black" />
        <h2 className="text-3xl font-semibold">Gallery</h2>
      </div>

      <div className="mt-6 flex flex-wrap justify-start">
        {!loading && images?.length === 0 && (
          <div className="flex w-full justify-center p-12">
            <h2 className="text-2xl text-black">
              There are no resized Images, Upload to preview in Gallery
            </h2>
          </div>
        )}

        {loading ? <GallerySkeletons /> : ''}

        {!loading &&
          images &&
          images.map((image, index) => (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: 'easeOut',
                delay: index < 6 ? index * 0.1 : images.length * 0.1,
              }}
              key={index}
              className="h-44 w-1/2 p-2 md:w-2/6 lg:w-1/6"
            >
              <Image
                className="h-full w-full rounded-lg shadow-md transition hover:cursor-pointer md:hover:scale-105"
                src={image.url}
                alt={'Resized Image'}
                width={0}
                height={0}
                sizes="100vw"
                onClick={() => openOverlay(image)}
              />
            </motion.div>
          ))}
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 transition-opacity duration-300"
          onClick={closeOverlay}
        >
          <div>
            <Image
              className="h-full w-full"
              src={selectedImage.url}
              alt={'Resized Image'}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }}
            />
            <button
              className="absolute right-4 top-4 text-2xl font-bold text-white"
              onClick={(e) => {
                closeOverlay();
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
