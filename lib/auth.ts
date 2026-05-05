import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Mock Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const users = [
          { id: "1", email: "alice@example.com", name: "Alice" },
          { id: "2", email: "bob@example.com", name: "Bob" },
        ]
        const user = users.find(u => u.email === credentials?.email)
        if (user) return { id: user.id, email: user.email, name: user.name }
        return null
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub!
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret",
})