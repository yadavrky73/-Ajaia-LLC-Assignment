import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = session.user.id

  const owned = await prisma.document.findMany({
    where: { ownerId: userId },
    include: { owner: true },
  })
  const sharedAccess = await prisma.sharedAccess.findMany({
    where: { userId },
    include: { document: { include: { owner: true } } },
  })
  const sharedDocs = sharedAccess.map(sa => ({ ...sa.document, shared: true }))

  const all = [...owned.map(d => ({ ...d, shared: false })), ...sharedDocs]
  return NextResponse.json(all)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { title } = await request.json()
  const doc = await prisma.document.create({
    data: {
      title: title || "Untitled",
      content: JSON.stringify({ type: "doc", content: [{ type: "paragraph" }] }),
      ownerId: session.user.id,
    },
  })
  return NextResponse.json(doc)
}