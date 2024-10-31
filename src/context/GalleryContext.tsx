'use client';

import { GalleryImageDto } from '@/types';
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface GalleryContextType {
  images: GalleryImageDto[] | null;
  setImages: React.Dispatch<React.SetStateAction<GalleryImageDto[] | null>>;
}

const defaultValues: GalleryContextType = {
  images: null,
  setImages: () => undefined,
};

const GalleryContext = createContext<GalleryContextType>(defaultValues);

export function useGallery() {
  return useContext(GalleryContext);
}

interface Props {
  children: ReactNode;
}

export const GalleryProvider = ({ children }: Props) => {
  const [images, setImages] = useState<GalleryImageDto[] | null>(null);

  const value = {
    images,
    setImages,
  };

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>;
};
