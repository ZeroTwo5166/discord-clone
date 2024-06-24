import { DirectMessageSearch } from "@/components/directMessage/direct-message-search";
import { ServerSidebar } from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const PrivateLayout = async ({
    children
}: {
    children: React.ReactNode;
}) => {
    const profile = await currentProfile();

    if (!profile) {
        return auth().redirectToSignIn();
    }


    return (
        <div className="h-full">
            <div
                className="hidden fixed md:flex h-full w-60 z-20
             flex-col inset-y-0 bg-red-500">
                <DirectMessageSearch
                    data={[
                        {
                            type: "channel",
                            data: [
                                {
                                    name: "Check",
                                    id: "test"
                                }
                            ]
                        }
                    ]}
                />

            </div>
            <main className="h-full md:pl-60 bg-blue-400">
                {children}
            </main>
        </div>
    )
}

export default PrivateLayout;

