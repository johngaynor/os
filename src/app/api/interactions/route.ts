import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const personId = searchParams.get("personId");

    let interactions;

    if (personId) {
      // Fetch interactions for a specific person
      // First verify the person belongs to the user
      const person = await prisma.person.findFirst({
        where: {
          id: personId,
          userId: userId,
        },
      });

      if (!person) {
        return NextResponse.json({ error: "Person not found" }, { status: 404 });
      }

      interactions = await prisma.interaction.findMany({
        where: {
          personId: personId,
        },
        include: {
          person: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          interactionTime: "desc",
        },
      });
    } else {
      // Fetch all interactions for all persons belonging to the user
      interactions = await prisma.interaction.findMany({
        where: {
          person: {
            userId: userId,
          },
        },
        include: {
          person: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          interactionTime: "desc",
        },
      });
    }

    return NextResponse.json(interactions, { status: 200 });
  } catch (error) {
    console.error("Error fetching interactions:", error);
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
      personId,
      title,
      latitude,
      longitude,
      placeName,
      interactionTime,
      notes,
    } = body;

    // Validate required fields
    if (!personId) {
      return NextResponse.json(
        { error: "Person ID is required" },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Verify the person belongs to the user
    const person = await prisma.person.findFirst({
      where: {
        id: personId,
        userId: userId,
      },
    });

    if (!person) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    // Create the interaction
    const newInteraction = await prisma.interaction.create({
      data: {
        personId,
        title,
        latitude: latitude || null,
        longitude: longitude || null,
        placeName: placeName || null,
        interactionTime: interactionTime ? new Date(interactionTime) : null,
        notes: notes || null,
      },
      include: {
        person: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(newInteraction, { status: 201 });
  } catch (error) {
    console.error("Error creating interaction:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}