'use client';
import { useState } from 'react';

export default function HeirSelector({ heirs, selectedHeirs, onHeirToggle, onQuantityChange }) {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = heirs.reduce((acc, heir) => {
    const category = heir.category || 'Lainnya';
    if (!acc[category]) acc[category] = [];
    acc[category].push(heir);
    return acc;
  }, {});

  const isSelected = (heirId) => selectedHeirs.some(h => h.key === heirId);
  const getQuantity = (heirId) => selectedHeirs.find(h => h.key === heirId)?.quantity || 1;
  const getDisplayHeirs = () => activeCategory === 'all' ? heirs : categories[activeCategory] || [];
  
  // Urutkan kategori
  const orderedCategories = ['Suami/Istri', 'Orang Tua', 'Keturunan', 'Saudara', 'Keponakan', 'Paman', 'Sepupu', 'Wala'];
  
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Category Filter */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Kategori</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setActiveCategory('all')} 
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeCategory === 'all' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
            }`}
          >
            Semua Ahli Waris
          </button>
          {orderedCategories.filter(cat => categories[cat]).map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)} 
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeCategory === cat 
                  ? 'bg-green-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      {/* Heirs Grid */}
      <div className="p-6">
        {activeCategory === 'all' ? (
          // Tampilkan per kategori dengan pemisah
          <div className="space-y-8">
            {orderedCategories.filter(cat => categories[cat]).map((category, catIndex) => (
              <div key={category}>
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-gray-800 mb-1">{category}</h4>
                  <div className="h-1 w-16 bg-green-600 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {categories[category].map(heir => {
                    const selected = isSelected(heir.key);
                    const quantity = getQuantity(heir.key);
                    const canAdjustQuantity = selected && 
                      heir.nama_id !== 'Suami' && 
                      heir.nama_id !== 'Ayah' && 
                      heir.nama_id !== 'Ibu' && 
                      heir.nama_id !== 'Kakek';
                    
                    return (
                      <div 
                        key={heir.key} 
                        onClick={() => onHeirToggle(heir)} 
                        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${
                          selected 
                            ? 'border-green-500 bg-green-50 shadow-md' 
                            : 'border-gray-200 hover:border-green-300 bg-white'
                        }`}
                      >
                        {selected && (
                          <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full shadow-md">
                            ✓
                          </div>
                        )}
                        <div className="text-center">
                          <div className="font-bold text-gray-800 mb-1">{heir.nama_id}</div>
                          <div className="text-sm text-gray-600 font-arabic">{heir.nama_ar}</div>
                        </div>
                        {canAdjustQuantity && (
                          <div 
                            className="mt-4 flex items-center justify-center gap-2" 
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button 
                              onClick={() => onQuantityChange(heir.key, Math.max(1, quantity - 1))} 
                              className="w-8 h-8 bg-white border-2 border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all font-bold"
                            >
                              −
                            </button>
                            <span className="w-10 text-center font-bold text-green-700">{quantity}</span>
                            <button 
                              onClick={() => onQuantityChange(heir.key, quantity + 1)} 
                              className="w-8 h-8 bg-white border-2 border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all font-bold"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {catIndex < orderedCategories.filter(cat => categories[cat]).length - 1 && (
                  <div className="mt-8 border-b border-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Tampilkan kategori yang dipilih
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {getDisplayHeirs().map(heir => {
              const selected = isSelected(heir.key);
              const quantity = getQuantity(heir.key);
              const canAdjustQuantity = selected && 
                heir.nama_id !== 'Suami' && 
                heir.nama_id !== 'Ayah' && 
                heir.nama_id !== 'Ibu' && 
                heir.nama_id !== 'Kakek';
              
              return (
                <div 
                  key={heir.key} 
                  onClick={() => onHeirToggle(heir)} 
                  className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${
                    selected 
                      ? 'border-green-500 bg-green-50 shadow-md' 
                      : 'border-gray-200 hover:border-green-300 bg-white'
                  }`}
                >
                  {selected && (
                    <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full shadow-md">
                      ✓
                    </div>
                  )}
                  <div className="text-center">
                    <div className="font-bold text-gray-800 mb-1">{heir.nama_id}</div>
                    <div className="text-sm text-gray-600 font-arabic">{heir.nama_ar}</div>
                  </div>
                  {canAdjustQuantity && (
                    <div 
                      className="mt-4 flex items-center justify-center gap-2" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button 
                        onClick={() => onQuantityChange(heir.key, Math.max(1, quantity - 1))} 
                        className="w-8 h-8 bg-white border-2 border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all font-bold"
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-bold text-green-700">{quantity}</span>
                      <button 
                        onClick={() => onQuantityChange(heir.key, quantity + 1)} 
                        className="w-8 h-8 bg-white border-2 border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all font-bold"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Summary */}
      {selectedHeirs.length > 0 && (
        <div className="px-6 pb-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h4 className="font-bold text-green-900">Ahli Waris Terpilih ({selectedHeirs.length})</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedHeirs.map(heir => (
                <span 
                  key={heir.key} 
                  className="px-3 py-1 bg-white border border-green-300 text-green-800 rounded-full text-sm font-medium shadow-sm"
                >
                  {heir.nama_id} {heir.quantity > 1 ? `(×${heir.quantity})` : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}