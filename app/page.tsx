'use client'
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) router.push('/dashboard')
  }, [session, router])

  if (status === "loading") return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center">Ajaia Docs</h1>
        <p className="text-center text-gray-600">Lightweight collaborative editor</p>
        <div className="space-y-3">
          <button
            onClick={() => signIn("credentials", { email: "alice@example.com", redirect: false })}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Continue as Alice (owner)
          </button>
          <button
            onClick={() => signIn("credentials", { email: "bob@example.com", redirect: false })}
            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Continue as Bob (collaborator)
          </button>
        </div>
      </div>
    </div>
  )
}