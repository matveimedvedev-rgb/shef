import { InventoryItem } from '../types';

interface ExpirationProps {
  inventory: InventoryItem[];
}

export default function Expiration({ inventory }: ExpirationProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysUntilExpiry = (expires?: string): number | null => {
    if (!expires) return null;
    const expDate = new Date(expires);
    expDate.setHours(0, 0, 0, 0);
    const diffTime = expDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryText = (days: number | null): string => {
    if (days === null) return '';
    if (days < 0) return 'Expired';
    if (days === 0) return 'Today';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  };

  const expiringItems = inventory.filter((item) => {
    const days = getDaysUntilExpiry(item.expires);
    return days !== null && days <= 3;
  });

  const okItems = inventory.filter((item) => {
    const days = getDaysUntilExpiry(item.expires);
    return days === null || days > 3;
  });

  const getFoodEmoji = (name: string): string => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('milk')) return '🥛';
    if (nameLower.includes('egg')) return '🥚';
    if (nameLower.includes('bread')) return '🍞';
    if (nameLower.includes('chicken')) return '🍗';
    if (nameLower.includes('tomato')) return '🍅';
    if (nameLower.includes('rice')) return '🍚';
    return '🍽️';
  };

  return (
    <div className="page-transition">
      <div className="mb-10">
        <h1 className="text-[36px] font-bold text-text mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Use It or Lose It
        </h1>
        <p className="text-lg text-text-secondary">Stop food guilt. Use what's about to go bad.</p>
      </div>

      <div className="space-y-4">
        {/* Expiring soon section */}
        {expiringItems.length > 0 && (
          <div className="bg-expiring-bg rounded-xl p-5 shadow-sm border border-red-200">
            <h2 className="text-lg font-semibold text-text mb-4">⚠️ About to go bad</h2>
            <div className="space-y-3">
              {expiringItems.map((item) => {
                const days = getDaysUntilExpiry(item.expires);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-white rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getFoodEmoji(item.name)}</span>
                      <div>
                        <div className="text-text font-medium">{item.name}</div>
                        <div className="text-sm text-text-secondary">
                          {getExpiryText(days)}
                        </div>
                      </div>
                    </div>
                    <button className="text-sm px-3 py-1.5 border border-red-300 text-red-600 rounded-full hover:bg-red-50 transition-all duration-150 ease-out active:scale-95">
                      Cook now
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Okay section */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-text mb-4">✅ Still fresh</h2>
          <div className="space-y-3">
            {okItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-neutral/30 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getFoodEmoji(item.name)}</span>
                    <div>
                      <div className="text-text font-medium">{item.name}</div>
                      {item.expires && (
                        <div className="text-sm text-text-secondary">
                          Expires: {new Date(item.expires).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-fresh"></div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

