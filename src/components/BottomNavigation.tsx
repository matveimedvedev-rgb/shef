import { Tab } from '../types';

interface BottomNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'recipes', label: 'Recipes', icon: '👩‍🍳' },
    { id: 'add-item', label: 'Add', icon: '➕' },
    { id: 'expiration', label: 'Expiration', icon: '⏰' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral/50 shadow-lg z-40">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-around py-2 relative">
          {tabs.map((tab) => {
            const isAddButton = tab.id === 'add-item';
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center transition-all duration-150 ease-out active:scale-95 ${
                  isAddButton
                    ? 'absolute left-1/2 transform -translate-x-1/2 -top-6 w-16 h-16 rounded-full bg-primary text-white shadow-lg hover:shadow-xl z-50'
                    : `py-2 px-4 rounded-full ${
                        activeTab === tab.id
                          ? 'bg-primary/10 text-primary'
                          : 'text-text-secondary'
                      }`
                }`}
              >
                <span className={`${isAddButton ? 'text-2xl' : 'text-xl mb-1'}`}>
                  {tab.icon}
                </span>
                {!isAddButton && (
                  <span className="text-xs font-medium">{tab.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

