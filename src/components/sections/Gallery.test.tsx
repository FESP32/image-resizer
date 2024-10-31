// __tests__/Gallery.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Gallery from '@/components/sections/Gallery';
import { useGallery } from '@/context/GalleryContext';
import { toast } from 'react-toastify';

jest.mock('@/context/GalleryContext', () => ({
  useGallery: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

function mockFetch(data: any) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => data,
    }),
  );
}

describe('Gallery Component', () => {
  const setImagesMock = jest.fn();
  const mockImages = [
    { url: 'https://example.com/image1.jpg' },
    { url: 'https://example.com/image2.jpg' },
  ];

  beforeEach(() => {
    (useGallery as jest.Mock).mockReturnValue({
      images: [],
      setImages: setImagesMock,
    });
    jest.clearAllMocks();
  });

  it('fetches and displays images on successful request', async () => {
    global.fetch = mockFetch({ images: mockImages });

    render(<Gallery />);

    await waitFor(() => {
      mockImages.forEach((image) => {
        expect(screen.getByAltText(/Resized Image/i)).toBeInTheDocument();
      });
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/resize');
  });

  it('shows an error toast when image fetching fails', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
      }),
    );

    render(<Gallery />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error loading images', expect.any(Object));
    });
  });
});
