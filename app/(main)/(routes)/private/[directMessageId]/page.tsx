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

    return(
        <div>
            CHECKKK DIRECT MESSAGE
            {params.directMessageId}
        </div>
    )



}
 
export default DirectMessage;