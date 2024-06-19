"use client"
import { useModel } from "@/hooks/use-model-store";
import {
Dialog,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import {  useRouter } from "next/navigation";
import qs from "query-string"


const DeleteChannelModel = () => {
    const { isOpen, onClose, type, data} = useModel();
    const router = useRouter();

    const isModelOpen = isOpen && type === "deleteChannel";
    const { server, channel } = data;

    const [isLoading, setIsLoading] = useState(false);


    const onClick = async() => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })
            await axios.delete(url);
            onClose();
            //router.refresh(); not workingg
            window.location.reload(); // works
            router.push(`/servers/${server?.id}`)
            //router.push("/")
        } catch (error) {
            console.log(error);

        } finally{
            setIsLoading(false);
        }
    }


    return (  
        <>  
            <Dialog open={isModelOpen} onOpenChange={onClose}>
                <DialogContent className="bg-white text-black p-0 overflow-hidden">
                    <DialogHeader className="pt-8 px-6">
                        <DialogTitle className="text-2xl text-center font-bold">
                            Delete Channel
                        </DialogTitle>
                        <DialogDescription className="text-center text-zinc-500">
                            Are you sure you want to do this? <br/>
                            <span className="font-semibold text-indigo-500">#{channel?.name} </span>
                            will be permanently deleted!!!
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="bg-gray-100 px-6 py-4">
                        <div className="flex items-center justify-between w-full">
                            <Button 
                            disabled={isLoading}
                            onClick={()=>onClose()}
                            variant="ghost"
                            >
                                Cancel
                            </Button>
                            <Button
                            onClick={onClick}
                            disabled={isLoading}                  
                            variant="primary"
                            >
                                Confirm
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>

    );
}
 
export default DeleteChannelModel;