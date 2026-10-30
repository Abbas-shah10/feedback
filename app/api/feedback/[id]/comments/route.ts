import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import Feedback from "@/model/Feedback";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const commentSchema = z.object({
  body: z.string().trim().min(1).max(1000),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?._id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const parsed = commentSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ message: "Comment must be between 1 and 1000 characters" }, { status: 400 });

  const { id } = await context.params;
  await dbConnect();
  const feedback = await Feedback.findOne({ _id: id });
  if (!feedback)
    return NextResponse.json({ message: "Feedback not found" }, { status: 404 });

  feedback.comments.push({
    userId: session.user._id,
    body: parsed.data.body,
    createdAt: new Date(),
  } as never);
  await feedback.save();

  await feedback.populate("comments.userId", "username email");
  return NextResponse.json({ comment: feedback.comments.at(-1) }, { status: 201 });
}
