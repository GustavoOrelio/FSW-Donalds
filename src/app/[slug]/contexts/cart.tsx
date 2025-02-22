"use client"

import { Product } from "@prisma/client";
import { createContext, ReactNode, useState } from "react";

export interface CartProducts
  extends Pick<Product, "id" | "name" | "price" | "imageUrl"> {
  quantity: number;
}

export interface ICartContext {
  isOpen: boolean;
  products: CartProducts[];
  total: number;
  toggleCart: () => void;
  addProduct: (product: CartProducts) => void;
  decreaseProductQuantity: (ProductId: string) => void;
  increaseProductQuantity: (ProductId: string) => void;
  removeProduct: (ProductId: string) => void;
}

export const CartContext = createContext<ICartContext>({
  isOpen: false,
  products: [],
  total: 0,
  toggleCart: () => { },
  addProduct: () => { },
  decreaseProductQuantity: () => { },
  increaseProductQuantity: () => { },
  removeProduct: () => { },
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProducts[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const total = products.reduce((acc, product) => {
    return acc + product.price * product.quantity
  }, 0)
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
  const decreaseProductQuantity = (productId: string) => {
    setProducts(prevProducts => {
      return prevProducts.map(prevProduct => {
        if (prevProduct.id !== productId) {
          return prevProduct;
        }
        if (prevProduct.quantity === 1) {
          return prevProduct;
        }
        return { ...prevProduct, quantity: prevProduct.quantity - 1 }
      })
    })
  }
  const increaseProductQuantity = (productId: string) => {
    setProducts(prevProducts => {
      return prevProducts.map(prevProduct => {
        if (prevProduct.id !== productId) {
          return prevProduct;
        }
        return { ...prevProduct, quantity: prevProduct.quantity + 1 }
      })
    })
  }
  const removeProduct = (productId: string) => {
    setProducts(prevProducts => prevProducts.filter(prevProduct => prevProduct.id !== productId))
  }
  return (
    <CartContext.Provider
      value={{
        isOpen,
        products,
        toggleCart,
        addProduct,
        decreaseProductQuantity,
        increaseProductQuantity,
        removeProduct,
        total,
      }}>
      {children}
    </CartContext.Provider>
  );
}