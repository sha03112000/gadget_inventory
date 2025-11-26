import { useState } from 'react';
import { Search, ScanLine } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { ProductCard } from './ProductCard';
import type { Product } from '../App';
import { useGetCategoriesQuery } from '../store/slices/apiSlice';



type HomePageProps = {
  products: Product[];
  onViewProduct: (product: Product) => void;
  showAll?: boolean;
  onAddProduct?: () => void;
};


type Category = {
  _id: number | string;
  name: string;
};

export function HomePage({ products, onAddProduct, onViewProduct, showAll }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const displayedProducts = showAll ? filteredProducts : filteredProducts.slice(0, 6);

  const { data, isLoading, isError } = useGetCategoriesQuery(undefined);

  if (isLoading) return <p>Loading categories...</p>;
  if (isError) return <p>Failed to load categories.</p>;

  const categories = data?.categories || [];


  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10 rounded-full border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full w-10 h-10 flex-shrink-0"
          >
            <ScanLine className="w-5 h-5" />
          </Button>
        </div>

        <div className="bg-white border-b border-gray-100 mt-2 text-center">
          <Button
            size="default"
            variant="default"
            className="rounded-full w-full cursor-pointer"
            onClick={onAddProduct}
          >
            Add Product
          </Button>
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="rounded-full border-gray-200">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
             <SelectItem value="All Categories">All Categories</SelectItem>
            {categories.map((category: Category) => (
              <SelectItem key={category._id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2>{showAll ? 'All Products' : 'Featured Products'}</h2>
          <span className="text-gray-500">{filteredProducts.length} items</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {displayedProducts.map((p: Product) => (
            <ProductCard
              key={p._id}
              product={p}
              onClick={() => onViewProduct(p)}

            />
          ))}
        </div>

        {!showAll && filteredProducts.length > 6 && (
          <div className="mt-4 text-center">
            <p className="text-gray-500">View all products from the bottom navigation</p>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
