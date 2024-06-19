"use client"

import CreateServerModel from "@/components/models/create-server-model"
import { useEffect, useState } from "react"
import InviteModel from "@/components/models/invite-model"
import EditServerModel from "@/components/models/edit-server-model"
import MembersModel from "../models/members-model"

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
        </>
    )
}






