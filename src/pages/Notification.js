import React from 'react'
import { Grid } from '@mui/material'
import LeftbarAll from '../component/LeftbarAll'
import Search from '../component/Search'
import NotificationList from '../component/NotificationList'
const Notification = () => {
  return (
    <>
       <Grid container spacing={2}>
            <Grid item xs={2}>
                 <LeftbarAll active ='notification'/>
            </Grid>

            <Grid item xs={10}>
                <Search />
                <NotificationList/>
            </Grid>
         
         </Grid>
    </>
  )
}

export default Notification