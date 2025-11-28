export interface InventoryItem {
  id: string;
  name: string;
  quantity: string;
  expires?: string; // ISO date string
}

export interface Recipe {
  id: string;
  name: string;
  tags?: string[];
  image?: string;
}

export type Tab = 'home' | 'recipes' | 'expiration' | 'inventory' | 'add-item';

