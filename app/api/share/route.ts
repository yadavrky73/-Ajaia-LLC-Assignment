import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { documentId, userEmail, permission } = await request.json()
  const doc = await prisma.document.findUnique({ where: { id: documentId } })
  if (!doc || doc.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Only owner can share" }, { status: 403 })
  }

  const shareUser = await prisma.user.findUnique({ where: { email: userEmail } })
  if (!shareUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

  await prisma.sharedAccess.upsert({
    where: { documentId_userId: { documentId, userId: shareUser.id } },
    update: { permission },
    create: { documentId, userId: shareUser.id, permission },
  })
  return NextResponse.json({ success: true })
}