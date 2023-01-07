import React from 'react'
import { useState } from 'react'
import { Button, Grid, TextField, Collapse, Alert, IconButton, CloseIcon } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";

import { getDatabase, ref, set } from "firebase/database";

const Registration = () => {

    const auth = getAuth();
    const db = getDatabase();
    let navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    let [name, setName] = useState('');
    let [mail, setmail] = useState('');
    let [password, setpassword] = useState('');
    let [confrimpassword, setconfrimpassword] = useState('');

    let [nameError, setnameError] = useState('');
    let [mailError, setmailError] = useState('');
    let [passwordError, setpasswordError] = useState('');
    let [confrimpasswordError, setconfrimpasswordError] = useState('');

    let [passwordlengthError, setpasswordlengthError] = useState('');
    let [passwordMatchError, setpasswordMatchError] = useState('');

    let [emailExitstError, setemailExitstError] = useState('');



    // HandleSign event function body
    let HandleSign = (event) => {
        
        if (!name) {
            setnameError("Please enter your name ⚠");

        } else if (!mail) {
            setmailError("Please enter your Email ⚠");
            setnameError("");

        } else if (!password) {
            setpasswordError("Please enter your password❓");
            setmailError("");

        } else if (password.length <= 8) {
            setpasswordError("");
            setpasswordlengthError("Your password must be 8 or than upper❗❗");

        } else if (!confrimpassword) {
            setconfrimpasswordError("Please enter your confrim password⚡");
            setpasswordlengthError('');
            setpasswordError("");;

        } else if (password !== confrimpassword) {
            setpasswordMatchError("Does't match the Password");
            setpasswordlengthError('');
        } else {
            setconfrimpasswordError('');
            setpasswordlengthError('');
            setpasswordMatchError('');
            createUserWithEmailAndPassword(auth, mail, password).then((user) => {

                sendEmailVerification(auth.currentUser)
                    .then(() => {
                        console.log('mail send');
                        updateProfile(auth.currentUser, {
                            displayName: name,
                        }).then(() => {
                            console.log('name set');

                            set(ref(db, 'users/' + auth.currentUser.uid), {
                                username: name,
                                email: mail,


                            });

                        }).catch((error) => {
                            console.log(error, 'name doesnot sent')
                        });
                    });
                navigate('/login');
            }).catch((error) => {
                console.log(error);
                const errorCode = error.code;
                console.log(errorCode.includes('email'));
                console.log(errorCode.includes('user'));
                if (errorCode.includes('email')) {
                    setemailExitstError('Already this email is exists , please try another');
                    setOpen(true);
                }
            })

        }




    }
    return (
        <section className='registration-part'>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <div className="box" >
                        <div className="left">
                            <h1>Get started with easily register</h1>
                            <p>Free register and you can enjoy it</p>

                            {/* =========================================================*/}

                            <Collapse in={open}>
                                <Alert severity="error"
                                    action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                                setOpen(false);
                                            }}
                                        >
                                            {/* <CloseIcon fontSize="inherit" /> */}
                                            x
                                        </IconButton>
                                    }
                                    sx={{ mb: 2 }}
                                >
                                    {emailExitstError}
                                </Alert>
                            </Collapse>
                            {/* =========================================================*/}
                            <TextField
                                helperText={nameError}
                                id="demo-helper-text-aligned"
                                label="Enter Name"
                                type='text'
                                style={{ width: '100%' }}
                                onChange={(event) => setName(event.target.value)}
                            />
                            <br />
                            <TextField
                                helperText={mailError}
                                id="demo-helper-text-aligned"
                                label="Enter Email"
                                type='email'
                                style={{ width: '100%' }}
                                onChange={(event) => setmail(event.target.value)}
                            />
                            <br />
                            <TextField
                                helperText={passwordError ? passwordError : passwordlengthError ? passwordlengthError : ''}
                                id="demo-helper-text-aligned"
                                label="password"
                                type='password'
                                style={{ width: '100%' }}
                                onChange={(event) => setpassword(event.target.value)}
                            />
                            <br />
                            <TextField
                                helperText={confrimpasswordError ? confrimpasswordError : passwordMatchError ? passwordMatchError : ''}
                                id="demo-helper-text-aligned"
                                label="confrim password"
                                type='password'
                                style={{ width: '100%' }}
                                onChange={(event) => setconfrimpassword(event.target.value)}
                            />
                            <br />

                            <Button variant="contained" className='custombtn' onClick={HandleSign}>Sign in</Button>

                            <div className="linksign" style={{ margin: '0 35%', fontSize: '15px ', fontWeight: '600', color: '#03014C' }}>Already have an account ? <Link to='/login' style={{ color: '#EA6C00', fontWeight: '800', fontSize: '15px', marginLeft: '4px' }}> Log in</Link></div>
                        </div>
                    </div>
                </Grid>

                <Grid item xs={4}>
                    <div className="right">
                        <img src="./assets/images/registration.png" alt="registation image" style={{ height: '100vh' }} />
                    </div>
                </Grid>
            </Grid>
        </section >
    )
}

export default Registration