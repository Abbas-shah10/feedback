import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import Feedback from "@/model/Feedback";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "admin")
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  await dbConnect();
  const [totals, byStatus, byCategory, byPriority] = await Promise.all([
    Feedback.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          thisMonth: {
            $sum: {
              $cond: [
                { $gte: ["$createdAt", new Date(new Date().setDate(1))] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]),
    Feedback.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Feedback.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
    Feedback.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]),
  ]);

  return NextResponse.json({
    totals: totals[0] || { total: 0, thisMonth: 0 },
    byStatus,
    byCategory,
    byPriority,
  });
}
