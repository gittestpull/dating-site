
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      prestige?: string;
    } & DefaultSession["user"];
  }

  interface User {
    prestige?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    prestige?: string;
  }
}
