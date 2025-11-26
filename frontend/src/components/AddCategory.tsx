import { useState } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useCreateCategoryMutation, useEditCategoryMutation } from "../store/slices/apiSlice"
import { Progress } from './ui/progress';


type AddCategoryProps = {
  onBack: () => void;
  onDelete?: () => void;

  initialData?: { _id?: string; name: string; description: string };
  mode?: "add" | "edit";
};

export function AddCategory({
  onBack,
  initialData,
  mode = "add",
}: AddCategoryProps) {

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
  });

  const [createCategory, { isLoading: creating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] =
    useEditCategoryMutation();

  const isLoading = creating || updating;

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmed = window.confirm(
      mode === "add" ? "Add this category?" : "Update this category?"
    );
    if (!confirmed) return;

    try {
      if (mode === "add") {
        
        await createCategory(formData).unwrap();
        alert("Category added!");
      } else {
        console.log("FORM DATA:", formData);
        await updateCategory({
          
          id: initialData?._id,
          ...formData,
        }).unwrap();
        alert("Category updated!");
      }

      onBack();
    } catch (err: any) {
      console.error("CATEGORY ERROR:", err);

      const message =
        err?.data?.error?.join?.("\n") ||
        err?.data?.message ||
        "Something went wrong";

      alert(message);
    }
  };


  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1>{mode === "add" ? "Add Category" : "Edit Category"}</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Category Name *</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter category name"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
            className="rounded-lg"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            type="text"
            placeholder="Enter description"
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="rounded-lg"

          />
        </div>

        {/* Progress Bar */}
        {isLoading && (
          <Progress
            value={70}
            className="w-full h-2 mb-2 transition-all duration-300"
          />
        )}

        {/* Save Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading
            ? mode === "add"
              ? "Saving..."
              : "Updating..."
            : mode === "add"
              ? "Save Category"
              : "Update Category"}
        </Button>
      </form>
    </div>
  );
}
