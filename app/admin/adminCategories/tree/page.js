"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "../../../../lib/api";

export default function CategoryTreePage() {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTree() {
      try {
        const res = await adminAPI.getCategoryTree();
        setTree(res.data);
      } catch (error) {
        console.error("Error fetching tree:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTree();
  }, []);

  if (loading) return <p className="p-6">Loading category tree...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Category Hierarchy</h1>
      <CategoryList nodes={tree} />
    </div>
  );
}

function CategoryList({ nodes }) {
  return (
    <ul className="pl-4 border-l border-gray-300">
      {nodes.map((node) => (
        <li key={node.id} className="mb-2 relative">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
            <span className="font-medium">{node.name}</span>
          </div>

          {/* ✅ Use subcategories instead of children */}
          {node.subcategories && node.subcategories.length > 0 && (
            <CategoryList nodes={node.subcategories} />
          )}
        </li>
      ))}
    </ul>
  );
}
