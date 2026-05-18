import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 0.5,           // Max file size (500KB is plenty for a flyer)
    maxWidthOrHeight: 1024,  // Max dimension (keeps it sharp but small)
    useWebWorker: true,      // Better performance
    initialQuality: 0.8,     // 80% quality is usually indistinguishable
  };

  try {
    const compressedFile = await imageCompression(file, options);
    console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    
    return compressedFile;
  } catch (error) {
    console.error("Compression failed:", error);
    return file; // Fallback to original if something goes wrong
  }
};