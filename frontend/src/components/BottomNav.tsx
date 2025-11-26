import { Home, Package, PlusCircle, Settings } from 'lucide-react';
import type { Screen } from '../App';

type BottomNavProps = {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
};

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { screen: 'home' as Screen, icon: Home, label: 'Home' },
    { screen: 'all-categories' as Screen, icon: PlusCircle, label: 'Category' },
    { screen: 'all-products' as Screen, icon: Package, label: 'All Products' },
    { screen: 'settings' as Screen, icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map(({ screen, icon: Icon, label }) => {
          const isActive = currentScreen === screen;
          return (
            <button
              key={screen}
              onClick={() => onNavigate(screen)}
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors min-w-[70px]"
            >
              <Icon 
                className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
                strokeWidth={2}
              />
              <span className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
