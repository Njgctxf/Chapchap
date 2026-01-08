
import React, { useState, useEffect } from 'react';
import { Item, ViewState, ItemCondition } from './types';
import { MOCK_ITEMS, CATEGORIES, DETAILED_CATEGORIES } from './constants';
import Header from './components/Header';
import ItemCard from './components/ItemCard';
import ListingForm from './components/ListingForm';

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  // Favorites state: storing only IDs for better efficiency
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('ecoswap_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist favorites to localStorage
  useEffect(() => {
    localStorage.setItem('ecoswap_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  // Helper function to normalize text (remove accents and lower case)
  const normalizeText = (text: string) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  /**
   * Checks if an item's category matches the selected category or its descendants.
   */
  const matchesCategoryHierarchy = (itemCat: string, selectedCat: string): boolean => {
    // Direct match
    if (itemCat === selectedCat) return true;

    // Check if selectedCat is a main category
    const mainTree = DETAILED_CATEGORIES[selectedCat];
    if (mainTree) {
      // Is itemCat a sub-category?
      if (Object.keys(mainTree).includes(itemCat)) return true;
      // Is itemCat a specific type?
      return Object.values(mainTree).some(types => types.includes(itemCat));
    }

    // Check if selectedCat is a sub-category (level 2)
    for (const mainCatKey in DETAILED_CATEGORIES) {
      const subTree = DETAILED_CATEGORIES[mainCatKey][selectedCat];
      if (subTree && subTree.includes(itemCat)) {
        return true;
      }
    }

    return false;
  };

  const filteredItems = items.filter(item => {
    const normalizedQuery = normalizeText(searchQuery);
    const matchesSearch = normalizeText(item.title).includes(normalizedQuery) || 
                         normalizeText(item.description).includes(normalizedQuery);
    
    const matchesCategory = selectedCategory 
      ? matchesCategoryHierarchy(item.category, selectedCategory) 
      : true;
      
    const matchesFavorites = showOnlyFavorites ? favorites.includes(item.id) : true;
    
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const handlePublish = (data: any) => {
    const newItem: Item = {
      id: Date.now().toString(),
      ...data,
      seller: {
        name: 'Moi',
        rating: 5.0,
        avatar: 'https://picsum.photos/seed/me/100/100'
      },
      createdAt: new Date().toISOString()
    };
    setItems([newItem, ...items]);
    setCurrentView('home');
    alert("Votre annonce a été publiée avec succès !");
  };

  const renderHome = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Banner */}
      {!showOnlyFavorites && !searchQuery && !selectedCategory && (
        <section className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-xl">
          <img 
            src="https://picsum.photos/seed/sustainable/1200/400" 
            alt="Sustainable Fashion" 
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 text-white max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
              Donnez une seconde vie à vos objets
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-6">
              Achetez et vendez facilement sur la première plateforme de seconde main alimentée par l'IA.
            </p>
            <button 
              onClick={() => setCurrentView('sell')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full w-fit transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              Commencer à vendre
            </button>
          </div>
        </section>
      )}

      {/* Category Pills */}
      {!showOnlyFavorites && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Parcourir par catégorie</h2>
            <button 
              className="text-green-600 font-semibold text-sm hover:underline"
              onClick={() => setSelectedCategory(null)}
            >
              Tout voir
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                  selectedCategory === cat 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-green-500 hover:text-green-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Grid Items */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            {showOnlyFavorites 
              ? 'Mes Favoris' 
              : selectedCategory ? `Articles dans "${selectedCategory}"` : 'Articles recommandés'}
          </h2>
          {(searchQuery || showOnlyFavorites || selectedCategory) && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setShowOnlyFavorites(false);
                setSelectedCategory(null);
              }}
              className="text-sm text-slate-400 hover:text-green-600 transition-colors ml-4"
            >
              Effacer les filtres
            </button>
          )}
        </div>
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredItems.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                isFavorited={favorites.includes(item.id)}
                onToggleFavorite={toggleFavorite}
                onClick={(it) => { setSelectedItem(it); setCurrentView('details'); }} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <i className={`${showOnlyFavorites ? 'fas fa-heart' : 'fas fa-search'} text-4xl text-slate-300 mb-4`}></i>
            <p className="text-slate-500">
              {showOnlyFavorites 
                ? "Vous n'avez pas encore d'articles en favoris." 
                : "Aucun article ne correspond à vos critères."}
            </p>
            <button 
              className="mt-4 text-green-600 font-bold"
              onClick={() => { 
                setSelectedCategory(null); 
                setSearchQuery(''); 
                setShowOnlyFavorites(false);
              }}
            >
              {showOnlyFavorites ? "Découvrir des articles" : "Réinitialiser les filtres"}
            </button>
          </div>
        )}
      </section>
    </div>
  );

  const renderDetails = () => {
    if (!selectedItem) return null;
    return (
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in zoom-in duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Gallery */}
          <div className="md:w-1/2 p-4 md:p-8 bg-slate-50">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg relative">
              <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-full object-cover" />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(selectedItem.id);
                }}
                className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  favorites.includes(selectedItem.id) 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-white/80 backdrop-blur-sm text-slate-800 hover:bg-white'
                }`}
              >
                <i className={`${favorites.includes(selectedItem.id) ? 'fas' : 'far'} fa-heart text-xl`}></i>
              </button>
            </div>
          </div>
          
          {/* Info */}
          <div className="md:w-1/2 p-8 flex flex-col">
            <button 
              onClick={() => setCurrentView('home')}
              className="mb-6 text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2"
            >
              <i className="fas fa-arrow-left"></i>
              Retour
            </button>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold text-green-600 uppercase tracking-widest">{selectedItem.category}</span>
                <h1 className="text-3xl font-bold text-slate-900 mt-1">{selectedItem.title}</h1>
              </div>
              <div className="text-3xl font-bold text-slate-900">{selectedItem.price}€</div>
            </div>

            <div className="flex items-center gap-2 mb-8 p-3 bg-slate-50 rounded-xl">
              <img src={selectedItem.seller.avatar} className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-sm font-bold text-slate-800">{selectedItem.seller.name}</p>
                <div className="flex items-center text-xs text-amber-500">
                  <i className="fas fa-star mr-1"></i>
                  <span>{selectedItem.seller.rating} rating</span>
                </div>
              </div>
              <button className="ml-auto text-green-600 font-bold text-sm px-4 py-2 border border-green-600 rounded-lg hover:bg-green-50">
                Contacter
              </button>
            </div>

            <div className="space-y-6 flex-grow">
              <div>
                <h3 className="font-bold text-slate-800 mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed">{selectedItem.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-slate-100 rounded-xl bg-slate-50">
                  <span className="block text-xs text-slate-400 uppercase font-bold">État</span>
                  <span className="font-semibold text-slate-800">{selectedItem.condition}</span>
                </div>
                <div className="p-3 border border-slate-100 rounded-xl bg-slate-50">
                  <span className="block text-xs text-slate-400 uppercase font-bold">Publié le</span>
                  <span className="font-semibold text-slate-800">{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-3">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95">
                Acheter maintenant
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-12">
      <Header 
        onNavigate={setCurrentView} 
        currentView={currentView} 
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        favoritesCount={favorites.length}
        showOnlyFavorites={showOnlyFavorites}
        onToggleOnlyFavorites={() => {
          setShowOnlyFavorites(!showOnlyFavorites);
          setCurrentView('home');
        }}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && renderHome()}
        {currentView === 'sell' && (
          <div className="animate-in slide-in-from-bottom duration-500">
            <ListingForm 
              onCancel={() => setCurrentView('home')} 
              onSubmit={handlePublish}
            />
          </div>
        )}
        {currentView === 'details' && renderDetails()}
      </main>

      {/* Floating Action Button for Mobile */}
      {currentView === 'home' && (
        <button 
          onClick={() => setCurrentView('sell')}
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl z-40 active:scale-90 transition-transform"
        >
          <i className="fas fa-camera"></i>
        </button>
      )}

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-green-600 p-1.5 rounded mr-2">
                <i className="fas fa-recycle text-white text-sm"></i>
              </div>
              <span className="text-xl font-bold text-slate-800">EcoSwap</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              La plateforme durable pour donner une seconde vie à vos articles préférés.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-4">Acheter</h4>
            <ul className="text-slate-500 text-sm space-y-2">
              <li>Comment ça marche</li>
              <li>Paiement sécurisé</li>
              <li>Protection acheteur</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-4">Vendre</h4>
            <ul className="text-slate-500 text-sm space-y-2">
              <li>Vendre sur EcoSwap</li>
              <li>Conseils photo IA</li>
              <li>Frais de vente</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-4">Aide</h4>
            <ul className="text-slate-500 text-sm space-y-2">
              <li>Centre d'assistance</li>
              <li>Confidentialité</li>
              <li>Conditions d'utilisation</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© 2024 EcoSwap. Tous droits réservés.</p>
          <div className="flex gap-6">
            <i className="fab fa-instagram text-slate-400 hover:text-green-600 cursor-pointer"></i>
            <i className="fab fa-facebook text-slate-400 hover:text-green-600 cursor-pointer"></i>
            <i className="fab fa-twitter text-slate-400 hover:text-green-600 cursor-pointer"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
