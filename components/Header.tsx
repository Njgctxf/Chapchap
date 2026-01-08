
import React from 'react';
import { ViewState } from '../types';
import { DETAILED_CATEGORIES } from '../constants';

interface HeaderProps {
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
  onSearch: (query: string) => void;
  searchQuery: string;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  favoritesCount: number;
  showOnlyFavorites: boolean;
  onToggleOnlyFavorites: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onNavigate, 
  currentView, 
  onSearch, 
  searchQuery,
  selectedCategory, 
  onCategoryChange,
  favoritesCount,
  showOnlyFavorites,
  onToggleOnlyFavorites
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer flex-shrink-0" 
            onClick={() => {
              onCategoryChange(null);
              onSearch('');
              onNavigate('home');
            }}
          >
            <div className="bg-green-600 p-2 rounded-lg mr-2">
              <i className="fas fa-recycle text-white text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight hidden sm:inline">EcoSwap</span>
          </div>

          {/* Search Bar & Category Dropdown */}
          <div className="flex-1 max-w-2xl mx-4 sm:mx-8">
            <div className="relative flex items-center bg-slate-100 rounded-full border border-transparent focus-within:bg-white focus-within:ring-2 focus-within:ring-green-500 transition-all duration-200 overflow-hidden">
              {/* Category Select - Desktop with Hierarchical structure */}
              <div className="hidden md:block relative border-r border-slate-200">
                <select 
                  className="appearance-none bg-transparent pl-4 pr-8 py-2 text-sm font-medium text-slate-600 focus:outline-none cursor-pointer max-w-[180px]"
                  value={selectedCategory || ''}
                  onChange={(e) => {
                    onCategoryChange(e.target.value || null);
                    onNavigate('home');
                  }}
                >
                  <option value="">Toutes catégories</option>
                  {Object.entries(DETAILED_CATEGORIES).map(([mainCat, subCats]) => (
                    <optgroup key={mainCat} label={mainCat}>
                      <option value={mainCat}>Tout dans {mainCat}</option>
                      {Object.entries(subCats).map(([subCat, types]) => (
                        <React.Fragment key={subCat}>
                          <option value={subCat}>&nbsp;&nbsp;— {subCat}</option>
                          {types.map(type => (
                            <option key={type} value={type}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{type}</option>
                          ))}
                        </React.Fragment>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none"></i>
              </div>

              {/* Text Input */}
              <div className="relative flex-1 flex items-center">
                <i className="fas fa-search absolute left-4 text-slate-400"></i>
                <input
                  type="text"
                  placeholder="Rechercher (titre, description...)"
                  className="w-full bg-transparent border-none focus:ring-0 py-2 pl-10 pr-10 text-sm"
                  value={searchQuery}
                  onChange={(e) => {
                    onSearch(e.target.value);
                    if (currentView !== 'home' && currentView !== 'search') {
                      onNavigate('home');
                    }
                  }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => onSearch('')}
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <i className="fas fa-times-circle"></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <button 
              onClick={() => onNavigate('sell')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-medium transition-colors ${
                currentView === 'sell' 
                  ? 'bg-green-600 text-white' 
                  : 'text-green-600 border border-green-600 hover:bg-green-50'
              }`}
            >
              <i className="fas fa-plus"></i>
              <span className="hidden sm:inline">Vendre</span>
            </button>
            
            <button 
              onClick={onToggleOnlyFavorites}
              className={`relative text-slate-600 hover:text-slate-900 transition-colors p-2 ${showOnlyFavorites ? 'text-rose-500' : ''}`}
              title="Mes Favoris"
            >
              <i className={`${showOnlyFavorites ? 'fas' : 'far'} fa-heart text-xl`}></i>
              {favoritesCount > 0 && (
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white transform translate-x-1/4 -translate-y-1/4">
                  {favoritesCount}
                </span>
              )}
            </button>

            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer overflow-hidden border border-slate-200">
              <img src="https://picsum.photos/seed/me/40/40" alt="Profile" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
