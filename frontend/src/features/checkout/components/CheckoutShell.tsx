import React from "react";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function CheckoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md">
      {/* TopNavBar */}
      <header className="bg-surface dark:bg-surface-dim shadow-sm w-full top-0 sticky z-50">
        <div className="flex justify-between items-center w-full px-4 md:px-auto py-4 max-w-[1200px] mx-auto">
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold text-primary dark:text-secondary-fixed-dim"
          >
            PinkPhone
          </Link>
          <div className="flex items-center gap-4">
            <button className="text-primary dark:text-inverse-primary hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <HelpCircle size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-10 px-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low dark:bg-surface-container-highest border-t border-outline-variant dark:border-outline w-full bottom-0 mt-auto">
        <div className="w-full py-8 md:py-12 px-4 flex flex-col md:flex-row justify-between items-center gap-4 max-w-[1200px] mx-auto">
          <div className="text-xl font-bold text-primary">PinkPhone</div>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
            <a
              className="text-on-surface-variant dark:text-surface-variant hover:text-secondary transition-colors cursor-pointer"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-on-surface-variant dark:text-surface-variant hover:text-secondary transition-colors cursor-pointer"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-on-surface-variant dark:text-surface-variant hover:text-secondary transition-colors cursor-pointer"
              href="#"
            >
              Shipping Info
            </a>
            <a
              className="text-on-surface-variant dark:text-surface-variant hover:text-secondary transition-colors cursor-pointer"
              href="#"
            >
              Contact Us
            </a>
          </div>
          <div className="text-sm font-semibold text-on-surface-variant dark:text-surface-variant">
            © 2024 PinkPhone Retail. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
