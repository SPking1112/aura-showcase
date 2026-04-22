import { useRef, useState, type ChangeEvent } from "react";
import { Link2, Upload, X, AlertCircle } from "lucide-react";
import { isValidUrl } from "@/lib/projects";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export function ImageInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [mode, setMode] = useState<"url" | "upload">(
    value && !value.startsWith("data:") ? "url" : value.startsWith("data:") ? "upload" : "url",
  );
  const [fileError, setFileError] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    setPreviewError(false);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      setFileError("Only JPG, PNG or WEBP allowed");
      return;
    }
    if (file.size > MAX_BYTES) {
      setFileError("File must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") onChange(result);
    };
    reader.onerror = () => setFileError("Could not read file");
    reader.readAsDataURL(file);
  };

  const clear = () => {
    onChange("");
    setPreviewError(false);
    setFileError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const showPreview = !!value;
  const urlInvalid = mode === "url" && value && !value.startsWith("data:") && !isValidUrl(value);

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-foreground/80">
        Upload or paste image URL
      </label>

      <div className="mb-2 inline-flex rounded-xl bg-white/40 p-1 dark:bg-white/5">
        <TabButton active={mode === "url"} onClick={() => setMode("url")}>
          <Link2 className="h-3.5 w-3.5" /> Image URL
        </TabButton>
        <TabButton active={mode === "upload"} onClick={() => setMode("upload")}>
          <Upload className="h-3.5 w-3.5" /> Upload
        </TabButton>
      </div>

      {mode === "url" ? (
        <div
          className={`glass rounded-2xl px-4 py-3 transition-smooth focus-within:ring-2 focus-within:ring-primary/40 ${
            error || urlInvalid ? "ring-2 ring-destructive/50" : ""
          }`}
        >
          <input
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => {
              onChange(e.target.value);
              setPreviewError(false);
            }}
            placeholder="https://…"
            className="w-full bg-transparent outline-none"
          />
        </div>
      ) : (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="glass flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-smooth hover:shadow-soft"
          >
            <Upload className="h-4 w-4" />
            {value.startsWith("data:") ? "Replace image" : "Choose image (max 2MB)"}
          </button>
        </div>
      )}

      {(error || urlInvalid || fileError) && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="h-3 w-3" />
          {fileError || error || "Invalid image URL"}
        </p>
      )}

      {showPreview && (
        <div className="animate-fade-in-up mt-3">
          <div className="glass relative overflow-hidden rounded-2xl">
            <div className="aspect-[16/9] w-full">
              {previewError ? (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                  Image could not be loaded
                </div>
              ) : (
                <img
                  src={value}
                  alt="Preview"
                  onError={() => setPreviewError(true)}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <button
              type="button"
              onClick={clear}
              className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur transition-smooth hover:bg-black/70"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-smooth ${
        active
          ? "gradient-primary text-primary-foreground shadow-glow"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
