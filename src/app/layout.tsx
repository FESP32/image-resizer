import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['700', '500', '400', '300', '100'],
});

export const metadata: Metadata = {
  title: 'Image Resizer',
  description: 'Easily resize your images in one click',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
