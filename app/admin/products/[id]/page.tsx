'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DbProduct } from '@/lib/supabase';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<DbProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/products`)
      .then(r => r.json())
      .then((data: DbProduct[]) => {
        const found = data.find(p => p.id === id) ?? null;
        setProduct(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="font-sans text-sm text-gray-400 p-8">Loading product...</div>;
  if (!product) return <div className="font-sans text-sm text-red-500 p-8">Product not found.</div>;

  return <ProductForm mode="edit" product={product} />;
}
