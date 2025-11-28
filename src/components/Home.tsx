import { Tab, InventoryItem, Recipe } from '../types';

interface HomeProps {
  onNavigate: (tab: Tab) => void;
  onOpenAddItem: () => void;
  expiringCount: number;
  inventory: InventoryItem[];
  recipes: Recipe[];
}

export default function Home({ onNavigate, onOpenAddItem, expiringCount, inventory, recipes }: HomeProps) {
  const getFoodEmoji = (name: string): string => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('milk')) return '🥛';
    if (nameLower.includes('egg')) return '🥚';
    if (nameLower.includes('bread')) return '🍞';
    if (nameLower.includes('chicken')) return '🍗';
    if (nameLower.includes('tomato')) return '🍅';
    if (nameLower.includes('rice')) return '🍚';
    if (nameLower.includes('banana')) return '🍌';
    if (nameLower.includes('apple')) return '🍎';
    return '🍽️';
  };

  return (
    <div className="page-transition">
      <div className="mb-10">
        <h1 className="text-[36px] font-bold text-text mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          What do you want to eat tonight? 🍽️
        </h1>
        <p className="text-lg text-text-secondary">No more dinner dread. Let's make meal planning simple.</p>
      </div>

      {/* Recipes - Top */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate('recipes')}
          className="group w-full bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 ease-out active:scale-95 border-l-4 border-accent relative overflow-hidden mb-3"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <span className="text-4xl">👩‍🍳</span>
              <div className="text-left">
                <div className="text-text font-bold text-xl mb-1">Recipes</div>
                <div className="text-text-secondary text-sm">Find your next meal</div>
              </div>
            </div>
            <span className="text-accent font-bold text-lg group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </div>
        </button>

        {/* Recipes carousel */}
        {recipes.length > 0 && (
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex gap-3 min-w-max">
              {recipes.slice(0, 10).map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex-shrink-0 bg-white rounded-xl shadow-md w-40 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {recipe.image ? (
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                      <span className="text-4xl">👩‍🍳</span>
                    </div>
                  )}
                  <div className="p-3">
                    <div className="text-sm font-semibold text-text truncate mb-1">{recipe.name}</div>
                    {recipe.tags && recipe.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {recipe.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Products */}
      <div className="mb-6">
        <button
          onClick={onOpenAddItem}
          className="group w-full bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 ease-out active:scale-95 border-l-4 border-primary relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🍏</span>
              <div className="text-left">
                <div className="text-text font-bold text-xl mb-1">Add Items</div>
                <div className="text-text-secondary text-sm">Track what you buy</div>
              </div>
            </div>
            <span className="text-primary font-bold text-lg group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </div>
        </button>
      </div>

      {/* Inventory - Bottom with carousel */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate('inventory')}
          className="group w-full bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 ease-out active:scale-95 border-l-4 border-neutral/50 hover:border-primary/50 relative overflow-hidden mb-3"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neutral/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🧺</span>
              <div className="text-left">
                <div className="text-text font-bold text-xl mb-1">Inventory</div>
                <div className="text-text-secondary text-sm">{inventory.length} items in your kitchen</div>
              </div>
            </div>
            <span className="text-text-secondary font-bold text-lg group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </div>
        </button>

        {/* Inventory carousel */}
        {inventory.length > 0 && (
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex gap-3 min-w-max">
              {inventory.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 bg-white rounded-xl p-4 shadow-md w-32 hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{getFoodEmoji(item.name)}</div>
                    <div className="text-sm font-semibold text-text truncate">{item.name}</div>
                    <div className="text-xs text-text-secondary mt-1 truncate">{item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Expiring items carousel - Bottom */}
      {expiringCount > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-text">⚠️ About to go bad</h2>
            <button
              onClick={() => onNavigate('expiration')}
              className="text-accent font-medium text-sm hover:underline"
            >
              View all →
            </button>
          </div>
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex gap-3 min-w-max">
              {inventory
                .filter((item) => {
                  if (!item.expires) return false;
                  const expDate = new Date(item.expires);
                  const today = new Date();
                  const diffTime = expDate.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays <= 3;
                })
                .slice(0, 10)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 bg-white rounded-xl p-4 shadow-md w-32 hover:shadow-lg transition-all duration-300 border border-red-200"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{getFoodEmoji(item.name)}</div>
                      <div className="text-sm font-semibold text-text truncate">{item.name}</div>
                      <div className="text-xs text-red-600 mt-1">
                        {(() => {
                          const expDate = new Date(item.expires!);
                          const today = new Date();
                          const diffTime = expDate.getTime() - today.getTime();
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          if (diffDays < 0) return 'Expired';
                          if (diffDays === 0) return 'Today';
                          return `${diffDays}d left`;
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

