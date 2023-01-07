import React, { useEffect, useState } from 'react';
import { FaHome } from 'react-icons/fa';
import { AiOutlineMessage } from 'react-icons/ai';
import { BsGear, BsBell } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import { BiCloudUpload } from 'react-icons/bi'
import { Modal, Box } from '@mui/material'
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Link } from 'react-router-dom'
import { getAuth, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getStorage, uploadString, ref, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as notificationRef, onValue} from "firebase/database";
import { useSelector , useDispatch } from 'react-redux';
import { notification } from '../Slices/NotificationSlice'; 



const LeftbarAll = (props) => {
    // const defaultSrc =
    //     "./assets/images/avatar.webp";

    const auth = getAuth();
    const storage = getStorage();
    const db = getDatabase();
    const dispatch = useDispatch();
    // const Navigate = useNavigate();
    let [displayName, setdisplayName] = useState('');
    const [open, setOpen] = useState(false);


    let [image, setImage] = useState();
    let [CropData,setCropData] = useState("#");
    let [cropper, setCropper] = useState();
    let [loading, setloading] = useState(false)
    let [rerender, setrerender] = useState(false);
    const [notificationStroage , setnotificationStroage] = useState([]);

    let HandleLogOut = () => {
        signOut(auth).then((user) => {
            console.log(user);
        }).catch((error) => {
            console.log('sign out error ', error)
        });
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // console.log(user)
                setdisplayName(user.displayName)

            } else {
                console.log('name does not found')
            }
        });
    }, [rerender]);


    // profile img functionality start 
    let handleClose = (() => {
        setOpen(!open)
    })


    // Profile picture method 

    const HandleprofilePicture = (e) => {

        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);

    }

    const getCropData = () => {
        if (typeof cropper !== "undefined") {
            setloading(true)

            const storageRef = ref(storage, auth.currentUser.uid);
            
            setCropData(cropper.getCroppedCanvas().toDataURL());

            const message4 = cropper.getCroppedCanvas().toDataURL();

            uploadString(storageRef, message4, 'data_url').then((snapshot) => {

                setloading(false)
                setImage('')
                setOpen(false)
                getDownloadURL(storageRef)
                    .then((url) => {
                        // console.log('storage uploading img download url', url)
                        updateProfile(auth.currentUser, {
                            photoURL: url
                        }).then(() => {
                            setrerender(!rerender)
                            console.log('profile updated')
                        }).catch((error) => {
                            console.log('profile updated Error', error)

                        });
                    })

            });


        }

    };

       // Fetching data form notification database using useEffect state
        
       useEffect(()=> {
        const starCountRef = notificationRef(db, 'Notification/');
        onValue(starCountRef, (snapshot) => {
            const NotificatinArr = [];
            snapshot.forEach(item => {
                NotificatinArr.push({
                AdminName: item.val().AdminName,
                GroupName: item.val().GroupName,
                GroupjoinMember: item.val().GroupjoinMember,
                GroupTagName: item.val().GroupTagName,
                })
            });
            setnotificationStroage(NotificatinArr);
            dispatch(notification(NotificatinArr.length));
        });
    },[])

    const dataset = useSelector((state)=> state.notification.Amount);
    

    return (

        <>

            < div className="leftall" >
                <div className="imgbox">
                    {!auth.currentUser.photoURL
                        ?
                        <img src="./assets/images/avatar.webp" alt="Profileimage" />
                        :
                        <img src={auth.currentUser.photoURL} alt="Profileimages" />

                    }
                    <div onClick={handleClose} className="overlay"  >
                        < BiCloudUpload />
                    </div>
                </div>
                <h1 style={{ color: '#ffff', marginTop: '20px' }} >{displayName} </h1>

                <div className="iconlist">
                    <ul>
                        <li className={props.active == 'home' && 'active'}>
                            <Link to='/home'>
                                <FaHome className='icon' />
                            </Link>

                        </li>
                        <li className={props.active == 'sms' && 'active'} >
                            <Link to='/chat'>
                                <AiOutlineMessage className='icon' />
                            </Link>

                        </li>
                        <li className={props.active == 'notification' && 'active'} > 
                        <Link to='/notification'>
                                 <BsBell className='icon' /> 
                        </Link>
                        <span className='notiAmount'>{dataset}</span>
                        

                        </li>
                        <li className={props.active == 'setting' && 'active'}> <BsGear className='icon' /> </li>
                        <li > <FiLogOut className='icon' onClick={HandleLogOut} /></li>
                    </ul>
                </div>
            </div >



            <Modal

                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box >
                    <div className='container_modal' >
                        <h1>Change the profile picture</h1>

                            {/* {!auth.currentUser.photoURL

                                ?
                                image
                                    ?
                                    <div className="img-preview"></div>
                                    :
                                    <img src="./assets/images/avatar.webp" alt="Profile images" />

                                :
                                image
                                    ?
                                    <div className="img-preview"></div>
                                    :
                                    <img src={auth.currentUser.photoURL} alt="Profile images" />
                                    


                            } */}

                    </div>



                    {/* cropper part jsx Start */}
                    <Cropper
                        style={{ height: 200, width: "50%", margin: "0 auto" }}
                        zoomTo={0.5}
                        initialAspectRatio={2}
                        preview=".img-preview"
                        src={image}
                        viewMode={1}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        checkOrientation={false}
                        onInitialized={(instance) => {
                            setCropper(instance);
                        }}
                        guides={true}
                    />
                    {/* cropper part jsx End */}

                    <input type="file" className='inputFiled' onChange={HandleprofilePicture} />
                        
                    {image ?

                        loading
                            ?
                            <>
                                <button className='uploding_btn '>Uploading <div className='loading'></div> </button>

                            </>

                            :
                            <button onClick={getCropData} className='uploding_btn'>
                                Upload profile image
                            </button>
                        :
                        ''
                    }

                </Box>
            </Modal>

        </>
    )
}


export default LeftbarAll