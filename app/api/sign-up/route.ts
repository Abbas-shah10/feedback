import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { username, email, password } = await request.json();

    const existingUserByUsername = await UserModel.findOne({ username });
    if (existingUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 },
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      return Response.json(
        {
          success: false,
          message: "User already exists with this email",
        },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      isAcceptingMessage: true,
      messages: [],
    });

    await newUser.save();

    return Response.json(
      {
        success: true,
        message: "User registered successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error registering user", error);
    const isDatabaseTimeout =
      error instanceof Error &&
      "code" in error &&
      (error as Error & { code?: string }).code === "ETIMEOUT";

    return Response.json(
      {
        success: false,
        message: isDatabaseTimeout
          ? "Database is temporarily unavailable. Check your network DNS and MongoDB Atlas settings."
          : "Error registering user",
      },
      { status: isDatabaseTimeout ? 503 : 500 },
    );
  }
}
