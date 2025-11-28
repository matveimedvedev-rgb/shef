import { useState } from 'react';
import { InventoryItem, Recipe, Tab } from './types';
import Home from './components/Home';
import RecipeGenerator from './components/RecipeGenerator';
import Expiration from './components/Expiration';
import Inventory from './components/Inventory';
import AddItem from './components/AddItem';
import BottomNavigation from './components/BottomNavigation';

// Dummy data
const initialInventory: InventoryItem[] = [
  { id: '1', name: 'Milk', quantity: '1 carton', expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  { id: '2', name: 'Eggs', quantity: '12', expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  { id: '3', name: 'Bread', quantity: '1 loaf', expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  { id: '4', name: 'Chicken', quantity: '500g', expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  { id: '5', name: 'Tomatoes', quantity: '6', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  { id: '6', name: 'Rice', quantity: '2kg', expires: undefined },
];

const initialRecipes: Recipe[] = [
  { 
    id: '1', 
    name: 'Scrambled Eggs', 
    tags: ['15 min', 'High protein'],
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop'
  },
  { 
    id: '2', 
    name: 'Chicken Stir Fry', 
    tags: ['30 min', 'High protein'],
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop'
  },
  { 
    id: '3', 
    name: 'Tomato Pasta', 
    tags: ['20 min', 'Vegetarian'],
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop'
  },
];

const extraRecipes: Recipe[] = [
  { 
    id: '4', 
    name: 'Fried Rice', 
    tags: ['25 min', 'Quick'],
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop'
  },
  { 
    id: '5', 
    name: 'Chicken Salad', 
    tags: ['15 min', 'Healthy'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
  },
  { 
    id: '6', 
    name: 'Omelette', 
    tags: ['10 min', 'High protein'],
    image: 'https://images.unsplash.com/photo-1612929633736-8c8b2f8c8c8c?w=400&h=300&fit=crop'
  },
  { 
    id: '7', 
    name: 'Pasta Carbonara', 
    tags: ['30 min', 'Comfort food'],
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop'
  },
  { 
    id: '8', 
    name: 'Grilled Salmon', 
    tags: ['20 min', 'High protein', 'Healthy'],
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop'
  },
  { 
    id: '9', 
    name: 'Vegetable Soup', 
    tags: ['35 min', 'Vegetarian', 'Comfort food'],
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop'
  },
  { 
    id: '11', 
    name: 'Caesar Salad', 
    tags: ['15 min', 'Vegetarian', 'Quick'],
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop'
  },
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);

  const renderCurrentScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home
            onNavigate={setActiveTab}
            onOpenAddItem={() => setActiveTab('add-item')}
            expiringCount={inventory.filter(item => {
              if (!item.expires) return false;
              const expDate = new Date(item.expires);
              const today = new Date();
              const diffTime = expDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays <= 3;
            }).length}
            inventory={inventory}
            recipes={recipes}
          />
        );
      case 'recipes':
        return (
          <RecipeGenerator
            inventory={inventory}
            recipes={recipes}
            onAddRecipe={(recipe) => {
              setRecipes([...recipes, { ...recipe, id: Date.now().toString() }]);
            }}
            extraRecipes={extraRecipes}
          />
        );
      case 'expiration':
        return <Expiration inventory={inventory} />;
      case 'inventory':
        return (
          <Inventory
            inventory={inventory}
            onRemoveItem={(id) => {
              setInventory(inventory.filter(item => item.id !== id));
            }}
          />
        );
      case 'add-item':
        return (
          <AddItem
            onAddItem={(item) => {
              setInventory([...inventory, { ...item, id: Date.now().toString() }]);
            }}
            onNavigate={setActiveTab}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {renderCurrentScreen()}
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;

