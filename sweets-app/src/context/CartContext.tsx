import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Sweet } from './SweetContext'

interface CartItem extends Sweet {
  cartQuantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (sweet: Sweet, quantity: number) => void
  removeFromCart: (id: string | number) => void
  updateCartQuantity: (id: string | number, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  getTaxAmount: () => number
  getGrandTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (sweet: Sweet, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id == sweet.id)
      
      if (existingItem) {
        // Update quantity if item already in cart
        return prevCart.map((item) =>
          item.id == sweet.id
            ? { ...item, cartQuantity: item.cartQuantity + quantity }
            : item
        )
      } else {
        // Add new item to cart
        return [...prevCart, { ...sweet, cartQuantity: quantity }]
      }
    })
  }

  const removeFromCart = (id: string | number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id != id))
  }

  const updateCartQuantity = (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id == id ? { ...item, cartQuantity: quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('cart')
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.cartQuantity, 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.cartQuantity, 0)
  }

  const getTaxAmount = () => {
    const subtotal = getCartTotal()
    return Math.round(subtotal * 0.05) // 5% GST
  }

  const getGrandTotal = () => {
    return getCartTotal() + getTaxAmount()
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getTaxAmount,
        getGrandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
