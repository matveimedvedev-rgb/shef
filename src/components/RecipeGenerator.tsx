import { useState } from 'react';
import { InventoryItem, Recipe } from '../types';

interface RecipeGeneratorProps {
  inventory: InventoryItem[];
  recipes: Recipe[];
  onAddRecipe: (recipe: Recipe) => void;
  extraRecipes: Recipe[];
}

export default function RecipeGenerator({
  inventory,
  recipes,
  onAddRecipe,
  extraRecipes,
}: RecipeGeneratorProps) {
  const [ingredientMode, setIngredientMode] = useState<'all' | 'manual'>('all');
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [availableExtraRecipes, setAvailableExtraRecipes] = useState(extraRecipes);

  const toggleIngredient = (name: string) => {
    const newSet = new Set(selectedIngredients);
    if (newSet.has(name)) {
      newSet.delete(name);
    } else {
      newSet.add(name);
    }
    setSelectedIngredients(newSet);
  };

  const handleAddRecipe = (recipe: Recipe) => {
    onAddRecipe(recipe);
    setAvailableExtraRecipes(availableExtraRecipes.filter(r => r.id !== recipe.id));
    setShowAddModal(false);
  };

  return (
    <div className="page-transition">
      <div className="mb-10">
        <h1 className="text-[36px] font-bold text-text mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          What Can You Cook?
        </h1>
        <p className="text-lg text-text-secondary">No more "nothing to cook with what we have." Get meal ideas from your inventory.</p>
      </div>

      {/* Ingredients mode */}
      <div className="mb-6">
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setIngredientMode('all')}
            className={`flex-1 py-2.5 px-4 rounded-full font-medium transition-all duration-150 ease-out active:scale-95 ${
              ingredientMode === 'all'
                ? 'bg-primary text-white'
                : 'bg-neutral text-text-secondary'
            }`}
          >
            Use all ingredients
          </button>
          <button
            onClick={() => setIngredientMode('manual')}
            className={`flex-1 py-2.5 px-4 rounded-full font-medium transition-all duration-150 ease-out active:scale-95 ${
              ingredientMode === 'manual'
                ? 'bg-primary text-white'
                : 'bg-neutral text-text-secondary'
            }`}
          >
            Select manually
          </button>
        </div>

        {ingredientMode === 'manual' && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="space-y-2">
              {inventory.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center py-2 border-b border-neutral/50 last:border-0 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedIngredients.has(item.name)}
                    onChange={() => toggleIngredient(item.name)}
                    className="w-4 h-4 rounded text-primary mr-3"
                  />
                  <span className="text-text">{item.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recipes section */}
      <div>
        <h2 className="text-xl font-semibold text-text mb-4">Meal ideas to break the rut</h2>
        <div className="space-y-3">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-out overflow-hidden card-hover"
            >
              <div className="flex gap-4">
                {recipe.image ? (
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-32 h-32 object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl">👩‍🍳</span>
                  </div>
                )}
                <div className="flex-1 p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-text font-bold text-lg mb-2">{recipe.name}</h3>
                    {recipe.tags && recipe.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {recipe.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2.5 py-1 rounded-full bg-accent/20 text-accent font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="text-primary font-semibold text-sm hover:underline ml-4">
                    View →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add more recipes button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-4 bg-primary text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-150 ease-out active:scale-95 z-10"
      >
        + Add more recipes
      </button>

      {/* Add recipes modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-end"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-t-3xl w-full max-h-[70vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-text">Add Recipes</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-text-secondary text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              {availableExtraRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex items-center justify-between p-3 bg-background rounded-xl"
                >
                  <span className="text-text font-medium">{recipe.name}</span>
                  <button
                    onClick={() => handleAddRecipe(recipe)}
                    className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-all duration-150 ease-out active:scale-95"
                  >
                    Add
                  </button>
                </div>
              ))}
              {availableExtraRecipes.length === 0 && (
                <p className="text-text-secondary text-center py-4">
                  No more recipes available
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

