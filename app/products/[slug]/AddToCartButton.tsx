'use client';
import { useState } from 'react';
import { Product, ColorVariant } from '@/types';
import { useCart } from '@/lib/cart-context';

export default function AddToCartButton({ product }: { product: Product }) {
  const { dispatch } = useCart();
  const [added,         setAdded]         = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colorVariants?.length > 0 ? product.colorVariants[0].name : undefined
  );
  const [activeImgIdx,  setActiveImgIdx]  = useState(0);

  const activeVariant = product.colorVariants?.find(v => v.name === selectedColor);
  const displayImages = (activeVariant?.images?.length ? activeVariant.images : product.images) ?? product.images;

  const handleAdd = () => {
    dispatch({ type: 'ADD', product, color: selectedColor });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Image thumbnails for selected color */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {displayImages.slice(0, 6).map((img, i) => (
            <button
              key={img}
              onClick={() => setActiveImgIdx(i)}
              className={`w-14 h-14 border-2 overflow-hidden transition-colors flex-shrink-0 ${activeImgIdx === i ? 'border-gold-400' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Color swatches */}
      {product.colorVariants?.length > 0 && (
        <div>
          <p className="font-sans text-[10px] uppercase tracking-widest text-gray-400 mb-3">
            Color: <strong className="text-gray-700">{selectedColor}</strong>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colorVariants.map(v => (
              <button
                key={v.name}
                onClick={() => { setSelectedColor(v.name); setActiveImgIdx(0); }}
                title={v.name}
                className={`flex items-center gap-2 border-2 px-3 py-2 transition-all font-sans text-xs
                  ${selectedColor === v.name ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'}`}
              >
                <span className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0" style={{ background: v.hex }} />
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add to cart */}
      {!product.inStock ? (
        <button disabled className="w-full py-4 bg-gray-100 text-gray-400 font-sans text-xs tracking-widest uppercase cursor-not-allowed">
          Out of Stock
        </button>
      ) : (
        <button onClick={handleAdd}
          className={`w-full py-4 font-sans text-sm tracking-widest uppercase font-bold transition-all duration-300
            ${added ? 'bg-green-600 text-white' : 'btn-primary'}`}>
          {added ? '✓ Added to Bag' : 'Add to Bag'}
        </button>
      )}

      {selectedColor && (
        <p className="font-sans text-xs text-gray-400 text-center">
          Selected: {selectedColor}
        </p>
      )}
    </div>
  );
}
