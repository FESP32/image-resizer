// __tests__/Resizer.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Resizer from '@/components/sections/Resizer';
import { useGallery } from '@/context/GalleryContext';
import { toast } from 'react-toastify';

// Mocking context and external libraries
jest.mock('@/context/GalleryContext', () => ({
  useGallery: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
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

describe('Resizer Component', () => {
  const setImagesMock = jest.fn();

  beforeEach(() => {
    (useGallery as jest.Mock).mockReturnValue({
      setImages: setImagesMock,
    });
    jest.clearAllMocks();
  });

  it('renders the initial dropzone correctly', () => {
    render(<Resizer />);
    expect(screen.getByText(/Drag and Drop an image or browse to upload/i)).toBeInTheDocument();
  });

  it('handles file drop and preview correctly', async () => {
    render(<Resizer />);

    const file = new File(['dummy content'], 'image.png', { type: 'image/png' });
    const inputElement = screen.getByRole('textbox'); // Replace with a selector if needed

    fireEvent.change(inputElement, {
      target: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(screen.getByAltText('Preview')).toBeInTheDocument();
    });
  });

  it('uploads an image successfully and updates the gallery', async () => {
    global.fetch = mockFetch({
      message: 'File uploaded successfully',
      url: 'https://example.com/resized-image.png',
    });

    render(<Resizer />);

    const file = new File(['dummy content'], 'image.png', { type: 'image/png' });
    const inputElement = screen.getByRole('textbox'); // Replace with a selector if needed

    // Simulate a file drop
    fireEvent.change(inputElement, {
      target: {
        files: [file],
      },
    });

    const resizeButton = screen.getByRole('button', { name: /Resize Image/i });
    fireEvent.click(resizeButton);

    await waitFor(() => {
      expect(setImagesMock).toHaveBeenCalledWith(expect.any(Function));
      expect(toast.success).toHaveBeenCalledWith('File uploaded successfully', expect.any(Object));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/resize'),
      expect.any(Object),
    );
  });

  it('shows an error toast when the upload fails', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
      }),
    );

    render(<Resizer />);

    const file = new File(['dummy content'], 'image.png', { type: 'image/png' });
    const inputElement = screen.getByRole('textbox'); // Replace with a selector if needed

    // Simulate a file drop
    fireEvent.change(inputElement, {
      target: {
        files: [file],
      },
    });

    const resizeButton = screen.getByRole('button', { name: /Resize Image/i });
    fireEvent.click(resizeButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error uploading image', expect.any(Object));
    });
  });
});
