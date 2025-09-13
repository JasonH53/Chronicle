import { rbcApi } from "@/src/lib/rbc";

export async function POST() {
  try {
    const token = await rbcApi.registerTeam();
    return Response.json({ token });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}


