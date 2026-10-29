import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import Feedback from "@/model/Feedback";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const feedbackSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(2000),
  category: z.enum(["bug", "feature", "improvement", "other"]),
  priority: z.enum(["low", "medium", "high"]),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?._id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const parsed = feedbackSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "Validation failed", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  try {
    await dbConnect();
    const feedback = await Feedback.create({ ...parsed.data, userId: session.user._id });
    return NextResponse.json({ success: true, feedback }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Could not create feedback", error: String(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?._id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(Number(searchParams.get("page") || 1), 1);
  const limit = Math.min(Math.max(Number(searchParams.get("limit") || 10), 1), 50);
  const status = searchParams.get("status") || "";
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search")?.trim() || "";
  const sort = searchParams.get("sort") === "oldest" ? 1 : -1;

  await dbConnect();
  const query: Record<string, unknown> = session.user.role === "admin" ? {} : { userId: session.user._id };
  if (status) query.status = status;
  if (category) query.category = category;
  if (search) query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];

  const [items, total] = await Promise.all([
    Feedback.find(query).populate("userId", "username email").sort({ createdAt: sort }).skip((page - 1) * limit).limit(limit),
    Feedback.countDocuments(query),
  ]);

  return NextResponse.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
}
