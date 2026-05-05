'use client'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Document {
  id: string
  title: string
  owner: { name: string }
  shared: boolean
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [docs, setDocs] = useState<Document[]>([])
  const [newTitle, setNewTitle] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/")
    if (session?.user?.id) fetchDocuments()
  }, [session, status])

  const fetchDocuments = async () => {
    const res = await fetch("/api/documents")
    const data = await res.json()
    setDocs(data)
  }

  const createDocument = async () => {
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle || "Untitled" }),
    })
    if (res.ok) {
      setNewTitle("")
      fetchDocuments()
    }
  }

  const renameDocument = async (id: string, newTitle: string) => {
    await fetch(`/api/documents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    })
    fetchDocuments()
  }

  if (status === "loading") return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Documents</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Document title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="border rounded px-3 py-1"
          />
          <button onClick={createDocument} className="bg-blue-600 text-white px-4 py-1 rounded">
            New Document
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {docs.map((doc) => (
          <div key={doc.id} className="border rounded p-4 flex justify-between items-center">
            <div>
              <span
                className="text-lg font-medium cursor-pointer hover:text-blue-600"
                onClick={() => router.push(`/document/${doc.id}`)}
              >
                {doc.title}
              </span>
              <div className="text-sm text-gray-500">
                {doc.shared ? "Shared with you" : `Owner: ${doc.owner.name}`}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newTitle = prompt("New title", doc.title)
                  if (newTitle) renameDocument(doc.id, newTitle)
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                Rename
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}