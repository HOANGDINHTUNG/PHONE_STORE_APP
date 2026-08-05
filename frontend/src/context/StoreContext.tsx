import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { User, Product, CartItem } from "../types";

import { loginApi, registerApi, logoutApi } from "../api/authService";
import { fetchProfile } from "../api/profileService";

interface StoreContextType {
  user: User | null;
  cart: CartItem[];
  wishlist: Product[];
  login: (
    emailOrPhone: string,
    password?: string,
    remember?: boolean,
  ) => Promise<User | null>;
  logout: () => Promise<void>;
  registerUser: (details: {
    fullName: string;
    phone: string;
    email?: string;
    [key: string]: any;
  }) => Promise<boolean> | boolean;
  addToCart: (product: Product | CartItem) => void;
  removeFromCart: (productId: number | string) => void;
  updateCartQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number | string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved =
      localStorage.getItem("pinkphone_user") ||
      sessionStorage.getItem("pinkphone_user");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Tự động clear mock user Nguyễn Văn Client bị kẹt trong Cache
        if (parsed?.name === "Nguyễn Văn Client") {
          localStorage.removeItem("pinkphone_user");
          sessionStorage.removeItem("pinkphone_user");
          return null;
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("pinkphone_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem("pinkphone_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("pinkphone_user", user ? JSON.stringify(user) : "");
  }, [user]);

  useEffect(() => {
    const loadProfile = async () => {
      const token =
        localStorage.getItem("pinkphone_token") ||
        sessionStorage.getItem("pinkphone_token");
      if (token) {
        const profile = await fetchProfile();
        if (profile) {
          setUser((currentUser) => ({ ...profile, role: currentUser?.role }));
        }
      }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    localStorage.setItem("pinkphone_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("pinkphone_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Auth actions
  const login = async (
    emailOrPhone: string,
    password?: string,
    remember: boolean = true,
  ) => {
    try {
      const loggedUser = await loginApi(emailOrPhone, password, remember);
      if (loggedUser) {
        setUser(loggedUser);
        return loggedUser;
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  const logout = async () => {
    try {
      if (
        localStorage.getItem("pinkphone_token") ||
        sessionStorage.getItem("pinkphone_token")
      ) {
        await logoutApi();
      }
    } catch (error) {
      // The local session must still be cleared when the server session has expired.
      console.warn("Logout API failed; clearing the local session.", error);
    } finally {
      localStorage.removeItem("pinkphone_token");
      localStorage.removeItem("pinkphone_user");
      localStorage.removeItem("pinkphone_cart");
      sessionStorage.removeItem("pinkphone_token");
      sessionStorage.removeItem("pinkphone_user");
      setCart([]);
      setUser(null);
    }
  };

  const registerUser = async (details: {
    fullName: string;
    phone: string;
    email?: string;
    [key: string]: any;
  }) => {
    const newUser = await registerApi(details);
    if (newUser) {
      setUser(newUser);
      return true;
    }
    return false;
  };

  // Cart actions
  const addToCart = (product: Product | CartItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { ...product, quantity: 1 } as CartItem];
    });
  };

  const removeFromCart = (productId: number | string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist actions
  const toggleWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      const isExist = prevWishlist.some((item) => item.id === product.id);
      if (isExist) {
        return prevWishlist.filter((item) => item.id !== product.id);
      }
      return [...prevWishlist, product];
    });
  };

  const isInWishlist = (productId: number | string) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        cart,
        wishlist,
        login,
        logout,
        registerUser,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
