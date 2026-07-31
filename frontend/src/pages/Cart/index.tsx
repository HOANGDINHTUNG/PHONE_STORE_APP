import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Trash, Heart, MapPin, Truck, Ticket, 
  ChevronRight, Plus, Minus, ShoppingBag, Store, 
  AlertTriangle, Shield, Gift
} from 'lucide-react';
import { Button, ProductCard } from '../../components/cart_and_pdp/Shared';
import { useStore } from '../../context/StoreContext';

const cartPromos = [
  {
    icon: Gift,
    title: 'Tặng ngay Ốp lưng Clear Case & Sạc nhanh 45W',
    desc: 'Dành cho khách hàng đặt mua trong đợt đầu mở bán'
  },
  {
    icon: Ticket,
    title: 'Giảm thêm 500.000đ khi thanh toán qua ví PinkPay',
    desc: 'Áp dụng cho mọi đơn hàng từ 10 triệu đồng'
  },
  {
    icon: Shield,
    title: 'Tặng gói bảo hành rơi vỡ 12 tháng tại hệ thống',
    desc: 'Bảo hành chính hãng 1 đổi 1 trong 30 ngày đầu'
  }
];

const crossSellProducts = [
  { id: 401, name: 'Ốp lưng Silicon Pink', price: '290.000đ', oldPrice: '450.000đ', image: '/images/brand_apple.png' },
  { id: 402, name: 'Sạc nhanh 65W GaN', price: '650.000đ', oldPrice: '890.000đ', image: '/images/brand_samsung.png' },
  { id: 403, name: 'PinkBuds Pro 2', price: '1.890.000đ', oldPrice: '2.490.000đ', image: '/images/brand_xiaomi.png' }
];

const recommendedProducts = [
  {
    id: 301,
    name: 'iPhone 15 Pro Max',
    price: '29.490.000đ',
    oldPrice: '34.990.000đ',
    image: '/images/prod_iphone15.png',
    badge: 'BEST SELLER'
  },
  {
    id: 302,
    name: 'Samsung Galaxy Z Flip5',
    price: '15.990.000đ',
    oldPrice: '19.990.000đ',
    image: '/images/brand_samsung.png',
    badge: 'MỚI VỀ'
  },
  {
    id: 303,
    name: 'iPhone 15 Pink',
    price: '22.190.000đ',
    image: '/images/prod_iphone15.png',
    badge: null
  },
  {
    id: 304,
    name: 'Xiaomi 14 Ultra',
    price: '26.990.000đ',
    oldPrice: '29.990.000đ',
    image: '/images/prod_xiaomi14.png',
    badge: 'GIẢM GIÁ SỐC'
  }
];

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, addToCart } = useStore();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [shippingMethod, setShippingMethod] = useState('delivery');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Local state to hold cart items matching the reference screenshot
  const [localCart, setLocalCart] = useState([]);

  useEffect(() => {
    setLocalCart(cart.map((item) => {
      const existingLocal = localCart.find((li) => li.id === item.id);
      return {
        ...item,
        active: existingLocal ? existingLocal.active : true
      };
    }));
  }, [cart]);

  const handleRemove = (id) => {
    setLocalCart(prev => prev.filter(item => item.id !== id));
    removeFromCart(id);
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemove(id);
      return;
    }
    setLocalCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    updateCartQuantity(id, newQty);
  };

  const handleAddCrossSell = (prod) => {
    const isExist = localCart.some(item => item.id === prod.id);
    if (!isExist) {
      const newItem = {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        image: prod.image,
        quantity: 1,
        active: true
      };
      setLocalCart(prev => [...prev, newItem]);
      addToCart(newItem);
    }
  };

  // Calculations based on active items only
  const activeItems = localCart.filter(item => item.active && !item.outOfStock);
  
  const subtotal = activeItems.reduce((acc, item) => {
    const itemPrice = item.price || item.newPrice || '0đ';
    const priceNum = parseInt(itemPrice ? itemPrice.replace(/\D/g, '') : '0');
    return acc + (priceNum * item.quantity);
  }, 0);

  const discount = subtotal >= 32990000 ? 4500000 : 0;
  const total = subtotal - discount;

  const formatPrice = (num) => {
    return num.toLocaleString('vi-VN') + 'đ';
  };

  const handleCheckout = () => {
    if (!termsAccepted) {
      alert('Vui lòng đồng ý với Điều khoản & Điều kiện mua hàng tại PinkPhone.');
      return;
    }
    console.log('Proceeding to checkout');
  };

  if (localCart.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f7fb] py-12">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#FFF0F4] text-[#E91E63]">
              <ShoppingBag className="h-12 w-12" />
            </div>
            <h2 className="mb-2 text-[24px] font-bold text-[#222222]">Giỏ hàng của bạn đang trống</h2>
            <p className="mx-auto mb-8 max-w-2xl text-[14px] leading-6 text-[#777777]">
              Hãy chọn một chiếc điện thoại phù hợp và quay lại đây để hoàn tất đơn hàng nhanh chóng.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mx-auto inline-flex h-12 items-center justify-center rounded-full bg-[#E91E63] px-8 text-[14px] font-bold text-white transition hover:bg-[#d81b60]"
            >
              Tiếp tục mua sắm
            </button>
          </div>

          <div className="mt-10 rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[20px] font-bold text-[#222222]">Sản phẩm bán chạy</h3>
              <Link to="/" className="text-[14px] font-semibold text-[#E91E63] hover:underline">Xem tất cả</Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recommendedProducts.map((prod) => (
                <div key={prod.id}>
                  <ProductCard
                    image={prod.image}
                    badge={prod.badge}
                    title={prod.name}
                    price={prod.price}
                    oldPrice={prod.oldPrice}
                    buttonText="Thêm vào giỏ"
                    onAdd={() => {
                      const newItem = {
                        id: prod.id,
                        name: prod.name,
                        price: prod.price,
                        image: prod.image,
                        quantity: 1,
                        active: true
                      };
                      setLocalCart(prev => [...prev, newItem]);
                      addToCart(newItem);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7fb] py-6 sm:py-8 lg:py-10">
      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center gap-2 text-[13px] text-gray-500">
          <Link to="/" className="text-gray-600 transition hover:text-[#E91E63]">Trang chủ</Link>
          <span className="text-gray-400">&gt;</span>
          <span className="font-medium text-[#E91E63]">Giỏ hàng</span>
        </div>

        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-gray-900">Giỏ hàng của bạn</h1>
            <p className="mt-1 text-sm text-gray-500">{localCart.length} sản phẩm đang chờ thanh toán</p>
          </div>
          <div className="inline-flex items-center rounded-full border border-[#E91E63]/20 bg-white px-4 py-2 text-sm font-medium text-[#E91E63] shadow-sm">
            Giao hàng miễn phí từ 3 triệu
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">
          <div className="space-y-4">
            <div className="rounded-[24px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-3 text-[14px] font-medium text-gray-800">
                  <input
                    type="checkbox"
                    checked={localCart.length > 0 && localCart.filter(item => !item.outOfStock).every(item => item.active)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setLocalCart(prev => prev.map(item => item.outOfStock ? item : { ...item, active: checked }));
                    }}
                    className="h-[18px] w-[18px] rounded border-gray-300 text-[#E91E63] accent-[#E91E63]"
                  />
                  <span>Chọn tất cả ({localCart.length} sản phẩm)</span>
                </label>
                <button
                  onClick={() => {
                    const toDeleteIds = localCart.filter(item => item.active && !item.outOfStock).map(item => item.id);
                    setLocalCart(prev => prev.filter(item => !toDeleteIds.includes(item.id)));
                    toDeleteIds.forEach(id => removeFromCart(id));
                  }}
                  className="flex items-center gap-1.5 text-[14px] font-medium text-[#E91E63] transition hover:text-[#d81b60]"
                >
                  <Trash className="h-[16px] w-[16px]" />
                  <span>Xóa sản phẩm đã chọn</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {localCart.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <div className="flex items-center pt-1 lg:h-24">
                      <input
                        type="checkbox"
                        checked={item.active && !item.outOfStock}
                        disabled={item.outOfStock}
                        onChange={(e) => {
                          setLocalCart(prev => prev.map(i => i.id === item.id ? { ...i, active: e.target.checked } : i));
                        }}
                        className="h-[18px] w-[18px] rounded border-gray-300 text-[#E91E63] accent-[#E91E63] disabled:opacity-40"
                      />
                    </div>

                    <div className="flex h-24 w-24 items-center justify-center rounded-[18px] border border-gray-200 bg-[#FAFAFA] p-2 shrink-0 sm:h-28 sm:w-28">
                      <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-[15px] font-bold leading-snug text-[#222222]">{item.name}</h3>
                      <p className="mt-1 text-[11px] text-[#777777]">SKU: ACC-SL-{item.id}</p>
                      {item.outOfStock && (
                        <div className="mt-3 inline-block rounded-full border border-[#EEEEEE] bg-[#F5F5F5] px-3 py-1 text-[12px] font-medium text-[#777777]">
                          Sản phẩm tạm ngưng kinh doanh
                        </div>
                      )}

                      {!item.outOfStock && (
                        <div className="mt-3 flex items-center overflow-hidden rounded-full border border-[#EEEEEE] bg-[#F9F9F9] w-fit">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-100"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="flex min-w-[40px] items-center justify-center bg-white px-3 py-1 text-[13px] font-bold text-[#222222]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-100"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-start gap-3 lg:items-end lg:min-w-[120px]">
                      <div className="flex items-center gap-3">
                        <span className="text-[15px] font-extrabold text-[#222222] whitespace-nowrap">
                          {item.price || item.newPrice || '0đ'}
                        </span>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-gray-400 transition hover:text-red-500"
                        >
                          <Trash className="h-[18px] w-[18px]" />
                        </button>
                      </div>
                      {!item.outOfStock && (
                        <button className="text-gray-400 transition hover:text-[#E91E63]">
                          <Heart className="h-[18px] w-[18px]" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[24px] border border-[#FDE6EC] bg-[#FFF8FA] p-4 shadow-sm sm:p-5">
              <h3 className="mb-4 text-[16px] font-bold text-[#222222]">Khuyến mãi hấp dẫn</h3>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {cartPromos.map((promo, idx) => {
                  const PromoIcon = promo.icon;
                  return (
                    <div key={idx} className="flex min-h-[84px] items-center gap-3 rounded-[14px] border border-[#FDE6EC] bg-white p-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FDE6EC] bg-[#FFF8FA] text-[#E91E63] shrink-0">
                        <PromoIcon className="h-4 w-4" />
                      </div>
                      <span className="text-[12px] font-semibold leading-snug text-[#222222]">{promo.title}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-col gap-4 rounded-[20px] border border-gray-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF0F4] text-[#E91E63] shrink-0">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#222222]">Bảo hành mở rộng PinkCare+</h4>
                    <p className="mt-1 text-[12px] font-medium text-[#777777]">Bảo vệ tối đa cho chiếc PinkPhone của bạn trước mọi sự cố.</p>
                  </div>
                </div>
                <button className="rounded-full border border-[#E91E63] px-6 py-2 text-[13px] font-semibold text-[#E91E63] transition hover:bg-[#FFF0F4]">
                  Chọn gói
                </button>
              </div>
            </div>

            <div className="rounded-[24px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <h3 className="mb-4 text-[16px] font-bold text-[#222222]">Mua kèm tiết kiệm hơn</h3>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {crossSellProducts.map((prod) => (
                  <div key={prod.id} className="flex flex-col items-center rounded-[18px] border border-gray-200 p-4 text-center shadow-sm">
                    <div className="mb-3 flex h-20 items-center justify-center">
                      <img src={prod.image} alt={prod.name} className="h-full object-contain" />
                    </div>
                    <h4 className="mb-1 text-[13px] font-bold text-[#222222]">{prod.name}</h4>
                    <div className="mb-3 flex items-baseline justify-center gap-1.5">
                      <span className="text-[13px] font-extrabold text-[#E91E63]">{prod.price}</span>
                      <span className="text-[11px] text-[#777777] line-through">{prod.oldPrice}</span>
                    </div>
                    <button
                      onClick={() => handleAddCrossSell(prod)}
                      className="w-full rounded-[10px] bg-[#FAFAFA] py-2 text-[13px] font-bold text-[#E91E63] transition hover:bg-[#F0F0F0]"
                    >
                      Chọn
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 xl:sticky xl:top-24">
            <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-[15px] font-bold text-[#222222]">
                <Ticket className="h-[18px] w-[18px] text-[#E91E63]" />
                <span>Mã giảm giá / Voucher</span>
              </div>
              <div className="mt-4 flex gap-2.5">
                <input
                  type="text"
                  placeholder="Nhập mã..."
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="h-11 flex-grow rounded-[10px] border border-[#EEEEEE] bg-[#FAFAFA] px-3.5 py-2 text-[14px] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
                <button className="flex h-11 items-center justify-center rounded-[10px] bg-[#E91E63] px-5 text-[14px] font-semibold text-white transition hover:bg-[#d81b60]">
                  Áp dụng
                </button>
              </div>
              <a href="#vouchers" className="mt-3 block text-[13px] font-semibold text-[#E91E63] hover:underline">
                Xem mã giảm giá của bạn &gt;
              </a>
            </div>

            <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-[15px] font-bold text-[#222222]">Thông tin nhận hàng</h3>
              <div className="mt-4 space-y-3">
                <label className={`flex items-start gap-3 rounded-[12px] border p-4 transition ${shippingMethod === 'delivery' ? 'border-[#E91E63] bg-[#FFF8FA]' : 'border-[#EEEEEE] bg-white'}`}>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'delivery'}
                    onChange={() => setShippingMethod('delivery')}
                    className="mt-1 h-4 w-4 accent-[#E91E63]"
                  />
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#222222]">
                      <Truck className="h-4 w-4 text-[#E91E63]" /> Giao hàng tận nơi
                    </span>
                    <span className="mt-1 text-[11px] font-medium text-[#777777]">Dự kiến nhận 1-3 ngày</span>
                  </div>
                </label>

                <label className={`flex items-start gap-3 rounded-[12px] border p-4 transition ${shippingMethod === 'pickup' ? 'border-[#E91E63] bg-[#FFF8FA]' : 'border-[#EEEEEE] bg-white'}`}>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'pickup'}
                    onChange={() => setShippingMethod('pickup')}
                    className="mt-1 h-4 w-4 accent-[#E91E63]"
                  />
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#222222]">
                      <Store className="h-4 w-4 text-[#E91E63]" /> Nhận tại cửa hàng
                    </span>
                    <span className="mt-1 text-[11px] font-medium text-[#777777]">Miễn phí, có hàng sau 2h</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#E91E63]/20 bg-gradient-to-br from-[#FFF8FA] to-white p-5 shadow-sm">
              <h3 className="text-[15px] font-bold text-[#222222]">Tóm tắt đơn hàng</h3>
              <div className="mt-4 space-y-3 border-b border-[#F2E6EC] pb-4 text-[13px] font-medium text-[#777777]">
                <div className="flex justify-between">
                  <span>Tạm tính ({activeItems.length} sản phẩm)</span>
                  <span className="font-bold text-[#222222]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#E91E63]">
                  <span>Giảm giá trực tiếp</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí bảo hành</span>
                  <span>0đ</span>
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-[14px] font-bold text-[#222222]">Tổng tiền</span>
                <div className="text-right">
                  <div className="text-[22px] font-extrabold leading-none text-[#E91E63]">{formatPrice(total)}</div>
                  <span className="mt-1 block text-[10px] font-medium text-[#777777]">(Đã bao gồm VAT)</span>
                </div>
              </div>

              <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-[11px] font-medium leading-relaxed text-[#777777]">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-[14px] w-[14px] rounded border-gray-300 text-[#E91E63] accent-[#E91E63]"
                />
                <span>
                  Tôi đã đọc và đồng ý với <a href="#terms" className="font-bold text-[#E91E63] underline">Điều khoản & Điều kiện</a> mua hàng tại PinkPhone.
                </span>
              </label>

              <div className="mt-5 flex flex-col gap-3">
                <button
                  onClick={handleCheckout}
                  className="flex h-11 w-full items-center justify-center rounded-[10px] bg-[#E91E63] text-[14px] font-bold text-white transition hover:bg-[#d81b60]"
                >
                  TIẾN HÀNH THANH TOÁN
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex h-11 w-full items-center justify-center rounded-[10px] border border-[#E91E63] text-[13px] font-bold text-[#E91E63] transition hover:bg-[#FFF8FA]"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
