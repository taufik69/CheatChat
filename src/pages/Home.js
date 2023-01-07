import React, { useEffect, useState } from 'react'
import { Grid, Alert, AlertTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import LeftbarAll from '../component/LeftbarAll';
import Search from '../component/Search';
import GroupLIst from '../component/GroupLIst';
import Friendlist from '../component/Friendlist';
import Friend from '../component/Friend';
import Userlist from '../component/Userlist';
import MyGroup from '../component/MyGroup';
import BlockedUser from '../component/BlockedUser'
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Home = (props) => {

    let [userEmailVerification, setuserEmailVerification] = useState(false);

    const Navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // console.log(user)
                setuserEmailVerification(user.emailVerified)
            } else {
                Navigate('/login');
            }
        });
    }, []);

    return (

        <>
            {userEmailVerification ?

                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <LeftbarAll active='home' />
                    </Grid>

                    <Grid item xs={4}>
                        <Search />
                        <GroupLIst />
                        <Friendlist />
                    </Grid>

                    <Grid item xs={3}>
                        <Friend item='date' />
                        <MyGroup />
                    </Grid>

                    <Grid item xs={3}>
                        <Userlist />
                        <BlockedUser />
                    </Grid>

                </Grid>

                :
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <h1> </h1>
                    </Grid>

                    <Grid item xs={4}>
                        <Alert style={{ marginTop: '50px' }} severity="info">
                            <AlertTitle>Info</AlertTitle>
                            <strong>Please Check Your email and Verificaiton through your click </strong>
                        </Alert>
                    </Grid>

                    <Grid item xs={4}>
                        <h1></h1>
                    </Grid>

                </Grid>
            }

        </>


    )
}

export default Home