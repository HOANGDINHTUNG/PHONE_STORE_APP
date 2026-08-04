import React from "react";
import { Link } from "react-router-dom";

const EmptyCartState = () => {
  return (
    <>
      <style>{`
        @keyframes float-cart {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float-cart {
          animation: float-cart 3s ease-in-out infinite;
        }
      `}</style>
      <section className="w-full max-w-[1200px] mx-auto px-lg py-xl flex flex-col items-center justify-center text-center mt-8 mb-12">
        <div className="animate-float-cart mb-lg">
          <svg
            fill="none"
            height="240"
            viewBox="0 0 240 240"
            width="240"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="120"
              cy="120"
              fill="var(--color-primary-fixed)"
              r="100"
            ></circle>
            <path
              d="M70 90H170L160 170H80L70 90Z"
              stroke="var(--color-primary-container)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="6"
            ></path>
            <path
              d="M95 90C95 70 100 60 120 60C140 60 145 70 145 90"
              stroke="var(--color-primary-container)"
              strokeLinecap="round"
              strokeWidth="6"
            ></path>
            <circle
              cx="105"
              cy="125"
              fill="var(--color-primary-container)"
              r="5"
            ></circle>
            <circle
              cx="135"
              cy="125"
              fill="var(--color-primary-container)"
              r="5"
            ></circle>
            <path
              d="M110 145C110 145 115 150 120 150C125 150 130 145 130 145"
              stroke="var(--color-primary-container)"
              strokeLinecap="round"
              strokeWidth="3"
            ></path>
            <rect
              fill="var(--color-secondary-fixed)"
              height="20"
              rx="4"
              transform="rotate(-15 50 150)"
              width="20"
              x="50"
              y="150"
            ></rect>
            <rect
              fill="var(--color-secondary-fixed)"
              height="15"
              rx="3"
              transform="rotate(20 180 100)"
              width="15"
              x="180"
              y="100"
            ></rect>
          </svg>
        </div>
        <h1 className="font-headline-md text-headline-md text-on-surface mb-sm font-bold">
          Giỏ hàng của bạn đang trống
        </h1>
        <p className="w-full max-w-[36rem] mx-auto px-4 font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-xl">
          Hãy lựa chọn chiếc điện thoại phù hợp và quay lại đây để hoàn tất đơn
          hàng.
        </p>
        <Link
          className="bg-primary text-white px-xl py-md rounded-full font-label-sm text-label-sm hover:bg-secondary transition-all duration-200 active:scale-95 shadow-md inline-block leading-[3rem]"
          to="/"
        >
          Tiếp tục mua sắm
        </Link>
      </section>
    </>
  );
};

export default EmptyCartState;
