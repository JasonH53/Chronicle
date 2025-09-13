import { NextRequest } from "next/server";
import { rbcApi } from "@/src/lib/rbc";

// POST /api/simulate { clientId, months }
export async function POST(request: NextRequest) {
  try {
    const { clientId, months } = (await request.json()) as { clientId?: string; months?: number };
    if (!clientId || !months) {
      return Response.json({ error: "Missing clientId or months" }, { status: 400 });
    }
    const result = await rbcApi.simulate(clientId, { months });
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}


