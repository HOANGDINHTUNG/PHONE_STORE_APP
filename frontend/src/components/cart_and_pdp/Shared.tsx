import React, { ReactNode, MouseEventHandler } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: "primary" | "secondary" | "outline" | "text";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
}

export const Button = ({
  children,
  type = "primary",
  size = "md",
  fullWidth = false,
  onClick,
  disabled = false,
  className = "",
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none";

  const typeStyles = {
    primary: "bg-[#E91E63] hover:bg-[#d81b60] text-white shadow-sm",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    outline:
      "border border-[#E91E63] text-[#E91E63] hover:bg-[#FFF0F4]",
    text: "text-gray-600 hover:text-[#E91E63] hover:bg-gray-50",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base font-semibold",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const disabledStyle = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${typeStyles[type]} ${sizeStyles[size]} ${widthStyle} ${disabledStyle} ${className}`}
    >
      {children}
    </button>
  );
};

interface ProductCardProps {
  image?: string;
  badge?: string | null;
  title?: string;
  price?: string;
  oldPrice?: string;
  buttonText?: string;
  onClick?: () => void;
  onAdd?: MouseEventHandler<HTMLButtonElement>;
}

export const ProductCard = ({
  image,
  badge,
  title,
  price,
  oldPrice,
  buttonText,
  onClick,
  onAdd,
}: ProductCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col h-full hover:shadow-lg transition-all duration-300 group cursor-pointer"
    >
      <div className="relative mb-3 flex items-center justify-center h-40 bg-gray-50 rounded-lg overflow-hidden">
        {badge && (
          <span
            className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold text-white rounded uppercase ${
              badge === "new" || badge === "MỚI VỀ"
                ? "bg-blue-500"
                : "bg-[#E91E63]"
            }`}
          >
            {badge}
          </span>
        )}
        <img
          src={image || "/images/prod_iphone15.png"}
          alt={title || ""}
          referrerPolicy="no-referrer"
          className="max-h-32 object-contain group-hover:scale-105 transition-transform duration-300 rounded-lg"
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='80' height='80'><rect width='100' height='100' rx='20' fill='%23FFF0F4'/><path fill='%23E91E63' d='M30 40h40v30H30zM40 30h20v10H40z'/></svg>";
          }}
        />
      </div>

      <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 h-10 mb-1">
        {title || "Product Title"}
      </h4>

      <div className="flex items-baseline space-x-2 mb-3">
        <span className="text-[#E91E63] font-bold text-sm">
          {price || "0đ"}
        </span>
        {oldPrice && (
          <span className="text-gray-400 text-xs line-through">{oldPrice}</span>
        )}
      </div>

      <div className="mt-auto">
        <Button
          type="outline"
          size="sm"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            if (onAdd) onAdd(e);
          }}
        >
          {buttonText || "Thêm vào giỏ"}
        </Button>
      </div>
    </div>
  );
};
