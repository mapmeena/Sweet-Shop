import React, { createContext, useContext, useState, type ReactNode } from 'react'

export interface Sweet {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  description: string
  category: string
}

interface SweetContextType {
  sweets: Sweet[]
  addSweet: (sweet: Omit<Sweet, 'id'>) => void
  updateSweet: (id: number, sweet: Partial<Sweet>) => void
  deleteSweet: (id: number) => void
  getSweet: (id: number) => Sweet | undefined
}

const SweetContext = createContext<SweetContextType | undefined>(undefined)

const initialSweets: Sweet[] = [
  { id: 1, name: 'Gulab Jamun Box', price: 550, quantity: 15, image: '🍩', description: 'Delicious milk solids dumplings in sugar syrup', category: 'Traditional' },
  { id: 2, name: 'Barfi Assortment', price: 650, quantity: 20, image: '🍬', description: 'Mixed milk fudge varieties', category: 'Fudge' },
  { id: 3, name: 'Rasgulla Pack', price: 600, quantity: 18, image: '🥟', description: 'Soft cheese balls in sugar syrup', category: 'Traditional' },
  { id: 4, name: 'Laddu Collection', price: 700, quantity: 12, image: '🔴', description: 'Golden fried balls with nuts', category: 'Balls' },
  { id: 5, name: 'Jalebi Special', price: 750, quantity: 25, image: '🌀', description: 'Crispy orange spirals', category: 'Fried' },
  { id: 6, name: 'Kheer Mix', price: 800, quantity: 14, image: '🥛', description: 'Rice pudding with dry fruits', category: 'Traditional' },
  { id: 7, name: 'Halwa Deluxe', price: 900, quantity: 10, image: '🍂', description: 'Premium carrot halwa', category: 'Cooked' },
  { id: 8, name: 'Mithai Premium Pack', price: 1200, quantity: 8, image: '🎁', description: 'Assorted premium sweets collection', category: 'Mixed' },
  { id: 9, name: 'Royal Pedha', price: 850, quantity: 16, image: '🧁', description: 'Traditional milk fudge cubes', category: 'Fudge' },
  { id: 10, name: 'Honey Cashew Box', price: 1100, quantity: 11, image: '💰', description: 'Cashew brittle with honey', category: 'Premium' },
  { id: 11, name: 'Silk Burfi', price: 950, quantity: 13, image: '⬜', description: 'Smooth melt-in-mouth texture', category: 'Fudge' },
  { id: 12, name: 'Grand Celebration', price: 1500, quantity: 6, image: '👑', description: 'Ultimate sweets hamper', category: 'Premium' },
]

export function SweetProvider({ children }: { children: ReactNode }) {
  // Use mock data instead of backend API
  const [sweets, setSweets] = useState<Sweet[]>(initialSweets);

  // Add sweet using local state (no backend)
  const addSweet = (sweet: Omit<Sweet, 'id'>) => {
    const newSweet = {
      ...sweet,
      id: Math.max(...sweets.map(s => s.id), 0) + 1
    };
    setSweets((prev) => [...prev, newSweet]);
  };

  // Update sweet using local state (no backend)
  const updateSweet = (id: number, updates: Partial<Sweet>) => {
    setSweets((prev) => prev.map((sweet) => 
      sweet.id === id ? { ...sweet, ...updates } : sweet
    ));
  };

  // Delete sweet using local state (no backend)
  const deleteSweet = (id: number) => {
    setSweets((prev) => prev.filter((sweet) => sweet.id !== id));
  };

  const getSweet = (id: number) => sweets.find((sweet) => sweet.id === id);

  return (
    <SweetContext.Provider value={{ sweets, addSweet, updateSweet, deleteSweet, getSweet }}>
      {children}
    </SweetContext.Provider>
  )
}

export function useSweets() {
  const context = useContext(SweetContext)
  if (context === undefined) {
    throw new Error('useSweets must be used within a SweetProvider')
  }
  return context
}
