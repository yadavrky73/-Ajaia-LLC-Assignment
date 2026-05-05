import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get("file") as File
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

  const text = await file.text()
  const paragraphs = text.split(/\n/).filter(p => p.trim().length > 0)
  const content = {
    type: "doc",
    content: paragraphs.map(p => ({ type: "paragraph", content: [{ type: "text", text: p }] })),
  }

  const doc = await prisma.document.create({
    data: {
      title: file.name.replace(/\.[^/.]+$/, "") || "Imported",
      content: JSON.stringify(content),
      ownerId: session.user.id,
    },
  })
  return NextResponse.json(doc)
}