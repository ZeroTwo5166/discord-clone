import { ServerSidebar } from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const PrivateLayout =  async({
    children
} : {    children: React.ReactNode;
}) => {
    const profile = await currentProfile();

    if(!profile){
        return auth().redirectToSignIn();
    }


    
    return (
        <div className="h-full">
            <div
             className="hidden fixed md:flex h-full w-60 z-20
             flex-col inset-y-0">
                TEST
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    )
}

export default PrivateLayout;

