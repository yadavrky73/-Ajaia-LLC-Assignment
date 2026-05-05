import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const doc = await prisma.document.findUnique({
    where: { id: params.id },
    include: { owner: true, sharedWith: true },
  })
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const hasAccess = doc.ownerId === session.user.id ||
    doc.sharedWith.some(s => s.userId === session.user.id)
  if (!hasAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  return NextResponse.json(doc)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { title, content } = await req.json()
  const doc = await prisma.document.findUnique({ where: { id: params.id }, include: { sharedWith: true } })
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const canEdit = doc.ownerId === session.user.id ||
    doc.sharedWith.some(s => s.userId === session.user.id && s.permission === "edit")
  if (!canEdit) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const updated = await prisma.document.update({
    where: { id: params.id },
    data: { title, content },
  })
  return NextResponse.json(updated)
}