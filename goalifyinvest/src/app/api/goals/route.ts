import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { rbcApi } from "@/src/lib/rbc";

// Create a goal: expects { userId, name, targetAmountCents, targetDate, portfolioType }
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      userId?: string;
      name?: string;
      targetAmountCents?: number;
      targetDate?: string;
      portfolioType?: string; // MVP: manual selection
    };
    const { userId, name, targetAmountCents, targetDate, portfolioType } = body;
    if (!userId || !name || !targetAmountCents || !targetDate || !portfolioType) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    await rbcApi.registerTeam();
    const created = await rbcApi.createPortfolio(user.clientId, { name, type: portfolioType });

    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        name,
        targetAmountCents,
        targetDate: new Date(targetDate),
        portfolioId: created.portfolioId,
      },
    });

    return Response.json({ goal });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

// Get goals for a user: /api/goals?userId=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }
    const goals = await prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    return Response.json({ goals });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}


