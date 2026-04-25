'use client';
import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DbProduct } from '@/lib/supabase';
import { ColorVariant } from '@/types';

const CATEGORIES  = ['Necklaces', 'Earrings', 'Bangles', 'Maang Tikka', 'Bridal Sets'] as const;
const BADGES      = ['', 'Bestseller', 'New', 'Premium', 'Sale'] as const;
const OCCASIONS   = ['Wedding', 'Festival', 'Everyday', 'Office', 'Party'];
const METAL_TYPES = ['22K Gold Plated', '18K Gold Plated', 'Oxidised Silver', 'Antique Gold', 'Rose Gold Plated', 'Sterling Silver'];
const GEMSTONES   = ['Kundan', 'Polki', 'Meenakari', 'CZ / American Diamond', 'Emerald', 'Ruby', 'Pearl', 'None'];

const PRESET_COLORS = [
  { name: 'Gold',        hex: '#d4a017' },
  { name: 'Rose Gold',   hex: '#b76e79' },
  { name: 'Silver',      hex: '#a8a9ad' },
  { name: 'Antique Gold',hex: '#9a7b4f' },
  { name: 'Oxidised',    hex: '#4a4a4a' },
  { name: 'White Gold',  hex: '#e8e8e8' },
];

type FormData = {
  name: string; slug: string; price: string; original_price: string;
  category: string; material: string; description: string; details: string;
  images: string[]; color_variants: ColorVariant[];
  badge: string; in_stock: boolean; sku: string; weight: string;
  status: 'draft' | 'published';
  occasion: string[]; metal_type: string; gemstone: string; collection_name: string;
};

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function ProductForm({ product, mode }: { product?: DbProduct; mode: 'create' | 'edit' }) {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    name:             product?.name             ?? '',
    slug:             product?.slug             ?? '',
    price:            product ? String(product.price / 100) : '',
    original_price:   product?.original_price   ? String(product.original_price / 100) : '',
    category:         product?.category         ?? 'Necklaces',
    material:         product?.material         ?? '',
    description:      product?.description      ?? '',
    details:          product?.details?.join('\n') ?? '',
    images:           product?.images           ?? [],
    color_variants:   product?.color_variants   ?? [],
    badge:            product?.badge            ?? '',
    in_stock:         product?.in_stock         ?? true,
    sku:              product?.sku              ?? '',
    weight:           product?.weight           ?? '',
    status:           product?.status           ?? 'draft',
    occasion:         product?.occasion         ?? [],
    metal_type:       product?.metal_type       ?? '',
    gemstone:         product?.gemstone         ?? '',
    collection_name:  product?.collection_name  ?? '',
  });

  const [saving,        setSaving]        = useState(false);
  const [deleting,      setDeleting]      = useState(false);
  const [error,         setError]         = useState('');
  const [uploading,     setUploading]     = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [listening,     setListening]     = useState(false);
  const [voiceStatus,   setVoiceStatus]   = useState('');
  const [activeColor,   setActiveColor]   = useState<number | null>(null); // index of variant being edited
  const [newColorName,  setNewColorName]  = useState('');
  const [newColorHex,   setNewColorHex]   = useState('#d4a017');

  const fileInputRef      = useRef<HTMLInputElement>(null);
  const colorFileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef    = useRef<any>(null);

  const set = (field: keyof FormData, value: any) => setForm(f => ({ ...f, [field]: value }));

  const handleNameChange = (name: string) => {
    setForm(f => ({ ...f, name, slug: mode === 'create' ? toSlug(name) : f.slug }));
  };

  // ── Image upload ──────────────────────────────────────────────────────────
  const uploadFiles = async (files: FileList, targetVariantIndex?: number) => {
    setUploading(true);
    setUploadProgress(0);
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      fd.append('file', files[i]);
      try {
        const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.url) urls.push(data.url);
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      } catch { setError(`Failed to upload ${files[i].name}`); }
    }

    if (targetVariantIndex !== undefined) {
      // Add to specific color variant
      setForm(f => {
        const variants = [...f.color_variants];
        variants[targetVariantIndex] = {
          ...variants[targetVariantIndex],
          images: [...variants[targetVariantIndex].images, ...urls],
        };
        return { ...f, color_variants: variants };
      });
    } else {
      setForm(f => ({ ...f, images: [...f.images, ...urls] }));
    }

    setUploading(false);
    setUploadProgress(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, variantIdx?: number) => {
    if (e.target.files?.length) uploadFiles(e.target.files, variantIdx);
  };

  const removeImage = (idx: number, variantIndex?: number) => {
    if (variantIndex !== undefined) {
      setForm(f => {
        const variants = [...f.color_variants];
        variants[variantIndex] = { ...variants[variantIndex], images: variants[variantIndex].images.filter((_, i) => i !== idx) };
        return { ...f, color_variants: variants };
      });
    } else {
      setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
    }
  };

  const setMainImage = (idx: number) => {
    setForm(f => {
      const imgs = [...f.images];
      const [main] = imgs.splice(idx, 1);
      return { ...f, images: [main, ...imgs] };
    });
  };

  // ── Color variants ────────────────────────────────────────────────────────
  const addColorVariant = () => {
    if (!newColorName.trim()) return;
    setForm(f => ({
      ...f,
      color_variants: [...f.color_variants, { name: newColorName.trim(), hex: newColorHex, images: [] }],
    }));
    setNewColorName('');
    setNewColorHex('#d4a017');
  };

  const removeVariant = (idx: number) => {
    setForm(f => ({ ...f, color_variants: f.color_variants.filter((_, i) => i !== idx) }));
    if (activeColor === idx) setActiveColor(null);
  };

  // ── Voice input ───────────────────────────────────────────────────────────
  const startVoice = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setVoiceStatus('Voice input not supported. Use Chrome.'); return; }
    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognitionRef.current = recognition;
    recognition.onstart  = () => { setListening(true); setVoiceStatus('Listening...'); };
    recognition.onend    = () => setListening(false);
    recognition.onerror  = () => { setListening(false); setVoiceStatus('Could not hear you. Try again.'); };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      setVoiceStatus(`Heard: "${transcript}"`);
      const priceSection = transcript.split(/price|cost|dollars?|usd/i)[1];
      let price = '';
      if (priceSection) {
        const digits = priceSection.match(/\d+(?:\.\d{1,2})?/);
        if (digits) price = digits[0];
      }
      let name = transcript.split(/price|cost|for\s+\$/i)[0].trim();
      name = name.replace(/^(called|named|it&apos;s|its|the|a|an)\s+/i, '').trim();
      name = name.replace(/\b\w/g, (c: string) => c.toUpperCase());
      if (name) {
        setForm(f => ({ ...f, name, slug: mode === 'create' ? toSlug(name) : f.slug, ...(price ? { price } : {}) }));
        setVoiceStatus(`✓ Set: "${name}"${price ? ` @ $${price}` : ''}`);
      }
    };
    recognition.start();
  }, [mode]);

  // ── Occasion toggle ───────────────────────────────────────────────────────
  const toggleOccasion = (occ: string) => {
    setForm(f => ({
      ...f,
      occasion: f.occasion.includes(occ) ? f.occasion.filter(o => o !== occ) : [...f.occasion, occ],
    }));
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async (statusOverride?: 'draft' | 'published') => {
    setSaving(true);
    setError('');
    const payload = {
      name:            form.name,
      slug:            form.slug || toSlug(form.name),
      price:           Math.round(parseFloat(form.price) * 100),
      original_price:  form.original_price ? Math.round(parseFloat(form.original_price) * 100) : null,
      category:        form.category,
      material:        form.material,
      description:     form.description,
      details:         form.details.split('\n').map(s => s.trim()).filter(Boolean),
      images:          form.images,
      color_variants:  form.color_variants,
      badge:           form.badge || null,
      in_stock:        form.in_stock,
      sku:             form.sku,
      weight:          form.weight,
      status:          statusOverride ?? form.status,
      occasion:        form.occasion,
      metal_type:      form.metal_type,
      gemstone:        form.gemstone,
      collection_name: form.collection_name,
    };
    const url    = mode === 'edit' ? `/api/admin/products/${product!.id}` : '/api/admin/products';
    const method = mode === 'edit' ? 'PATCH' : 'POST';
    try {
      const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to save'); setSaving(false); return; }
      router.push('/admin/products');
      router.refresh();
    } catch { setError('Network error. Please try again.'); setSaving(false); }
  };

  const handleDelete = async () => {
    if (!product || !confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
    if (res.ok) { router.push('/admin/products'); router.refresh(); }
    else { setError('Failed to delete'); setDeleting(false); }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-gray-900">
            {mode === 'create' ? 'Add New Product' : `Edit: ${product?.name}`}
          </h1>
          {mode === 'edit' && (
            <span className={`inline-block mt-1 font-sans text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold
              ${product?.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {product?.status}
            </span>
          )}
        </div>
        {mode === 'edit' && (
          <button onClick={handleDelete} disabled={deleting}
            className="font-sans text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 transition-colors disabled:opacity-50">
            {deleting ? 'Deleting...' : 'Delete Product'}
          </button>
        )}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 font-sans text-sm p-4 mb-6">{error}</div>}

      <div className="space-y-6">

        {/* ── Voice input ────────────────────────────────────────────────── */}
        <section className="bg-white border border-gray-100 rounded p-6 shadow-sm">
          <h2 className="font-sans text-sm font-bold text-gray-700 mb-1">🎤 Voice Input</h2>
          <p className="font-sans text-xs text-gray-400 mb-4">Say: <em>"Pearl kundan necklace, price forty nine"</em> (Chrome only)</p>
          <div className="flex items-center gap-4">
            <button type="button" onClick={listening ? () => recognitionRef.current?.stop() : startVoice}
              className={`px-6 py-2.5 font-sans text-sm font-bold transition-all ${listening ? 'bg-red-600 text-white animate-pulse' : 'btn-primary'}`}>
              {listening ? '⏹ Stop' : '🎤 Start Voice'}
            </button>
            {voiceStatus && <p className="font-sans text-xs text-gray-500 italic">{voiceStatus}</p>}
          </div>
        </section>

        {/* ── Primary Photos ─────────────────────────────────────────────── */}
        <section className="bg-white border border-gray-100 rounded p-6 shadow-sm">
          <h2 className="font-sans text-sm font-bold text-gray-700 mb-1">📸 Product Photos</h2>
          <p className="font-sans text-xs text-gray-400 mb-4">Upload multiple images. Click ★ to set the main image. First image is shown in listings.</p>

          <div
            onDrop={e => { e.preventDefault(); if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files); }}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 hover:border-gold-400 bg-gray-50 hover:bg-gold-50 rounded p-6 text-center cursor-pointer transition-all mb-4"
          >
            <p className="font-sans text-sm text-gray-400">📁 Drop photos here or click to select</p>
            <p className="font-sans text-xs text-gray-300 mt-1">JPG, PNG, HEIC — multiple files OK</p>
            {uploading && (
              <div className="mt-3">
                <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gold-400 h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="font-sans text-xs text-gold-500 mt-1">Uploading {uploadProgress}%...</p>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={handleFileChange} />

          {form.images.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {form.images.map((url, i) => (
                <div key={url} className="relative group aspect-square rounded overflow-hidden border border-gray-100">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {i === 0 && <span className="absolute top-1 left-1 bg-gold-400 text-white text-[8px] px-1 rounded">MAIN</span>}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    {i !== 0 && (
                      <button onClick={() => setMainImage(i)} title="Set as main" className="text-gold-300 text-sm hover:text-gold-200">★</button>
                    )}
                    <button onClick={() => removeImage(i)} className="text-red-300 text-sm hover:text-red-200">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Color Variants ─────────────────────────────────────────────── */}
        <section className="bg-white border border-gray-100 rounded p-6 shadow-sm">
          <h2 className="font-sans text-sm font-bold text-gray-700 mb-1">🎨 Color Variants</h2>
          <p className="font-sans text-xs text-gray-400 mb-4">Add different metal finishes or colors. Each can have its own photos.</p>

          {/* Preset color swatches */}
          <div className="flex flex-wrap gap-2 mb-4">
            {PRESET_COLORS.map(c => (
              <button key={c.name} type="button"
                onClick={() => { setNewColorName(c.name); setNewColorHex(c.hex); }}
                className="flex items-center gap-1.5 border border-gray-200 px-2 py-1 hover:border-gold-400 transition-colors text-xs font-sans text-gray-600"
              >
                <span className="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0" style={{ background: c.hex }} />
                {c.name}
              </button>
            ))}
          </div>

          {/* Add variant form */}
          <div className="flex gap-2 mb-4">
            <input type="text" className="form-input flex-1" placeholder="Color name e.g. Rose Gold" value={newColorName} onChange={e => setNewColorName(e.target.value)} />
            <div className="flex items-center gap-2 border border-gray-200 px-3">
              <input type="color" value={newColorHex} onChange={e => setNewColorHex(e.target.value)} className="w-6 h-6 cursor-pointer border-0 bg-transparent" />
              <span className="font-sans text-xs text-gray-500">{newColorHex}</span>
            </div>
            <button type="button" onClick={addColorVariant} className="btn-primary flex-shrink-0">Add</button>
          </div>

          {/* Existing variants */}
          {form.color_variants.length > 0 && (
            <div className="space-y-3">
              {form.color_variants.map((v, i) => (
                <div key={i} className="border border-gray-100 rounded overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 cursor-pointer" onClick={() => setActiveColor(activeColor === i ? null : i)}>
                    <span className="w-5 h-5 rounded-full border border-gray-200 flex-shrink-0" style={{ background: v.hex }} />
                    <span className="font-sans text-sm font-bold text-gray-700 flex-1">{v.name}</span>
                    <span className="font-sans text-xs text-gray-400">{v.images.length} image{v.images.length !== 1 ? 's' : ''}</span>
                    <span className="text-gray-400">{activeColor === i ? '▲' : '▼'}</span>
                    <button type="button" onClick={e => { e.stopPropagation(); removeVariant(i); }} className="text-red-400 hover:text-red-600 font-bold ml-2">✕</button>
                  </div>

                  {activeColor === i && (
                    <div className="p-4 border-t border-gray-100">
                      <p className="font-sans text-xs text-gray-400 mb-3">Photos for {v.name} variant (optional — leave empty to use main photos)</p>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
                        {v.images.map((url, j) => (
                          <div key={url} className="relative group aspect-square rounded overflow-hidden border border-gray-100">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button onClick={() => removeImage(j, i)} className="absolute top-1 right-1 bg-red-600 text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                          </div>
                        ))}
                        <button type="button"
                          onClick={() => { colorFileInputRef.current?.setAttribute('data-variant', String(i)); colorFileInputRef.current?.click(); }}
                          className="aspect-square border-2 border-dashed border-gray-200 hover:border-gold-400 rounded flex items-center justify-center text-gray-300 hover:text-gold-400 text-2xl transition-colors">
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <input ref={colorFileInputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={e => {
              const idx = parseInt(colorFileInputRef.current?.getAttribute('data-variant') ?? '0');
              if (e.target.files?.length) uploadFiles(e.target.files, idx);
            }}
          />
        </section>

        {/* ── Basic info ─────────────────────────────────────────────────── */}
        <section className="bg-white border border-gray-100 rounded p-6 shadow-sm">
          <h2 className="font-sans text-sm font-bold text-gray-700 mb-4">Product Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5">Product Name *</label>
              <input type="text" className="form-input" placeholder="Kundan Bridal Necklace Set" value={form.name} onChange={e => handleNameChange(e.target.value)} />
            </div>
            <div>
              <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5">URL Slug *</label>
              <input type="text" className="form-input font-mono text-sm" value={form.slug} onChange={e => set('slug', e.target.value)} />
            </div>
            <div>
              <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5">SKU</label>
              <input type="text" className="form-input" placeholder="PF-NK-001" value={form.sku} onChange={e => set('sku', e.target.value)} />
            </div>
            <div>
              <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5">Price (USD) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input type="number" step="0.01" min="0" className="form-input pl-7" placeholder="189.00" value={form.price} onChange={e => set('price', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5">Original Price (sale)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input type="number" step="0.01" min="0" className="form-input pl-7" placeholder="229.00" value={form.original_price} onChange={e => set('original_price', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5">Category *</label>
              <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5">Badge</label>
              <select className="form-input" value={form.badge} onChange={e => set('badge', e.target.value)}>
                {BADGES.map(b => <option key={b} value={b}>{b || 'None'}</option>)}
              </select>
            </div>
            <div>
              <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5">Metal Type</label>
              <select className="form-input" value={form.metal_type} onChange={e => set('metal_type', e.target.value)}>
                <option value="">Select...</option>
                {METAL_TYPES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5">Gemstone</label>
              <select className="form-input" value={form.gemstone} onChange={e => set('gemstone', e.target.value)}>
                <option value="">Select...</option>
                {GEMSTONES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5">Material</label>
              <input type="text" className="form-input" placeholder="22K Gold Plated Brass" value={form.material} onChange={e => set('material', e.target.value)} />
            </div>
            <div>
              <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5">Weight</label>
              <input type="text" className="form-input" placeholder="120g" value={form.weight} onChange={e => set('weight', e.target.value)} />
            </div>
            <div>
              <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5">Collection Name</label>
              <input type="text" className="form-input" placeholder="Bridal Edit" value={form.collection_name} onChange={e => set('collection_name', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 block mb-2">Occasion</label>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map(occ => (
                  <button key={occ} type="button" onClick={() => toggleOccasion(occ)}
                    className={`font-sans text-xs px-3 py-1.5 border transition-colors ${form.occasion.includes(occ) ? 'border-gold-400 bg-gold-50 text-gold-600 font-bold' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    {occ}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5">Description *</label>
              <textarea rows={4} className="form-input resize-none" placeholder="Describe the piece..." value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5">Details / Bullet Points</label>
              <textarea rows={5} className="form-input resize-none font-mono text-sm" placeholder={"One detail per line:\n22K Gold Plated Brass\nAdjustable length: 16–18 inches"} value={form.details} onChange={e => set('details', e.target.value)} />
              <p className="font-sans text-[10px] text-gray-400 mt-1">One bullet point per line.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button type="button" onClick={() => set('in_stock', !form.in_stock)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.in_stock ? 'bg-green-500' : 'bg-gray-300'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.in_stock ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="font-sans text-sm text-gray-600">{form.in_stock ? 'In Stock' : 'Out of Stock'}</span>
          </div>
        </section>

        {/* ── Publish ────────────────────────────────────────────────────── */}
        <section className="bg-white border border-gray-100 rounded p-6 shadow-sm">
          <h2 className="font-sans text-sm font-bold text-gray-700 mb-1">Publish</h2>
          <p className="font-sans text-xs text-gray-400 mb-4">Save as draft to review privately, or publish to make it live immediately.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => handleSave('draft')} disabled={saving} className="btn-outline disabled:opacity-50">
              {saving ? 'Saving...' : 'Save as Draft'}
            </button>
            <button type="button" onClick={() => handleSave('published')} disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? 'Publishing...' : '🚀 Publish to Store'}
            </button>
            {mode === 'edit' && product?.status === 'published' && (
              <button type="button" onClick={() => handleSave('draft')} disabled={saving} className="font-sans text-xs text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-300 transition-colors">
                Unpublish
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
