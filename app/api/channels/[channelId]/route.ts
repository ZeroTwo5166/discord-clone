import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";


export async function PATCH(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if (!serverId) {
            return new NextResponse("Server ID missing", { status: 400 })
        }

        if (!params.channelId) {
            return new NextResponse("Channel ID missing", { status: 400 })
        }

        if (name.toLowerCase() === "general") {
            return new NextResponse("Name cannot be 'general'", { status: 400 })
        }

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Check if a channel with the same name and type already exists in the server
        const existingChannel = await db.channel.findFirst({
            where: {
                serverId,
                name,
                type, // Only check within the same channel type
                NOT: {
                    id: params.channelId, // Exclude the current channel being updated
                },
            }
        });

        if (existingChannel) {
            return new NextResponse(`Name '${name}' already exists in ${type} channel.`, { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.CREATOR, MemberRole.ADMIN, MemberRole.MODERATOR],
                        }
                    }
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: {
                                name: "general"
                            },
                        },
                        data: {
                            name,
                            type
                        }
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log("[CHANNEL_ID_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}



export async function DELETE(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if (!serverId) {
            return new NextResponse("Server ID missing", { status: 400 })
        }

        if (!params.channelId) {
            return new NextResponse("Channel ID missing", { status: 400 })
        }

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.CREATOR, MemberRole.ADMIN, MemberRole.MODERATOR],
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        id: params.channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log("[CHANNEL_ID_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
