"use client"

import { Product } from "@prisma/client";
import { createContext, ReactNode, useState } from "react";

interface CartProducts
  extends Pick<Product, "id" | "name" | "price" | "imageUrl"> {
  quantity: number;
}

export interface ICartContext {
  isOpen: boolean;
  products: CartProducts[];
  toggleCart: () => void;
  addProduct: (product: CartProducts) => void;
}

export const CartContext = createContext<ICartContext>({
  isOpen: false,
  products: [],
  toggleCart: () => { },
  addProduct: () => { },
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProducts[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleCart = () => { setIsOpen(prev => !prev) };
  const addProduct = (product: CartProducts) => {
    const productIsAlreadyInCart = products.some(
      (prevProduct) => prevProduct.id === product.id
    )
    if (!productIsAlreadyInCart) {
      return setProducts((prev) => [...prev, product])
    }
    setProducts(prevProduct => {
      return prevProduct.map((prevProduct) => {
        if (prevProduct.id === product.id) {
          return {
            ...prevProduct,
            quantity: prevProduct.quantity + product.quantity
          }
        }
        return prevProduct

      })
    })
  };
  return (
    <CartContext.Provider
      value={{
        isOpen,
        products,
        toggleCart,
        addProduct,
      }}>
      {children}
    </CartContext.Provider>
  );
}