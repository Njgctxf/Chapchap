
import React, { useState, useRef, useEffect } from 'react';
import { ItemCondition } from '../types';
import { CATEGORIES, DETAILED_CATEGORIES } from '../constants';
import { analyzeItemImage, refineDescription } from '../services/geminiService';

interface ListingFormProps {
  onCancel: () => void;
  onSubmit: (itemData: any) => void;
}

const ListingForm: React.FC<ListingFormProps> = ({ onCancel, onSubmit }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [refining, setRefining] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Split category selection state
  const [mainCat, setMainCat] = useState<string>(CATEGORIES[0]);
  const [subCat, setSubCat] = useState<string>('');
  const [specificType, setSpecificType] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: ItemCondition.GOOD,
  });

  // Handle cascading category reset
  useEffect(() => {
    const subCategories = Object.keys(DETAILED_CATEGORIES[mainCat] || {});
    if (subCategories.length > 0) {
      setSubCat(subCategories[0]);
    } else {
      setSubCat('');
      setSpecificType('');
    }
  }, [mainCat]);

  useEffect(() => {
    if (mainCat && subCat) {
      const types = DETAILED_CATEGORIES[mainCat][subCat] || [];
      if (types.length > 0) {
        setSpecificType(types[0]);
      } else {
        setSpecificType('');
      }
    }
  }, [subCat, mainCat]);

  // Simulated progress logic for AI analysis
  useEffect(() => {
    let interval: number | undefined;
    if (analyzing) {
      setAnalysisProgress(0);
      interval = window.setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev < 30) {
            setAnalysisStatus("Lecture de l'image...");
            return prev + 2;
          }
          if (prev < 60) {
            setAnalysisStatus("Identification de l'objet...");
            return prev + 1;
          }
          if (prev < 90) {
            setAnalysisStatus("Génération des suggestions...");
            return prev + 0.5;
          }
          setAnalysisStatus("Finalisation...");
          return prev;
        });
      }, 100);
    } else {
      setAnalysisProgress(0);
      setAnalysisStatus('');
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [analyzing]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setImage(base64);
        
        setAnalyzing(true);
        try {
          const suggestions = await analyzeItemImage(base64);
          setAnalysisProgress(100);
          setAnalysisStatus("Analyse terminée !");
          
          if (suggestions) {
            setTimeout(() => {
              setFormData(prev => ({
                ...prev,
                title: suggestions.suggestedTitle,
                description: suggestions.suggestedDescription,
                price: suggestions.suggestedPrice.toString(),
              }));
              
              // Try to map AI category to main category
              if (CATEGORIES.includes(suggestions.suggestedCategory)) {
                setMainCat(suggestions.suggestedCategory);
              }
              
              setAnalyzing(false);
            }, 500);
          } else {
            setAnalyzing(false);
          }
        } catch (error) {
          console.error(error);
          setAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRefine = async () => {
    if (!formData.title) return;
    setRefining(true);
    // Combine selected categories for context
    const fullCategory = `${mainCat} > ${subCat}${specificType ? ' > ' + specificType : ''}`;
    const text = await refineDescription(formData.title, fullCategory);
    if (text) {
      setFormData(prev => ({ ...prev, description: text }));
    }
    setRefining(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !formData.title || !formData.price) return;
    
    // Store the most specific category for filtering
    const finalCategory = specificType || subCat || mainCat;
    
    onSubmit({
      ...formData,
      category: finalCategory,
      price: parseFloat(formData.price),
      imageUrl: image
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 max-w-4xl mx-auto overflow-hidden">
      <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Vendre un article</h2>
        <button onClick={onCancel} className="text-white hover:bg-white/10 p-1 rounded-full">
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Image Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Photo de l'article</label>
          <div 
            onClick={() => !analyzing && fileInputRef.current?.click()}
            className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
              image ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-green-500 bg-slate-50'
            } ${analyzing ? 'cursor-wait opacity-80' : 'cursor-pointer'} relative overflow-hidden group`}
          >
            {image ? (
              <>
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                {!analyzing && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white font-medium">Changer la photo</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                  <i className="fas fa-camera text-slate-400 text-2xl"></i>
                </div>
                <p className="text-slate-500 font-medium text-sm">Cliquez pour ajouter une photo</p>
                <p className="text-slate-400 text-xs mt-1">L'IA détectera automatiquement les détails</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
              disabled={analyzing}
            />
          </div>

          {analyzing && (
            <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <i className="fas fa-magic text-green-600"></i>
                  {analysisStatus}
                </span>
                <span className="text-xs font-bold text-green-600">{Math.round(analysisProgress)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(22,163,74,0.4)]"
                  style={{ width: `${analysisProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Titre de l'annonce</label>
            <input
              type="text"
              required
              className="w-full rounded-lg border-slate-200 focus:ring-green-500 focus:border-green-500 p-2.5 border transition-colors"
              placeholder="Ex: Sneakers Nike Air Max..."
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              disabled={analyzing}
            />
          </div>

          {/* Detailed Category Selection */}
          <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Catégorie Vinted</label>
            <div className="grid grid-cols-1 gap-3">
              <select
                className="w-full rounded-lg border-slate-200 focus:ring-green-500 focus:border-green-500 p-2 border bg-white text-sm"
                value={mainCat}
                onChange={(e) => setMainCat(e.target.value)}
                disabled={analyzing}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>

              {mainCat && DETAILED_CATEGORIES[mainCat] && (
                <select
                  className="w-full rounded-lg border-slate-200 focus:ring-green-500 focus:border-green-500 p-2 border bg-white text-sm animate-in slide-in-from-top-1"
                  value={subCat}
                  onChange={(e) => setSubCat(e.target.value)}
                  disabled={analyzing}
                >
                  {Object.keys(DETAILED_CATEGORIES[mainCat]).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              )}

              {subCat && DETAILED_CATEGORIES[mainCat][subCat] && DETAILED_CATEGORIES[mainCat][subCat].length > 0 && (
                <select
                  className="w-full rounded-lg border-slate-200 focus:ring-green-500 focus:border-green-500 p-2 border bg-white text-sm animate-in slide-in-from-top-1"
                  value={specificType}
                  onChange={(e) => setSpecificType(e.target.value)}
                  disabled={analyzing}
                >
                  {DETAILED_CATEGORIES[mainCat][subCat].map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Prix (€)</label>
              <input
                type="number"
                required
                className="w-full rounded-lg border-slate-200 focus:ring-green-500 focus:border-green-500 p-2.5 border transition-colors"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                disabled={analyzing}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">État</label>
              <select
                className="w-full rounded-lg border-slate-200 focus:ring-green-500 focus:border-green-500 p-2.5 border transition-colors"
                value={formData.condition}
                onChange={(e) => setFormData({...formData, condition: e.target.value as any})}
                disabled={analyzing}
              >
                {Object.values(ItemCondition).map(cond => <option key={cond} value={cond}>{cond}</option>)}
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-semibold text-slate-700">Description</label>
              <button 
                type="button"
                onClick={handleRefine}
                disabled={refining || !formData.title || analyzing}
                className="text-xs text-green-600 font-medium hover:underline flex items-center gap-1 disabled:opacity-50"
              >
                {refining ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                Améliorer avec l'IA
              </button>
            </div>
            <textarea
              rows={3}
              className="w-full rounded-lg border-slate-200 focus:ring-green-500 focus:border-green-500 p-2.5 border text-sm transition-colors"
              placeholder="Décrivez votre article en détail..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              disabled={analyzing}
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!image || analyzing}
              className="flex-2 px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              Publier
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ListingForm;
