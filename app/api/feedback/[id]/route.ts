import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import Feedback from "@/model/Feedback";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const updateSchema = z.object({
  title: z.string().trim().min(3).max(120).optional(),
  description: z.string().trim().min(10).max(2000).optional(),
  category: z.enum(["bug", "feature", "improvement", "other"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["open", "in-progress", "resolved", "closed"]).optional(),
});

async function findOwnedFeedback(
  id: string,
  session: { user?: { _id?: string; role?: "user" | "admin" } },
) {
  await dbConnect();
  const query: Record<string, string> = { _id: id };
  if (session.user?.role !== "admin") query.userId = session.user?._id || "";
  return Feedback.findOne(query)
    .populate("userId", "username email")
    .populate("comments.userId", "username email");
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?._id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const feedback = await findOwnedFeedback(id, session);
  if (!feedback)
    return NextResponse.json(
      { message: "Feedback not found" },
      { status: 404 },
    );
  return NextResponse.json(feedback);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?._id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  if (parsed.data.status && session.user.role !== "admin")
    return NextResponse.json(
      { message: "Only admins can change status" },
      { status: 403 },
    );

  const { id } = await context.params;
  const feedback = await findOwnedFeedback(id, session);
  if (!feedback)
    return NextResponse.json(
      { message: "Feedback not found" },
      { status: 404 },
    );
  Object.assign(feedback, parsed.data);
  await feedback.save();
  return NextResponse.json({ success: true, feedback });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?._id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const feedback = await findOwnedFeedback(id, session);
  if (!feedback)
    return NextResponse.json(
      { message: "Feedback not found" },
      { status: 404 },
    );
  await feedback.deleteOne();
  return NextResponse.json({ success: true, message: "Feedback deleted" });
}
