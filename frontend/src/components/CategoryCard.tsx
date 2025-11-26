import { Trash2 } from "lucide-react";
type CategoryCardProps = {
  category: {
    _id: string;
    name: string;
    description?: string;
  };
  onClick: (category: any) => void;
  onDelete: (category: any) => void;
};

export function CategoryCard({ category, onClick, onDelete }: CategoryCardProps) {
  return (
    <div className="relative">
      {/* Delete icon */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(category);
        }}
        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4 text-red-600" />
      </button>

      {/* Card body */}
      <div
        onClick={() => onClick(category)}
        className="p-4 rounded-xl border bg-white shadow-sm cursor-pointer"
      >
        <h3 className="font-medium">{category.name}</h3>
        {category.description && (
          <p className="text-xs text-gray-500 mt-1">
            {category.description}
          </p>
        )}
      </div>
    </div>
  );
}
