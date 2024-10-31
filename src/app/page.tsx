'use client';

import Resizer from '@/components/sections/Resizer';
import Gallery from '@/components/sections/Gallery';
import Header from '@/components/sections/Header';
import Section from '@/components/common/Section';
import { GalleryProvider } from '@/context/GalleryContext';
import { ToastContainer } from 'react-toastify';

export default function HomePage() {
  return (
    <>
      <Section height="1/2">
        <Header />
      </Section>
      <GalleryProvider>
        <Section height="1/2">
          <Resizer />
        </Section>
        <Section>
          <Gallery />
        </Section>
      </GalleryProvider>
      <ToastContainer />
    </>
  );
}
