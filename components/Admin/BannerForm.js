"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { getImageUrl, handleImageError } from "utils/imageUtils";

const BannerForm = ({ onSubmit, initialData, isEditing, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  // ✅ Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    if (subtitle) formData.append("subtitle", subtitle);
    if (description) formData.append("description", description);
    if (file) formData.append("file", file);

    onSubmit(formData);

    // Reset file input
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ✅ Reset when editing or switching mode
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSubtitle(initialData.subtitle || "");
      setDescription(initialData.description || "");
      setFile(null);
    } else {
      setTitle("");
      setSubtitle("");
      setDescription("");
      setFile(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [initialData]);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-4 w-full max-w-2xl mx-auto"
    >
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full border rounded-md px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Enter banner title"
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Subtitle
        </label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="mt-1 block w-full border rounded-md px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Optional subtitle"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border rounded-md px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none"
          rows={3}
          placeholder="Add a short banner description"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Banner Image
        </label>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files[0])}
          className="mt-2 block w-full text-sm text-gray-600"
        />

        {/* Image Preview */}
        <div className="mt-3 flex justify-center sm:justify-start">
          {initialData?.image && !file && (
            <div className="relative w-full sm:w-80 h-40 sm:h-48 rounded-md overflow-hidden border">
              <Image
                src={getImageUrl(initialData.image)}
                alt="Current banner"
                fill
                className="object-cover"
                onError={handleImageError}
              />
            </div>
          )}
        </div>

        {file && (
          <p className="text-sm text-gray-500 mt-2 break-all">
            New file selected: {file.name}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto"
        >
          {isEditing ? "Update Banner" : "Create Banner"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-sm sm:text-base w-full sm:w-auto"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default BannerForm;
