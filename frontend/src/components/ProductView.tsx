import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/imageWithFallback';
import type { Product } from '../App';

type ProductViewProps = {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
};

export function ProductView({ product, onEdit, onDelete, onBack }: ProductViewProps) {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1>Product Details</h1>
      </div>

      {/* Product Image */}
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        <ImageWithFallback 
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="p-6 space-y-6">
        <div>
          <h1 className="mb-2">{product.name}</h1>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">{product.category?.name}</span>
            {product.stock > 0 ? (
              <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full">In Stock</span>
            ) : (
              <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full">Out of Stock</span>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-500 mb-1">Color</p>
            <p className="text-gray-900">{product.color}</p>
          </div>

          {product.ram  && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-500 mb-1">RAM</p>
              <p className="text-gray-900">{product.ram}</p>
            </div>
          )}

          {product.storage  && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-500 mb-1">Storage</p>
              <p className="text-gray-900">{product.storage}</p>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-500 mb-1">Price</p>
            <p className="text-blue-600">${product.price.toFixed(2)}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-500 mb-1">Available Stock</p>
            <p className="text-gray-900">{product.stock} units</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button 
            onClick={onEdit}
            className="w-full rounded-full bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Product
          </Button>
          
          <Button 
            onClick={onDelete}
            variant="outline"
            className="w-full rounded-full border-red-200 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Product
          </Button>
        </div>
      </div>
    </div>
  );
}
