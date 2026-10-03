import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/cn";
import { isOptimizableImage } from "@/lib/images";

/**
 * Square product/category thumbnail with a graceful empty state.
 * Pass `size` for a fixed square, or omit it and size the box with `className`.
 */
export function Thumb({
  src,
  alt,
  size,
  sizes,
  eager,
  className,
}: {
  src: string | null | undefined;
  alt: string;
  size?: number;
  sizes?: string;
  /** Load immediately (above-the-fold images that may be the LCP element). */
  eager?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-beige ring-1 ring-line ring-inset",
        className,
      )}
      style={size ? { width: size, height: size } : undefined}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? `${size ?? 160}px`}
          loading={eager ? "eager" : undefined}
          unoptimized={!isOptimizableImage(src)}
          className="object-cover"
        />
      ) : (
        <ImageOff className="size-4 text-tan" aria-hidden />
      )}
    </span>
  );
}
