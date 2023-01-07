import React from 'react'
import { Grid, TextField, Collapse, Alert, IconButton } from '@mui/material'
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from 'react';
import { getAuth } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {

    let image1 = '../assets/images/f1.jpg'
    let image2 = '../assets/images/f3.jpg'

    const auth = getAuth()
    const Navigate = useNavigate();
    const [email, setemail] = useState('')
    const [emailError, setemailError] = useState('')
    const [confrim, setconfrim] = useState(false)
    const [open, setOpen] = useState(false)
    let [wrongusername, setwrongusername] = useState('');

    const HandleforgetPassword = () => {

        if (!email) {
            setemailError('Please Enter your Email 📨')

        } else {
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    console.log('forgot password email send')
                    setconfrim(!confrim)
                    setTimeout(() => {

                        Navigate('/login', {
                            state: { checkmail: 'Please check your Given Email draftbox/inobox' }
                        })
                    }, 3000);
                })
                .catch((error) => {

                    console.log(error);
                    const codeError = error.code;
                    // console.log(codeError.includes('user'));
                    if (codeError.includes('user')) {
                        setwrongusername('Your Email is Wrong , Please Try Agin');
                        setOpen(true);

                    }

                })
        }

    }

    // handle close btn  functinality


    return (
        <>
            <Grid container className='resetpassword_body'>
                <Grid item xs={8}>
                    <div className="leftfp">
                        <img src={image1} alt="bg images" />

                    </div>
                </Grid>


                <Grid item xs={4}>

                    <img src={image2} className="secondimage" alt="bg images" />
                    <div className="rightfp">

                        <Collapse in={open}>
                            <Alert variant="filled" severity="error"
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
                                {wrongusername ? wrongusername : ''}
                            </Alert>
                        </Collapse>



                        <TextField className='forgot_input'
                            helperText={emailError}
                            variant="standard"
                            color="warning"
                            id="demo-helper-text-misaligned"
                            label="Your Email"
                            onChange={(e) => setemail(e.target.value)}
                        />

                        {confrim

                            ?
                            <button className='forgot_btn'>
                                Check Your Email
                            </button>
                            :
                            <button onClick={HandleforgetPassword} className='forgot_btn'>
                                Reset  password
                            </button>
                        }

                    </div>
                </Grid>
            </Grid>
        </>
    )
}

export default ResetPassword