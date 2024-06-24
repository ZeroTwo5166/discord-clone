import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface DirectMessageProps {
    params: {
        directMessageId: string
    }
}




const DirectMessage = async({
    params
}: DirectMessageProps) => {
    const profile = await currentProfile();

    if(!profile){
        return auth().redirectToSignIn();
    }


    const server = await db.server.findUnique({
        where:{
            id:"123",
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc"
                },
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: "asc"
                }
            }
        }
    });

    const members = server?.members.filter(member => member.profileId !== profile.id)


    return(
        <div>
            CHECKKK DIRECT MESSAGE
            {params.directMessageId}
        </div>
    )



}
 
export default DirectMessage;