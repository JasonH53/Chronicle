import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { rbcApi } from "@/src/lib/rbc";

export async function POST(request: NextRequest) {
  try {
    const { name, email } = (await request.json()) as { name?: string; email?: string };
    if (!name || !email) {
      return Response.json({ error: "Missing name or email" }, { status: 400 });
    }

    await rbcApi.registerTeam();
    const r = await rbcApi.createClient({ name, email });

    const user = await prisma.user.create({
      data: { name, email, clientId: r.clientId },
    });

    return Response.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}


