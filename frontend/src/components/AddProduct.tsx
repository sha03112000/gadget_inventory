import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  useCreateProductMutation,
  useGetCategoriesQuery,
} from '../store/slices/apiSlice';
import { Progress } from './ui/progress';

type AddProductProps = {
  onCancel: () => void;
};

type Category = {
  _id: number | string;
  name: string;
};

type FormState = {
  name: string;
  categoryId: string;
  color: string;
  ram: string;
  storage: string;
  price: string;
  stock: string;
};

export function AddProduct({ onCancel }: AddProductProps) {
  const { data, isLoading, isError } = useGetCategoriesQuery(undefined);
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  const categories: Category[] = data?.categories || [];

  const [formData, setFormData] = useState<FormState>({
    name: '',
    categoryId: '',
    color: '',
    ram: '',
    storage: '',
    price: '',
    stock: '',
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updateField = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file); // for upload

    // preview (can also use URL.createObjectURL)
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview((reader.result as string) || '');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formToSend = new FormData();
    formToSend.append('name', formData.name);
    formToSend.append('category', formData.categoryId);
    formToSend.append('color', formData.color);
    formToSend.append('ram', formData.ram);
    formToSend.append('storage', formData.storage);
    formToSend.append('price', formData.price);
    formToSend.append('stock', formData.stock);

    if (imageFile) {
      formToSend.append('image', imageFile); // append image file
    }

    try {
      const confirmed = window.confirm('Add this product?');
      if (!confirmed) return;

      await createProduct(formToSend).unwrap();
      alert('Product added!');
      onCancel();
    } catch (err: any) {
      console.error('PRODUCT ADD ERROR:', err);

      const message =
        err?.data?.error?.join?.('\n') ||
        err?.data?.message ||
        'Something went wrong';

      alert(message);
    }
  };

  if (isLoading) return <p>Loading categories...</p>;
  if (isError) return <p>Failed to load categories.</p>;

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1>Add New Product</h1>
      </div>

      {isCreating && (
        <div className="px-4 pt-2">
          <Progress value={50} />
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Product Image</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center space-y-3 bg-gray-50 ">
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="mt-2"
            />

            {!imagePreview && (
              <div className="space-y-3">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600">Click to upload image</p>
                  <p className="text-gray-400">or drag and drop</p>
                </div>
              </div>
            )}

            {/* IMAGE PREVIEW */}
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg shadow"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('');
                    setImageFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center transition"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter product name"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
            className="rounded-lg"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => updateField('categoryId', value)}
          >
            <SelectTrigger className="rounded-lg">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color */}
        <div className="space-y-2">
          <Label htmlFor="color">Color *</Label>
          <Input
            id="color"
            type="text"
            placeholder="Enter color"
            value={formData.color}
            onChange={(e) => updateField('color', e.target.value)}
            required
            className="rounded-lg"
          />
        </div>

        {/* RAM and Storage */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ram">RAM</Label>
            <Input
              id="ram"
              type="text"
              placeholder="e.g. 8GB"
              value={formData.ram}
              onChange={(e) => updateField('ram', e.target.value)}
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storage">Storage</Label>
            <Input
              id="storage"
              type="text"
              placeholder="e.g. 256GB"
              value={formData.storage}
              onChange={(e) => updateField('storage', e.target.value)}
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price ($) *</Label>
            <Input
              id="price"
              type="number"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => updateField('price', e.target.value)}
              required
              step="0.01"
              min="0"
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock *</Label>
            <Input
              id="stock"
              type="number"
              placeholder="0"
              value={formData.stock}
              onChange={(e) => updateField('stock', e.target.value)}
              required
              min="0"
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Save Button */}
        <Button
          type="submit"
          className="w-full rounded-full bg-blue-600 hover:bg-blue-700"
          disabled={isCreating}
        >
          {isCreating ? 'Saving…' : 'Save Product'}
        </Button>
      </form>
    </div>
  );
}
