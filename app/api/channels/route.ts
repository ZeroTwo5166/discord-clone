import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server"

export async function POST(
    req: Request
){
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");
        
        if(!profile){
            return new NextResponse("Unauthorized", { status : 401});
        }

        if(!serverId){
            return new NextResponse("Server ID missing", { status : 400});
        }

        if(name.toLowerCase() === "general"){
            return new NextResponse("Channel name cannot be 'general'!", { status: 400});
        }

        const serverExists = await db.server.findUnique({
            where: { id: serverId },
        });

        if (!serverExists) {
            return new NextResponse("Server not found", { status: 404 });
        }

        // Check if a channel with the same name and type already exists in the server
        const existingChannel = await db.channel.findFirst({
            where: {
                serverId,
                name,
                type, // Add this to ensure the type is also considered
            }
        });

        if(existingChannel){
            return new NextResponse(`Name '${name}' already exists in channel '${type}'`, { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.CREATOR, MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels:{
                    create:{
                        profileId : profile.id,
                        name,
                        type
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("CHANNEL_POST", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}
