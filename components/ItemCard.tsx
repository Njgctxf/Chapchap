
import React from 'react';
import { Item } from '../types';

interface ItemCardProps {
  item: Item;
  onClick: (item: Item) => void;
  isFavorited: boolean;
  onToggleFavorite: (itemId: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick, isFavorited, onToggleFavorite }) => {
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const shareData = {
      title: `EcoSwap: ${item.title}`,
      text: `Regarde cet article sur EcoSwap : ${item.title} pour seulement ${item.price}€.`,
      url: window.location.href, // Since we don't have deep links, we share the current page
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('Lien copié dans le presse-papier !');
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Erreur lors du partage:', err);
      }
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1"
      onClick={() => onClick(item)}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-[1.08]"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevents navigating to details when clicking the heart
              onToggleFavorite(item.id);
            }}
            className={`backdrop-blur-sm p-2 rounded-full transition-all shadow-sm ${
              isFavorited 
                ? 'bg-rose-500 text-white' 
                : 'bg-white/80 text-slate-800 hover:bg-white'
            }`}
            title={isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <i className={`${isFavorited ? 'fas' : 'far'} fa-heart text-sm`}></i>
          </button>
          
          <button 
            onClick={handleShare}
            className="bg-white/80 backdrop-blur-sm p-2 rounded-full text-slate-800 hover:bg-white transition-all shadow-sm"
            title="Partager"
          >
            <i className="fas fa-share-nodes text-sm"></i>
          </button>
        </div>
        <div className="absolute bottom-2 left-2">
          <span className="bg-slate-900/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
            {item.condition}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-slate-800 line-clamp-1 group-hover:text-green-700 transition-colors">
            {item.title}
          </h3>
          <span className="font-bold text-lg text-slate-900 whitespace-nowrap ml-2">
            {item.price}€
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-3">{item.category}</p>
        
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <img 
            src={item.seller.avatar} 
            alt={item.seller.name} 
            className="w-5 h-5 rounded-full"
          />
          <span className="text-xs font-medium text-slate-600">{item.seller.name}</span>
          <div className="ml-auto flex items-center text-xs text-amber-500">
            <i className="fas fa-star mr-1"></i>
            <span>{item.seller.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
