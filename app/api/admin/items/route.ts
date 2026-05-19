import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { itemSchema } from "@/lib/validators/admin";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    return ok(await prisma.item.findMany({ orderBy: { createdAt: "desc" } }));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = itemSchema.parse(await req.json());
    return ok(await prisma.item.create({ data: body }));
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin(req);
    const id = req.nextUrl.searchParams.get("id");
    if (!id) throw new Error("Item id is required.");
    const body = itemSchema.partial().parse(await req.json());
    return ok(await prisma.item.update({ where: { id }, data: body }));
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req);
    const id = req.nextUrl.searchParams.get("id");
    if (!id) throw new Error("Item id is required.");
    await prisma.item.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
