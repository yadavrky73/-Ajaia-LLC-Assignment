import { prisma } from '@/lib/prisma'
import { GET, POST } from '@/app/api/documents/route'
import { auth } from '@/lib/auth'

jest.mock('@/lib/auth')
jest.mock('@/lib/prisma')

describe('Documents API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GET returns owned and shared documents for authenticated user', async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: 'user1' } })
    ;(prisma.document.findMany as jest.Mock).mockResolvedValue([{ id: 'doc1', title: 'My doc' }])
    ;(prisma.sharedAccess.findMany as jest.Mock).mockResolvedValue([{ document: { id: 'doc2', title: 'Shared doc' } }])

    const response = await GET()
    const json = await response.json()
    expect(json).toHaveLength(2)
    expect(json[0].title).toBe('My doc')
    expect(json[1].title).toBe('Shared doc')
  })

  it('POST creates new document', async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: 'user1' } })
    ;(prisma.document.create as jest.Mock).mockResolvedValue({ id: 'new', title: 'Test' })

    const req = new Request('http://localhost', { method: 'POST', body: JSON.stringify({ title: 'Test' }) })
    const res = await POST(req)
    const data = await res.json()
    expect(data.id).toBe('new')
  })
})