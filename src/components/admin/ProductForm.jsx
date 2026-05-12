'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductForm({ initialData, productId }) {
  const router = useRouter();
  
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [category, setCategory] = useState(initialData?.category?._id || initialData?.category || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [basePrice, setBasePrice] = useState(initialData?.basePrice || '');
  const [originalPrice, setOriginalPrice] = useState(initialData?.originalPrice || '');
  const [color, setColor] = useState(initialData?.color || '');
  const [colorHex, setColorHex] = useState(initialData?.colorHex || '#000000');
  const [isActive, setIsActive] = useState(initialData?.isActive !== undefined ? initialData.isActive : true);
  const [tags, setTags] = useState(initialData?.tags ? initialData.tags.join(', ') : '');
  
  const [images, setImages] = useState(initialData?.images || []);
  const [removedImages, setRemovedImages] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  
  const [sizes, setSizes] = useState(() => {
    const sizeMap = {};
    if (initialData?.sizes) {
      initialData.sizes.forEach(s => {
        sizeMap[s.size] = s.stock;
      });
    }
    return SIZES.map(size => ({
      size,
      stock: sizeMap[size] || 0
    }));
  });
  
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  }

  function handleNameChange(value) {
    setName(value);
    if (!productId) {
      const autoSlug = value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      setSlug(autoSlug);
    }
  }

  function handleImageRemove(imageUrl) {
    setRemovedImages([...removedImages, imageUrl]);
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const uploadPromises = files.map(async (file, index) => {
      const fileId = `${Date.now()}-${index}`;
      setUploadingFiles(prev => [...prev, { id: fileId, name: file.name }]);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) {
          throw new Error('Upload failed');
        }

        const data = await res.json();
        
        setImages(prev => [...prev, {
          url: data.secure_url,
          order: prev.length + index
        }]);
      } catch (err) {
        setError(`Failed to upload ${file.name}`);
      } finally {
        setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
      }
    });

    await Promise.all(uploadPromises);
    e.target.value = '';
  }

  function handleSizeStockChange(size, stock) {
    setSizes(prev => prev.map(s => 
      s.size === size ? { ...s, stock: parseInt(stock) || 0 } : s
    ));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const finalImages = images
        .filter(img => !removedImages.includes(img.url))
        .map((img, index) => ({ ...img, order: index }));

      const tagsArray = tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const payload = {
        name,
        slug,
        category,
        description,
        basePrice: parseFloat(basePrice),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        color,
        colorHex,
        images: finalImages,
        isActive,
        tags: tagsArray,
        sizes: sizes.map(s => ({ size: s.size, stock: s.stock }))
      };

      const url = productId 
        ? `/api/admin/products/${productId}`
        : '/api/admin/products';
      
      const method = productId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      router.push('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const displayImages = images.filter(img => !removedImages.includes(img.url));

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        {productId ? 'Edit Product' : 'Create Product'}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            className="w-full px-3 py-2 border border-[#3a3a3a] rounded-md focus:outline-none focus:border-[#DEFC3E]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full px-3 py-2 border border-[#3a3a3a] rounded-md focus:outline-none focus:border-[#DEFC3E]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            disabled={loadingCategories}
            className="w-full px-3 py-2 bg-[#282828] text-[#E9E9E9] border border-[#3a3a3a] rounded-md focus:outline-none focus:border-[#DEFC3E]"
            style={{
              colorScheme: 'dark'
            }}
          >
            <option value="">
              {loadingCategories ? 'Loading categories...' : 'Select a category'}
            </option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-[#3a3a3a] rounded-md focus:outline-none focus:border-[#DEFC3E]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Base Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              min="0"
              step="0.01"
              required
              className="w-full px-3 py-2 border border-[#3a3a3a] rounded-md focus:outline-none focus:border-[#DEFC3E]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Original Price
            </label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-[#3a3a3a] rounded-md focus:outline-none focus:border-[#DEFC3E]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Color Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
              className="w-full px-3 py-2 border border-[#3a3a3a] rounded-md focus:outline-none focus:border-[#DEFC3E]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Color Hex <span className="text-red-500">*</span>
            </label>
            <input
              type="color"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              required
              className="w-full h-10 px-1 py-1 border border-[#3a3a3a] rounded-md focus:outline-none focus:border-[#DEFC3E]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tag1, tag2, tag3"
            className="w-full px-3 py-2 border border-[#3a3a3a] rounded-md focus:outline-none focus:border-[#DEFC3E]"
          />
          <p className="text-xs text-gray-500 mt-1">Comma-separated values</p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 text-[#DEFC3E] border-[#3a3a3a] rounded focus:ring-[#DEFC3E]"
          />
          <label htmlFor="isActive" className="ml-2 text-sm font-medium">
            Is Active
          </label>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-4">Images</h2>

        {displayImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {displayImages
              .sort((a, b) => a.order - b.order)
              .map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img.url}
                    alt=""
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(img.url)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border border-[#3a3a3a] rounded-md focus:outline-none focus:border-[#DEFC3E]"
          />
        </div>

        {uploadingFiles.length > 0 && (
          <div className="mt-2 space-y-1">
            {uploadingFiles.map(file => (
              <div key={file.id} className="text-sm text-gray-600 flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                Uploading {file.name}...
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-4">Sizes & Stock</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-black">
                <th className="border border-[#3a3a3a] px-4 py-2 text-left text-[#E9E9E9]">Size</th>
                <th className="border border-[#3a3a3a] px-4 py-2 text-left text-[#E9E9E9]">Stock</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map(sizeEntry => (
                <tr key={sizeEntry.size}>
                  <td className="border border-[#3a3a3a] px-4 py-2 font-medium">
                    {sizeEntry.size}
                  </td>
                  <td className="border border-[#3a3a3a] px-4 py-2">
                    <input
                      type="number"
                      value={sizeEntry.stock}
                      onChange={(e) => handleSizeStockChange(sizeEntry.size, e.target.value)}
                      min="0"
                      className="w-full px-2 py-1 border border-[#3a3a3a] rounded focus:outline-none focus:border-[#DEFC3E]"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-4 pt-6 border-t">
        <button
          type="submit"
          disabled={submitting || loadingCategories}
          className="px-6 py-2 bg-[#DEFC3E] text-black font-bold rounded-md hover:bg-[#d4e838] disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving...' : productId ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-6 py-2 bg-black text-red-600 font-semibold rounded-md hover:bg-[#1a1a1a] border border-red-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
