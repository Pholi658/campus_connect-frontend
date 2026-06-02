import { create } from 'zustand';

export interface FavoriteVendor {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
}

interface FavoritesState {
  favorites: FavoriteVendor[];
  isOpen: boolean;
  toggleFavorite: (vendor: FavoriteVendor) => void;
  isFavorite: (id: string) => boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isOpen: false,
  toggleFavorite: (vendor) => set((state) => {
    const exists = state.favorites.find((v) => v.id === vendor.id);
    if (exists) {
      return {
        favorites: state.favorites.filter((v) => v.id !== vendor.id),
      };
    }
    return { favorites: [...state.favorites, vendor] };
  }),
  isFavorite: (id) => get().favorites.some((v) => v.id === id),
  setIsOpen: (isOpen) => set({ isOpen }),
}));
