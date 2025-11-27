/**
 * Compresses an image file using the HTML Canvas API.
 * Resizes the image to a maximum dimension (width or height) while maintaining aspect ratio,
 * and compresses it to a specified quality.
 *
 * @param file - The original image File object.
 * @param maxDimension - The maximum width or height in pixels (default: 1920).
 * @param quality - The JPEG quality from 0 to 1 (default: 0.8).
 * @returns A Promise that resolves to a compressed File object.
 */
export async function compressImage(
    file: File,
    maxDimension: number = 1920,
    quality: number = 0.8
): Promise<File> {
    // If it's not an image, return original
    if (!file.type.startsWith("image/")) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            let width = img.width;
            let height = img.height;

            // Calculate new dimensions
            if (width > height) {
                if (width > maxDimension) {
                    height = Math.round((height * maxDimension) / width);
                    width = maxDimension;
                }
            } else {
                if (height > maxDimension) {
                    width = Math.round((width * maxDimension) / height);
                    height = maxDimension;
                }
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Could not get canvas context"));
                return;
            }

            // Draw image to canvas
            ctx.drawImage(img, 0, 0, width, height);

            // Convert canvas to Blob/File
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error("Compression failed"));
                        return;
                    }

                    // Create new File from Blob
                    const compressedFile = new File([blob], file.name, {
                        type: "image/jpeg", // Force JPEG for better compression
                        lastModified: Date.now(),
                    });

                    resolve(compressedFile);
                },
                "image/jpeg",
                quality
            );
        };

        img.onerror = (error) => {
            URL.revokeObjectURL(url);
            reject(error);
        };

        img.src = url;
    });
}
