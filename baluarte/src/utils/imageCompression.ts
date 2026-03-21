type CompressOptions = {
  maxBytes: number;
  maxDimension?: number;
  initialQuality?: number;
  minQuality?: number;
  maxIterations?: number;
};

const loadImageElement = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });

const drawToCanvas = (img: HTMLImageElement, targetWidth: number, targetHeight: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context indisponível.");
  }
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  return canvas;
};

const canvasToBlob = (canvas: HTMLCanvasElement, mimeType: string, quality?: number) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Falha ao gerar blob da imagem."));
        resolve(blob);
      },
      mimeType,
      quality
    );
  });

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const compressImageToMaxBytes = async (file: File, options: CompressOptions) => {
  const {
    maxBytes,
    maxDimension = 1920,
    initialQuality = 0.85,
    minQuality = 0.45,
    maxIterations = 10,
  } = options;

  if (!(file instanceof File)) return file;
  if (!file.type.startsWith("image/")) return file;
  if (file.size <= maxBytes) return file;

  const img = await loadImageElement(file);

  const ratio = img.width / img.height;
  let targetWidth = img.width;
  let targetHeight = img.height;

  const largest = Math.max(img.width, img.height);
  if (largest > maxDimension) {
    if (img.width >= img.height) {
      targetWidth = maxDimension;
      targetHeight = Math.round(maxDimension / ratio);
    } else {
      targetHeight = maxDimension;
      targetWidth = Math.round(maxDimension * ratio);
    }
  }

  const outputMime = file.type === "image/png" ? "image/png" : "image/jpeg";
  let quality = clamp(initialQuality, 0.1, 0.95);
  let scale = 1;

  for (let i = 0; i < maxIterations; i += 1) {
    const scaledWidth = Math.max(1, Math.round(targetWidth * scale));
    const scaledHeight = Math.max(1, Math.round(targetHeight * scale));
    const canvas = drawToCanvas(img, scaledWidth, scaledHeight);

    const blob = await canvasToBlob(
      canvas,
      outputMime,
      outputMime === "image/jpeg" ? quality : undefined
    );

    if (blob.size <= maxBytes) {
      const ext = outputMime === "image/png" ? "png" : "jpg";
      const safeName = (file.name || "imagem").replace(/\.(png|jpe?g|webp)$/i, "");
      return new File([blob], `${safeName}.${ext}`, { type: outputMime });
    }

    // Estratégia: primeiro baixa qualidade (JPEG), depois reduz escala.
    if (outputMime === "image/jpeg" && quality > minQuality) {
      quality = clamp(quality - 0.12, minQuality, 0.95);
    } else {
      scale = clamp(scale * 0.85, 0.2, 1);
    }
  }

  // Se não conseguiu chegar no maxBytes, ainda devolve a melhor tentativa (reduzida).
  const fallbackCanvas = drawToCanvas(img, Math.max(1, Math.round(targetWidth * 0.7)), Math.max(1, Math.round(targetHeight * 0.7)));
  const fallbackBlob = await canvasToBlob(
    fallbackCanvas,
    outputMime,
    outputMime === "image/jpeg" ? minQuality : undefined
  );
  const ext = outputMime === "image/png" ? "png" : "jpg";
  const safeName = (file.name || "imagem").replace(/\.(png|jpe?g|webp)$/i, "");
  return new File([fallbackBlob], `${safeName}.${ext}`, { type: outputMime });
};

