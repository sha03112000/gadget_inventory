import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/imageWithFallback';
import { useEffect } from "react";


type DeleteConfirmationProps = {
  mode: "product" | "category";
  item: {
    _id: string;
    name: string;
    image?: string;
    category?: string;
    color?: string;
    ram?: string;
    storage?: string;
    price?: number;
    stock?: number;
    createdAt?: string;
    updatedAt?: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeleteConfirmation({ mode, item, onConfirm, onCancel }: DeleteConfirmationProps) {

 //If refreshed or item missing, safely auto-redirect OUTSIDE render
  useEffect(() => {
    if (!item) {
      onCancel();
    }
  }, [item, onCancel]);

  // If no item → render nothing while redirecting
  if (!item) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-6 shadow-lg">
        {/* Warning Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        {/* Product Info */}
        <div className="text-center space-y-3">
          {mode === "product" && (
            <div className="w-32 h-32 mx-auto rounded-xl overflow-hidden bg-gray-50">
              <ImageWithFallback 
                src={item.image ?? ""}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h2>{item.name}</h2>
        </div>

        {/* Warning Message */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-red-800 text-center">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={onConfirm}
            className="w-full rounded-full bg-red-600 hover:bg-red-700"
          >
            {mode === "product" ? "Delete Product" : "Delete Category"}
          </Button>
          
          <Button 
            onClick={onCancel}
            variant="outline"
            className="w-full rounded-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
