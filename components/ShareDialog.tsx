'use client'
import { useState } from "react"

export default function ShareDialog({ documentId }: { documentId: string }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [permission, setPermission] = useState("view")

  const handleShare = async () => {
    await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId, userEmail: email, permission }),
    })
    setOpen(false)
    setEmail("")
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="bg-gray-200 px-3 py-1 rounded">
        Share
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Share document</h2>
            <input
              type="email"
              placeholder="User email (alice@example.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full mb-2"
            />
            <select value={permission} onChange={(e) => setPermission(e.target.value)} className="border p-2 w-full mb-4">
              <option value="view">Can view</option>
              <option value="edit">Can edit</option>
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-3 py-1 border rounded">Cancel</button>
              <button onClick={handleShare} className="px-3 py-1 bg-blue-600 text-white rounded">Share</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}