import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all persons for the authenticated user
    const persons = await prisma.person.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(persons, { status: 200 });
  } catch (error) {
    console.error("Error fetching persons:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      origin,
      relationshipType,
      relationshipStrength,
      occupation,
      context,
    } = body;

    // Validate required fields
    if (!name || !relationshipType || relationshipStrength === undefined) {
      return NextResponse.json(
        {
          error:
            "Name, relationshipType, and relationshipStrength are required",
        },
        { status: 400 }
      );
    }

    // Validate relationship strength is between 1-5
    if (relationshipStrength < 1 || relationshipStrength > 5) {
      return NextResponse.json(
        { error: "Relationship strength must be between 1 and 5" },
        { status: 400 }
      );
    }

    const person = await prisma.person.create({
      data: {
        userId,
        name,
        origin,
        relationshipType,
        relationshipStrength: parseInt(relationshipStrength),
        occupation,
        context,
      },
    });

    return NextResponse.json(person, { status: 201 });
  } catch (error) {
    console.error("Error creating person:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
