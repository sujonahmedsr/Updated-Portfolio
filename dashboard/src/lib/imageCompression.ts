/**
 * Client-side image compression & optimization helper.
 * Prevents HTTP 413 (Payload Too Large) by optimizing high-resolution screenshots
 * and large camera/PNG images to high-quality WebP before sending to /api/upload.
 */
export async function optimizeImageForUpload(
  file: File,
  maxDimension: number = 2400,
  quality: number = 0.88
): Promise<File> {
  // If not a raster image, or if SVG/GIF/PDF, do not alter
  if (
    !file.type.startsWith("image/") ||
    file.type === "image/svg+xml" ||
    file.type === "image/gif"
  ) {
    return file;
  }

  // If already under 1MB and already webp, no need to touch
  if (file.size <= 1024 * 1024 && file.type === "image/webp") {
    return file;
  }

  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          try {
            let width = img.width;
            let height = img.height;

            // If horizontal width exceeds maxDimension, scale down proportionally
            // while preserving full vertical length (ideal for full-page website screenshots)
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
              resolve(file);
              return;
            }

            // High-quality image smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to WebP format
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  resolve(file);
                  return;
                }

                const baseName = file.name.replace(/\.[^/.]+$/, "");
                const optimizedFile = new File([blob], `${baseName}.webp`, {
                  type: "image/webp",
                  lastModified: Date.now(),
                });

                // If optimized is smaller, return it
                if (optimizedFile.size < file.size) {
                  resolve(optimizedFile);
                } else {
                  resolve(file);
                }
              },
              "image/webp",
              quality
            );
          } catch {
            resolve(file);
          }
        };

        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };

      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    } catch {
      resolve(file);
    }
  });
}
