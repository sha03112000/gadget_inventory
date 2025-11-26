import { useEffect, useState } from 'react';
import { Search, ScanLine } from 'lucide-react';
import { Input } from './ui/input';
import { useGetCategoriesQuery } from "../store/slices/apiSlice"
import { Button } from './ui/button';
import { CategoryCard } from './CategoryCard';
import { Progress } from './ui/progress';

type CategoryPageProps = {
  _id: string;
  name: string;

  description?: string;
  createdAt?: string;
  updatedAt?: string;
 
};

type CategoryPageComponentProps = {
  onAddCategory: () => void;
  onEditCategory: (category: CategoryPageProps) => void;
  onDeleteCategory: (category: CategoryPageProps) => void;

};



export function CategoryPage({ onAddCategory, onEditCategory, onDeleteCategory }: CategoryPageComponentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, isError } = useGetCategoriesQuery(undefined);
  
  const [categories, setCategories] = useState<CategoryPageProps[]>([]);
  

  // Filter categories based on searchQuery
  const filteredProducts = categories.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (data) {
      setCategories(data?.categories || []);
    }
    console.log("CATEGORIES DATA:", data);
  }, [data]);

  if (isLoading) return <Progress value={50} />;

  if (isError) {
    return (
      <section className="py-16 text-center text-red-600">
        <p>Failed to load categories. Please try again later.</p>
      </section>
    );
  }

  

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search categories..."
              className="pl-10 rounded-full border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button size="icon" variant="outline" className="rounded-full w-10 h-10 flex-shrink-0">
            <ScanLine className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 p-4 text-center">
        <Button
          size="default"
          variant="default"
          className="rounded-full w-full cursor-pointer"
          onClick={onAddCategory}
        >
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2>Categories</h2>
          <span className="text-gray-500">{filteredProducts.length} items</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((category: CategoryPageProps) => (
            <CategoryCard
              key={category._id}
              category={category}
              onClick={() => onEditCategory(category)}  
              onDelete={() => onDeleteCategory(category)}
              
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No categories found</p>
          </div>
        )}
      </div>
    </div>
  );
}
