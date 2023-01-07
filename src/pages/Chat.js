import React from "react"
import { Grid } from '@mui/material'
import LeftbarAll from "../component/LeftbarAll"
import GroupLIst from "../component/GroupLIst"
import Friend from "../component/Friend"
import Search from "../component/Search"
import ChatGrouplist from "../component/ChatGrouplist"
import Userchatbox from "../component/Userchatbox"


const Chat = (props) => {



    return (
        <Grid container spacing={2}>
            <Grid item xs={2}>
                <LeftbarAll active='sms' />
            </Grid>

            <Grid item xs={4}>
                <Search />
                <ChatGrouplist />
                <Friend item='button' />
            </Grid>

            <Grid item xs={6}>
                <Userchatbox item='button' />
            </Grid>

        </Grid>


    )

}

export default Chat