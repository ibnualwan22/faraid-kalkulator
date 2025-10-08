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
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
        <button onClick={() => setActiveCategory('all')} className={`px-4 py-2 text-sm rounded-lg transition-colors ${activeCategory === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          Semua
        </button>
        {Object.keys(categories).map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 text-sm rounded-lg transition-colors ${activeCategory === cat ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {cat}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {getDisplayHeirs().map(heir => {
          const selected = isSelected(heir.key);
          const quantity = getQuantity(heir.key);
          
          return (
            <div key={heir.key} onClick={() => onHeirToggle(heir)} className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${selected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
              {selected && <div className="absolute top-2 right-2 bg-green-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">✓</div>}
              <div className="text-center">
                <div className="font-bold text-gray-800">{heir.nama_id}</div>
                <div className="text-sm text-gray-600 font-arabic">{heir.nama_ar}</div>
              </div>
              {selected && heir.nama_id !== 'Suami' && heir.nama_id !== 'Ayah' && heir.nama_id !== 'Ibu' && heir.nama_id !== 'Kakek' && (
                <div className="mt-3 flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => onQuantityChange(heir.key, Math.max(1, quantity - 1))} className="w-7 h-7 bg-gray-200 rounded-full hover:bg-gray-300">-</button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <button onClick={() => onQuantityChange(heir.key, quantity + 1)} className="w-7 h-7 bg-gray-200 rounded-full hover:bg-gray-300">+</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}