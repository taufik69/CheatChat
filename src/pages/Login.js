import React, { useState } from 'react'
import { Grid, TextField, Button, Collapse, Alert, IconButton } from '@mui/material'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import CloseIcon from '@mui/icons-material/Close';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { useEffect } from 'react';

const Login = () => {
    const auth = getAuth();
    const location = useLocation();

    const provider = new GoogleAuthProvider();
    const providerfb = new FacebookAuthProvider();
    const Navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    let [username, setusername] = useState('');
    let [logpass, setlogpass] = useState('');

    let [usernameError, setusernameError] = useState('');
    let [logpasswordError, setlogpasswordError] = useState('');
    let [typecheck, settypecheck] = useState(false);
    let [wrongusername, setwrongusername] = useState('');
    let [passwordmathchError, setpasswordmathchError] = useState('');
    let [locationstate, setlocationstate] = useState('')
    // let check ta conditon if inputfiled hava an any data..
    const HandleClick = () => {

        if (!username) {
            setusernameError('Please Enter a username');
        } else if (!logpass) {
            setlogpasswordError('Please Enter a password');
            setusernameError('');
        } else {
            setlogpasswordError('');
            signInWithEmailAndPassword(auth, username, logpass).then((user) => {
                console.log(user);
                Navigate('/home');
            }).catch((error) => {
                console.log(error);
                const codeError = error.code;
                // console.log(codeError.includes('user'));
                if (codeError.includes('user')) {
                    setwrongusername('Your Email is Wrong , Please Try Agin');
                    setOpen(true);

                } else if (codeError.includes('password')) {
                    setwrongusername('');
                    console.log(codeError.includes('password'))
                    setpasswordmathchError('incorrect password ,please check agin ')
                    setOpen(true);

                }

            })
        }
    }

    // eye handaling function

    let Handleeye = () => {
        settypecheck(!typecheck);
    }

    // sign in by google 
    let Handlegoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;

            }).catch((error) => {
                const errorCode = error.code;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);

            });


    }
    // login with facebook

    const Handlefb = () => {

        signInWithPopup(auth, providerfb)
            .then((result) => {
                const user = result.user;
                const credential = FacebookAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;

            })
            .catch((error) => {
                const errorCode = error.code;
                const email = error.customData.email;
                const credential = FacebookAuthProvider.credentialFromError(error);
            });
    }


    useEffect(() => {

        if (location.state !== null) {
            setlocationstate(location.state.checkmail)
            setOpen2(true)
        }
    }, [])

    // console.log('state is :', location.state)

    return (
        <section className="login-part">
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <div className="box">
                        <div className="log-left">
                            <h1>Login to your account!  </h1>

                            {/* =============================================================== */}

                            <Collapse in={open2}>
                                <Alert
                                    variant="filled" severity="error"
                                    action={
                                        <IconButton className='collaspe-btn'

                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                                setOpen2(false);
                                            }}
                                        >
                                            <CloseIcon fontSize="inherit" />

                                        </IconButton>
                                    }
                                    sx={{ mb: 2 }}
                                >
                                    {locationstate ? locationstate : ''}
                                </Alert>
                            </Collapse>
                            {/* =============================================================== */}
                            <div className="login-option d-flex">
                                <div style={{ cursor: 'pointer' }} className="google" onClick={Handlegoogle}> <img src="./assets/images/google.png" alt="facbook vector" /> Login with Google</div>
                                <div style={{ cursor: 'pointer' }} onClick={Handlefb} className="google">  <img src="./assets/images/fb.png" alt="google vector" /> Login with Facebook</div>
                            </div>
                            {/* =============================================================== */}

                            <Collapse in={open}>
                                <Alert
                                    variant="filled" severity="error"
                                    action={
                                        <IconButton className='collaspe-btn'
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                                setOpen(false);
                                            }}
                                        >
                                            <CloseIcon fontSize="inherit" />

                                        </IconButton>
                                    }
                                    sx={{ mb: 2 }}
                                >
                                    {wrongusername ? wrongusername : passwordmathchError && passwordmathchError}
                                </Alert>
                            </Collapse>
                            {/* =============================================================== */}
                            <TextField
                                helperText={usernameError}
                                id="demo-helper-text-aligned"
                                label="Username"
                                type='text'
                                onChange={(event) => setusername(event.target.value)}

                            />
                            <br />
                            <div className="eyebox">
                                <TextField
                                    helperText={logpasswordError}
                                    id="demo-helper-text-aligned"
                                    label="password"
                                    type={typecheck ? 'text' : 'password'}
                                    onChange={(event) => setlogpass(event.target.value)}


                                />
                                {typecheck
                                    ?
                                    <AiFillEye className='eye-icon' onClick={Handleeye} />
                                    :

                                    <AiFillEyeInvisible className='eye-icon' onClick={Handleeye} />
                                }
                            </div>
                            <br />
                            <Button variant="contained" color="success" onClick={HandleClick}>
                                Login to Continue
                            </Button>
                            <div className="linksign">Don’t have an account ? <Link to='/' style={{ color: '#EA6C00', fontWeight: '800', fontSize: '15px', marginLeft: '4px' }}> Sign up</Link></div>

                            <div > <Link to="/resetpassword" className='forgot_password'> Forgot Password   </Link></div>
                        </div>
                    </div>
                </Grid>

                <Grid item xs={4}>
                    <div className="right">
                        <img src="../assets/images/login.png" alt="login-image" />
                    </div>
                </Grid>

            </Grid>
        </section>
    )
}

export default Login