'use client'
import { useRef } from "react"

export default function FileUpload({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/api/upload", { method: "POST", body: formData })
    if (res.ok) {
      onUploadSuccess()
    }
  }

  return (
    <>
      <button onClick={() => fileRef.current?.click()} className="bg-gray-200 px-3 py-1 rounded">
        Import .txt
      </button>
      <input type="file" accept=".txt" ref={fileRef} onChange={handleUpload} className="hidden" />
    </>
  )
}