'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MenuItem {
  id: number;
  menu_id: number;
  name: string;
  price: number;
  category: string;
  image_url: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface GroupedMenuItems {
  [menuType: string]: {
    [category: string]: MenuItem[];
  };
}

interface ShoppingCartContextType {
  cartItems: CartItem[];
  menuItems: GroupedMenuItems;
  setMenuItems: React.Dispatch<React.SetStateAction<GroupedMenuItems>>;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export function ShoppingCartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [menuItems, setMenuItems] = useState<GroupedMenuItems>({});

  const addToCart = (item: MenuItem) => {
    setCartItems(currentItems => {
      const existingItem = currentItems.find(i => i.id === item.id);
      if (existingItem) {
        return currentItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...currentItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(currentItems => {
      const existingItem = currentItems.find(i => i.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return currentItems.map(i =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return currentItems.filter(i => i.id !== itemId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <ShoppingCartContext.Provider value={{ 
      cartItems, 
      menuItems, 
      setMenuItems, 
      addToCart, 
      removeFromCart, 
      clearCart 
    }}>
      {children}
    </ShoppingCartContext.Provider>
  );
}

export function useShoppingCart() {
  const context = useContext(ShoppingCartContext);
  if (context === undefined) {
    throw new Error('useShoppingCart must be used within a ShoppingCartProvider');
  }
  return context;
}