import { ImageWithFallback } from './figma/imageWithFallback';
import type { Product } from '../App';

type ProductCardProps = {
  product: Product;
  onClick: () => void;
};

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        <ImageWithFallback 
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-3 space-y-1">
        <h3 className="text-gray-900 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
        
        <div className="space-y-1">
          <p className="text-gray-500">{product.color}</p>
          
          {product.ram !== '-' && (
            <p className="text-gray-500">{product.ram} | {product.storage}</p>
          )}
          
          <div className="flex items-center justify-between pt-1">
            <p className="text-blue-600">${product.price}</p>
            <p className="text-gray-400">Stock: {product.stock}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
