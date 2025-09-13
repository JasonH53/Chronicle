import { NextRequest } from "next/server";
import { rbcApi } from "@/src/lib/rbc";

// GET /api/portfolios/:id -> fetch current value
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await rbcApi.getPortfolio(params.id);
    return Response.json({ portfolio: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

// POST /api/portfolios/:id/transfer { amountCents }
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { amountCents } = (await request.json()) as { amountCents?: number };
    if (!amountCents || amountCents <= 0) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }
    const result = await rbcApi.transferToPortfolio(params.id, { amountCents });
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}


