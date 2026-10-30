import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import Feedback from "@/model/Feedback";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?._id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  await dbConnect();
  const feedback = await Feedback.findOne({ _id: id });
  if (!feedback)
    return NextResponse.json({ message: "Feedback not found" }, { status: 404 });

  const userId = session.user._id;
  const hasVoted = feedback.upvotes.some((vote) => vote.toString() === userId);
  if (hasVoted)
    feedback.upvotes = feedback.upvotes.filter((vote) => vote.toString() !== userId);
  else
    feedback.upvotes.push(userId as never);
  await feedback.save();

  return NextResponse.json({
    upvotes: feedback.upvotes.length,
    hasVoted: !hasVoted,
  });
}
