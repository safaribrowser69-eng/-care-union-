'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export function ImageUpload({ value, onChange, folder = 'general', label = 'Upload Image', aspectRatio = '16/9' }:
  { value: string; onChange: (url: string) => void; folder?: string; label?: string; aspectRatio?: '1/1'|'16/9'|'4/3'|'3/1' }) {
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!ALLOWED.includes(file.type)) { toast.error('Only JPG, PNG, WebP, or GIF files allowed.'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('File must be under 5MB.'); return }
    setUploading(true)
    try {
      const form = new FormData(); form.append('file', file); form.append('folder', folder)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (data.success) { onChange(data.url); toast.success('Image uploaded!') }
      else toast.error(data.message || 'Upload failed.')
    } catch { toast.error('Upload failed. Please try again.') }
    finally { setUploading(false); if (inputRef.current) inputRef.current.value = '' }
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!urlInput.trim()) return
    onChange(urlInput.trim()); setUrlInput(''); setShowUrlInput(false)
  }

  return (
    <div className="space-y-2">
      {label && <label className="input-label">{label}</label>}
      {value && (
        <div className="relative w-full bg-slate-100 rounded-xl overflow-hidden" style={{ aspectRatio }}>
          <Image src={value} alt="Preview" fill className="object-cover" />
          <button type="button" onClick={() => onChange('')} className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors" aria-label="Remove image"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}
      {!value && (
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-navy-300 transition-colors">
          <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500 mb-4">Upload from device or paste an image URL</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 bg-navy-700 hover:bg-navy-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all disabled:opacity-60">
              {uploading ? (<><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading…</>) : (<><Upload className="w-3.5 h-3.5" /> Upload File</>)}
            </button>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFile} className="hidden" aria-label="Upload image file" />
            <button type="button" onClick={() => setShowUrlInput(v => !v)} className="inline-flex items-center gap-2 border border-slate-200 text-slate-600 hover:border-navy-300 hover:text-navy-700 text-xs font-semibold px-4 py-2.5 rounded-lg transition-all">Paste URL</button>
          </div>
        </div>
      )}
      {showUrlInput && (
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="https://images.unsplash.com/..." className="input flex-1 text-xs py-2" />
          <button type="submit" className="btn-primary py-2 px-4 text-xs">Use</button>
        </form>
      )}
      {value && !showUrlInput && (<button type="button" onClick={() => setShowUrlInput(true)} className="text-xs text-slate-400 hover:text-navy-700 transition-colors">Replace with URL</button>)}
      <p className="text-xs text-slate-400">JPG, PNG, WebP, GIF · Max 5MB</p>
    </div>
  )
}
