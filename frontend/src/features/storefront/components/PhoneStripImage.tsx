import productStrip from "../../../assets/phone-product-strip.png";

type PhoneStripImageProps = {
  index: number;
  alt?: string;
  total?: number;
  className?: string;
};

export function PhoneStripImage({
  index,
  alt = "",
  total = 5,
  className = "",
}: PhoneStripImageProps) {
  return (
    <img
      src={productStrip}
      alt={alt}
      className={`absolute top-1/2 h-auto max-w-none -translate-y-1/2 ${className}`}
      style={{
        left: `-${index * 100}%`,
        width: `${total * 100}%`,
      }}
    />
  );
}
