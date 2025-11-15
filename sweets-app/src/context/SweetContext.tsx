import React, { createContext, useContext, useState, type ReactNode } from 'react'
import axios from 'axios';
import api from '../api';

export interface Sweet {
  id: string | number
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
  updateSweet: (id: number | string, sweet: Partial<Sweet>) => void
  deleteSweet: (id: number | string) => void
  getSweet: (id: number | string) => Sweet | undefined
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
  const [sweets, setSweets] = useState<Sweet[]>([]);

  // Fetch sweets from backend API
  const fetchSweets = async () => {
    try {
      const res = await api.get('/api/sweets');
      // Map MongoDB _id to id for frontend compatibility
      const sweetsData = res.data.map((sweet: any) => ({
        ...sweet,
        id: sweet._id || sweet.id
      }));
      setSweets(sweetsData);
    } catch (err) {
      console.error('Failed to fetch sweets:', err);
    }
  };

  // Add sweet using backend API (JWT required)
  const addSweet = async (sweet: Omit<Sweet, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/api/sweets', sweet, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newSweet = { ...res.data, id: res.data._id || res.data.id };
      setSweets((prev) => [...prev, newSweet]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || 'Failed to add sweet');
      }
    }
  };

  // Update sweet using backend API (JWT required)
  const updateSweet = async (id: number | string, updates: Partial<Sweet>) => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.put(`/api/sweets/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedSweet = { ...res.data, id: res.data._id || res.data.id };
      setSweets((prev) => prev.map((sweet) => sweet.id == id ? updatedSweet : sweet));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || 'Failed to update sweet');
      }
    }
  };

  // Delete sweet using backend API (JWT required)
  const deleteSweet = async (id: number | string) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/api/sweets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSweets((prev) => prev.filter((sweet) => sweet.id != id));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || 'Failed to delete sweet');
      }
    }
  };

  const getSweet = (id: number | string) => sweets.find((sweet) => sweet.id == id);

  // Fetch sweets on mount
  React.useEffect(() => {
    fetchSweets();
  }, []);

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
