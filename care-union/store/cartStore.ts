import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartStore } from '@/types'

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const items = get().items
        const existing = items.find(i => i.id === newItem.id)
        if (existing) {
          set({ items: items.map(i => i.id === newItem.id
            ? { ...i, quantity: i.quantity + newItem.quantity, subtotal: (i.quantity + newItem.quantity) * i.unit_price }
            : i) })
        } else {
          set({ items: [...items, { ...newItem, subtotal: newItem.quantity * newItem.unit_price }] })
        }
      },
      removeItem: (id) => set({ items: get().items.filter(i => i.id !== id) }),
      updateQty: (id, qty) => {
        const items = get().items
        const item = items.find(i => i.id === id)
        if (!item) return
        const newQty = Math.max(item.min_qty, qty)
        set({ items: items.map(i => i.id === id ? { ...i, quantity: newQty, subtotal: newQty * i.unit_price } : i) })
      },
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((s, i) => s + i.subtotal, 0),
      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'care-union-cart' }
  )
)
