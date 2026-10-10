import { useCallback, useEffect, useRef, useState } from "react";
import StudentPhoto from "../../components/StudentPhoto";
import { captureFrame, prepareUpload } from "../lib/photo";
import { CameraIcon, UploadIcon } from "./icons";
import { button } from "./styles";


/** Live, mirrored camera preview, cropped by the frame the same way captureFrame crops. */
function CameraPreview({ videoRef, onReady, onError }) {
  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      onError("The camera only works over a secure (https) connection. Upload a photo instead.");
      return;
    }
    let stream;
    let stopped = false;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false })
      .then((granted) => {
        if (stopped) {
          granted.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = granted;
        videoRef.current.srcObject = granted;
      })
      .catch((error) =>
        onError(
          error.name === "NotAllowedError"
            ? "Camera access is blocked. Allow it in the browser, or upload a photo instead."
            : "No camera is available. Upload a photo instead.",
        ),
      );
    return () => {
      stopped = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [videoRef, onError]);

  return (
    <div className="aspect-[20.4/27.5] overflow-hidden rounded-[1.1rem] border-4 border-frame bg-navy-deep">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        onLoadedMetadata={onReady}
        aria-label="Camera preview"
        className="size-full -scale-x-100 object-cover"
      />
    </div>
  );
}

/**
 * A photo in the kiosk's frame, with buttons to pick a new one from a file or the camera.
 * `photo` is a picked { blob, previewUrl } that hasn't been saved yet; `savedUrl` is the current photo.
 */
function PhotoField({ photo, savedUrl, onChange, alt, disabled = false }) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const closeCamera = () => {
    setCameraOpen(false);
    setCameraReady(false);
  };
  const cameraFailed = useCallback((message) => {
    setError(message);
    setCameraOpen(false);
    setCameraReady(false);
  }, []);

  const applyPhoto = async (makePhoto) => {
    setError(null);
    setWorking(true);
    try {
      onChange(await makePhoto());
      closeCamera();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setWorking(false);
    }
  };

  const busy = disabled || working;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <div className="w-36 shrink-0">
        {cameraOpen ? (
          <CameraPreview videoRef={videoRef} onReady={() => setCameraReady(true)} onError={cameraFailed} />
        ) : (
          <StudentPhoto src={photo?.previewUrl ?? savedUrl} alt={alt} className="w-full" />
        )}
      </div>

      <div className="min-w-0 space-y-3">
        {cameraOpen ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPhoto(() => captureFrame(videoRef.current))}
              disabled={busy || !cameraReady}
              className={button("primary", "sm")}
            >
              <CameraIcon />
              Take photo
            </button>
            <button type="button" onClick={closeCamera} className={button("secondary", "sm")}>
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <label
              className={`${button("secondary", "sm")} has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-frame ${busy ? "pointer-events-none opacity-60" : ""}`}
            >
              <UploadIcon />
              Upload photo
              <input
                type="file"
                // Anything the browser can decode; it's converted to JPEG before upload.
                accept="image/*"
                disabled={busy}
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  // Lets the same file be picked again after Discard.
                  event.target.value = "";
                  if (file) applyPhoto(() => prepareUpload(file));
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setCameraOpen(true);
              }}
              disabled={busy}
              className={button("secondary", "sm")}
            >
              <CameraIcon />
              Use camera
            </button>
            {photo && (
              <button type="button" onClick={() => onChange(null)} disabled={busy} className={button("ghost", "sm")}>
                Discard
              </button>
            )}
          </div>
        )}
        <p className="text-xs text-ink-muted">
          {cameraOpen
            ? "Center the student's face in the frame. The photo is saved exactly as framed."
            : "Shown as on the kiosk. Large photos are resized automatically."}
        </p>
        {working && <p className="text-xs text-ink-muted">Preparing photo…</p>}
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default PhotoField;
