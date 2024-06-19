"use client"

import CreateServerModel from "@/components/models/create-server-model"
import { useEffect, useState } from "react"
import InviteModel from "@/components/models/invite-model"
import EditServerModel from "@/components/models/edit-server-model"
import MembersModel from "../models/members-model"
import CreateChannelModel from "../models/create-channel-model"
import LeaveServerModel from "../models/leave-server-model"
import DeleteServerModel from "../models/delete-server-model"
import DeleteChannelModel from "../models/delete-channel-model"

export const ModelProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(()=>{
        setIsMounted(true)
    }, [])

    return (
        <>
            <CreateServerModel/>
            <InviteModel/>
            <EditServerModel/>
            <MembersModel/>
            <CreateChannelModel/>
            <LeaveServerModel />
            <DeleteServerModel />
            <DeleteChannelModel/>
        </>
    )
}






