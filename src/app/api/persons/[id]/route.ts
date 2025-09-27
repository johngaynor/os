import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const person = await prisma.person.findFirst({
      where: {
        id: params.id,
        userId: userId, // Ensure user can only access their own persons
      },
    });

    if (!person) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    return NextResponse.json(person, { status: 200 });
  } catch (error) {
    console.error("Error fetching person:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // First check if the person exists and belongs to the user
    const existingPerson = await prisma.person.findFirst({
      where: {
        id: params.id,
        userId: userId,
      },
    });

    if (!existingPerson) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    // Update the person
    const updatedPerson = await prisma.person.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        origin,
        relationshipType,
        relationshipStrength: parseInt(relationshipStrength),
        occupation,
        context,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedPerson, { status: 200 });
  } catch (error) {
    console.error("Error updating person:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First check if the person exists and belongs to the user
    const existingPerson = await prisma.person.findFirst({
      where: {
        id: params.id,
        userId: userId,
      },
    });

    if (!existingPerson) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    // Delete the person
    await prisma.person.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(
      { message: "Person deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting person:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
