import React from 'react';

export const Button = ({ variant = 'primary', size = 'md', children, onClick, className = '', disabled = false }) => {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-[#E91E63] text-white hover:bg-[#d81b60] focus:ring-[#E91E63]',
    outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-[#E91E63]',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export const ProductCard = ({ image, badge, title, price, oldPrice, buttonText, onAdd }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col h-full hover:shadow-lg transition-all duration-300 group">
      <div className="relative mb-3 flex items-center justify-center h-40 bg-gray-50 rounded-lg overflow-hidden">
        {badge && (
          <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold text-white rounded uppercase ${
            badge === 'new' || badge === 'MỚI VỀ' ? 'bg-blue-500' : 'bg-[#E91E63]'
          }`}>
            {badge}
          </span>
        )}
        <img
          src={image || '/images/prod_iphone15.png'}
          alt={title}
          className="max-h-32 object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 h-10 mb-1">{title || 'Product Title'}</h4>
      
      <div className="flex items-baseline space-x-2 mb-3">
        <span className="text-[#E91E63] font-bold text-sm">{price || '0đ'}</span>
        {oldPrice && (
          <span className="text-gray-400 text-xs line-through">{oldPrice}</span>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full mt-auto text-xs text-[#E91E63] border-[#E91E63] hover:bg-[#FDE6EC] hover:text-[#E91E63]"
        onClick={onAdd}
      >
        {buttonText || 'Thêm vào giỏ'}
      </Button>
    </div>
  );
};
