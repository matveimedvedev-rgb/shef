import { InventoryItem } from '../types';

interface InventoryProps {
  inventory: InventoryItem[];
  onRemoveItem: (id: string) => void;
}

export default function Inventory({
  inventory,
  onRemoveItem,
}: InventoryProps) {

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
          What's in Your Kitchen
        </h1>
        <p className="text-lg text-text-secondary">Stop buying duplicates. See what you actually have.</p>
      </div>

      {/* Inventory list */}
      <div className="space-y-4">
        {inventory.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 ease-out card-hover border border-neutral/20 hover:border-primary/30 scale-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-3xl flex-shrink-0 shadow-md hover:scale-110 transition-transform duration-300">
                {getFoodEmoji(item.name)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-text font-bold text-lg mb-1">{item.name}</div>
                <div className="text-sm text-text-secondary flex items-center gap-2">
                  <span className="bg-neutral/30 px-2 py-0.5 rounded-full">{item.quantity}</span>
                  {item.expires && (
                    <span className="text-xs">
                      exp {new Date(item.expires).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Remove button */}
              <button
                onClick={() => onRemoveItem(item.id)}
                className="bg-gradient-to-r from-red-100 to-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold hover:from-red-200 hover:to-red-100 transition-all duration-300 ease-out active:scale-95 flex-shrink-0 shadow-sm hover:shadow-md border border-red-200/50"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {inventory.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-neutral/20">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-xl font-semibold text-text mb-2">Your kitchen is empty</p>
            <p className="text-sm text-text-secondary">Add items to avoid duplicate shopping and reduce food waste</p>
          </div>
        )}
      </div>
    </div>
  );
}
