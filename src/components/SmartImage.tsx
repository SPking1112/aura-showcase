import { ImageOff } from "lucide-react";
import { useEffect, useState } from "react";

export function SmartImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(!src);

  useEffect(() => {
    setFailed(!src);
  }, [src]);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-1 bg-muted text-muted-foreground ${className ?? ""}`}
      >
        <ImageOff className="h-8 w-8 opacity-60" />
        <span className="text-[10px] font-medium opacity-70">Image could not be loaded</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
