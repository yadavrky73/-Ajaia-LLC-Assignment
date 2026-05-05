'use client'
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Editor from "@/components/Editor"
import FileUpload from "@/components/FileUpload"
import ShareDialog from "@/components/ShareDialog"

export default function DocumentPage() {
  const { id } = useParams()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [doc, setDoc] = useState<any>(null)
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/")
    if (session?.user?.id && id) fetchDocument()
  }, [session, status, id])

  const fetchDocument = async () => {
    const res = await fetch(`/api/documents/${id}`)
    if (res.ok) {
      const data = await res.json()
      setDoc(data)
      setTitle(data.title)
      setContent(data.content)
    } else if (res.status === 403) {
      router.push("/dashboard")
    }
  }

  const saveContent = async (newContent: string) => {
    setSaving(true)
    await fetch(`/api/documents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newContent }),
    })
    setSaving(false)
  }

  const updateTitle = async (newTitle: string) => {
    await fetch(`/api/documents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    })
    setTitle(newTitle)
  }

  if (!doc) return <div className="p-8">Loading...</div>

  const canEdit = doc.ownerId === session?.user?.id || doc.sharedWith?.some(s => s.permission === "edit")

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => updateTitle(e.target.value)}
          className="text-2xl font-bold border-b focus:outline-none"
          disabled={!canEdit}
        />
        <div className="flex gap-2">
          {doc.ownerId === session?.user?.id && <ShareDialog documentId={id as string} />}
          <FileUpload onUploadSuccess={() => router.push("/dashboard")} />
          {saving && <span className="text-sm text-gray-500">Saving...</span>}
        </div>
      </div>
      <Editor content={content} onChange={saveContent} editable={canEdit} />
    </div>
  )
}