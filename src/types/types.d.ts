import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `getServerSession` and `useSession` (client-side)
   */
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      username : string;
    } & DefaultSession["user"];
  }

  /**
   * User model in the database
   */
  interface User extends DefaultUser {
    id: string;
    username : string
  }
}