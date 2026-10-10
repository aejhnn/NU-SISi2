// Sharp enough for the kiosk's photo frame, and far below the API's 2 MB upload limit.
const MAX_SIDE_PX = 1200;
const JPEG_QUALITY = 0.85;
// The kiosk shows photos in a 20.4 × 27.5 portrait frame (see StudentPhoto).
export const PHOTO_ASPECT = 20.4 / 27.5;

const readAsDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Couldn't process the photo."));
    reader.readAsDataURL(blob);
  });

/**
 * Draws `crop` of `source`, scaled down if needed, as a JPEG. Resolves with the photo to upload
 * (`blob`) and a `previewUrl` to show it with before it's saved.
 */
async function encode(source, crop) {
  const scale = Math.min(1, MAX_SIDE_PX / Math.max(crop.width, crop.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(crop.width * scale);
  canvas.height = Math.round(crop.height * scale);
  const context = canvas.getContext("2d");
  // JPEG has no transparency; without this, transparent PNG areas turn black.
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(source, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (encoded) => (encoded ? resolve(encoded) : reject(new Error("Couldn't process the photo."))),
      "image/jpeg",
      JPEG_QUALITY,
    );
  });
  return { blob, previewUrl: await readAsDataUrl(blob) };
}

/**
 * Turns any image the browser can decode into a JPEG small enough to upload. Phone photos are
 * often several MB, and the API only accepts JPEG, PNG and WEBP up to 2 MB.
 */
export async function prepareUpload(file) {
  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("Couldn't read that image. Choose a JPEG, PNG or WEBP photo.");
  }
  try {
    return await encode(bitmap, { x: 0, y: 0, width: bitmap.width, height: bitmap.height });
  } finally {
    bitmap.close();
  }
}

/** The camera's current frame, cropped to the kiosk's portrait frame the way the preview shows it. */
export function captureFrame(video) {
  const { videoWidth, videoHeight } = video;
  const width = Math.min(videoWidth, videoHeight * PHOTO_ASPECT);
  const height = width / PHOTO_ASPECT;
  return encode(video, { x: (videoWidth - width) / 2, y: (videoHeight - height) / 2, width, height });
}
