import InitialModel from "@/components/models/intial-model";
import { NavigationSideBar } from "@/components/navigation/navigation-sidebar";
import { db } from "@/lib/db";
import { InitialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const SetupPage = async() => {
    
    const profile = await InitialProfile();
    const server = await db.server.findFirst({
        where: {
            members:{
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if(server){
        return redirect(`/servers/${server.id}`)
    }
    return (<>
        <div className="h-full">
            <div className="hidden md:flex h-full w-[72px]
            z-30 flex-col fixed inset-y-0">
                <NavigationSideBar/>
            </div>
            <main className="md:pl-[72px] h-full">
                <h1>Hello</h1>

            </main>
        </div>
    </>); 
}
 
export default SetupPage;