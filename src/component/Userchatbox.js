
import React, { useEffect ,useState} from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineSend, AiOutlineCamera } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { Modal, Box,Typography,Fade ,Button,LinearProgress} from '@mui/material'
import Backdrop from '@mui/material/Backdrop';
import SendIcon from '@mui/icons-material/Send';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { getStorage, ref as storeRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import moment from 'moment/moment';




const Userchatbox = () => {
    const auth = getAuth();
    const db = getDatabase();
    const storage = getStorage();

    const userinfo = useSelector((state) => state.ActiveSlice.Active);

    const [msg, setmsg] = useState('');
    const [msgStrogestate, setmsgStrogestate] = useState([]);
    const [Groupmsgstore , setGroupmsgstore] = useState([]);
    const [GroupExistMember , setGroupExistMember] = useState(null);


    // modal state below
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    // modal state above

    // images stroge state start

    const [image ,setimage] = useState(null);
    const [progress,setprogress] = useState(null);

    let HandleinputMsg = (event) => {
        setmsg(event.target.value)
    }

    let HandleSendMsg = () => {

        if (msg != '') {
            // console.log(msg);
            if (userinfo.status == 'singlemsg') {                
                const postmsgRef = ref(db, 'Singlemsg/')
                set(push(postmsgRef), {
                    whoSendId: auth.currentUser.uid,
                    whoSendName: auth.currentUser.displayName,
                    whoRecivedId: userinfo.id,
                    whoRecivedName: userinfo.name,
                    msg: msg,

                    date : `
                            ${new Date().getFullYear()}- 
                            ${new Date().getMonth() + 1}- 
                            ${new Date().getDate()} 
                            ${new Date().getHours()}:
                            ${new Date().getMinutes()}:
                            ${new Date().getSeconds()}

                        `

                }).then(() => {
                    setmsg('')
                })


            } else {
                console.log('group message...');
                const postmsgRef = ref(db, 'Groupmsg/')
                set(push(postmsgRef), {
                    whoSendId: auth.currentUser.uid,
                    whoSendName: auth.currentUser.displayName,
                    RecivedGroupId: userinfo.GroupKey,
                    RecivedGroupName: userinfo.GroupName,
                    msg: msg,

                    date : `
                            ${new Date().getFullYear()}- 
                            ${new Date().getMonth() + 1}- 
                            ${new Date().getDate()} 
                            ${new Date().getHours()}:
                            ${new Date().getMinutes()}:
                            ${new Date().getSeconds()}

                        `

                }).then(() => {
                    setmsg('');
                })
            }
        }
    }


    // Fetching data from Active slice 

    useEffect(()=> {
       if(userinfo.status  == 'Groupmsg'){
           
            // now fetching data from groupmember section

            const starCountRef = ref(db, 'GroupMember/');
            
            onValue(starCountRef, (snapshot) => {
                snapshot.forEach((item) => {
                    if(auth.currentUser.uid == item.val().AdminId && userinfo.GroupKey == item.val().GroupId  || auth.currentUser.uid == item.val().GroupjoinMemberid && userinfo.GroupKey == item.val().GroupId){
                        setGroupExistMember(userinfo.GroupKey);
                    }                 
                })
                
                
            })

        }
        
    },[userinfo])

    // Fetching data from single message database zone
    useEffect(() => {

        const starCountRef = ref(db, 'Singlemsg/');
        onValue(starCountRef, (snapshot) => {
            let msgStroge = []

            snapshot.forEach((item) => {

                if (item.val().whoSendId == auth.currentUser.uid && item.val().whoRecivedId == userinfo.id || item.val().whoSendId == userinfo.id && item.val().whoRecivedId == auth.currentUser.uid) {

                    msgStroge.push(item.val())
                }
            })

            setmsgStrogestate(msgStroge)
        })

    }, [userinfo.id])



    // Fetching data from group message database Zone

    useEffect(() => {        
        const starCountRef = ref(db, 'Groupmsg/');
        onValue(starCountRef, (snapshot) => {
            const GroupmsgArr = [];
            snapshot.forEach((item) => {
                GroupmsgArr.push({
                    RecivedGroupId : item.val().RecivedGroupId,
                    RecivedGroupName : item.val().RecivedGroupName,
                    date : item.val().date,
                    msg : item.val().msg,
                    whoSendId : item.val().whoSendId,
                    whoSendName : item.val().whoSendName,
                    ChatImg : item.val().ChatImg,
                    
                })
            })

            setGroupmsgstore(GroupmsgArr);            
        });        
    },[])

    // Handle upload image functionality start .. input part 

    const HandleUploadImage = (event) => {
        setimage(event.target.files[0])
        
    }
    // console.log(image)
    // image send button funtionality start 

    const HandleSendImage = ()  => {
        const storageRef = storeRef(storage, 'Chatimages/'+image.name);
        const uploadTask = uploadBytesResumable(storageRef, image);
        // upload image on firebase stroage 

        uploadTask.on('state_changed', 
            (snapshot) => {

                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // console.log('Upload is ' + progress + '% done');
                setprogress(progress)
                
            }, 

            (error) => {
                // console.log('iamge upload failed ' ,error)
            }, 
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                
                
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);

                // trough image on firebase realtime database

                if (image != '') {
                    
                    if (userinfo.status == 'singlemsg') {        
                        console.log('single message')
                        const postmsgRef = ref(db, 'Singlemsg')
                        set(push(postmsgRef), {
                            whoSendId: auth.currentUser.uid,
                            whoSendName: auth.currentUser.displayName,
                            whoRecivedId: userinfo.id,
                            whoRecivedName: userinfo.name,
                            ChatImg :downloadURL,
                            date : `
                            ${new Date().getFullYear()}- 
                            ${new Date().getMonth() + 1 }- 
                            ${new Date().getDate()}  
                            ${new Date().getHours()}:
                            ${new Date().getMinutes()}:
                            ${new Date().getSeconds()}`
                        }).then(() => {                            
                            setimage(null);
                            setprogress(null);
                            handleClose(false);
                        })
        
        
                    } else {
                        console.log('Grouop message images');     
                        const postmsgRef = ref(db, 'Groupmsg')
                        set(push(postmsgRef), {
                            whoSendId: auth.currentUser.uid,
                            whoSendName: auth.currentUser.displayName,
                            // whoRecivedGroupKey: userinfo.GroupKey,
                            // whoRecivedGroupName: userinfo.GroupName,
                            ChatImg :downloadURL,
                            date : `
                            ${new Date().getFullYear()}- 
                            ${new Date().getMonth() + 1 }- 
                            ${new Date().getDate()}  
                            ${new Date().getHours()}:
                            ${new Date().getMinutes()}:
                            ${new Date().getSeconds()}`
                        }).then(() => {                            
                            setimage(null);
                            setprogress(null);
                            handleClose(false);
                        })
                                               
                    }
                }

                // through image and some data to realtime databas 

                });
                
            }
            );

    }

    // console.log('msgStrogestate' , msgStrogestate)

    return (

        <>
            <div className="full_chatbox">
                <div className="topArea">
                    <div className="userimg">
                        <img src="../assets/images/r4.png" alt="user img" />
                    </div>

                    <div className="username">

                        {
                            userinfo.status == "Groupmsg" 
                            ?                            
                                <h2>{userinfo.GroupName}</h2>                                                        
                            :                        
                            <h2>{userinfo.name}</h2>                            
                        }

                        <p>Online</p>

                    </div>

                    <div className="dot">
                        <BsThreeDotsVertical className="dots" />
                    </div>
                </div>



                <div className="chat">

                    {userinfo.status == 'Groupmsg' ?
                        
                        Groupmsgstore.map((item) => (

                            item.whoSendId == auth.currentUser.uid ?

                            item.RecivedGroupId == userinfo.GroupKey &&
                            (
                                item.msg ?
                                (
                                    
                                <div className="msg" style={alignSend}>
                                    
                                    <p style={msgSend}>{item.msg}</p>                                    
                                    <h5 className='whoSendName'>{item.whoSendName}</h5>                                    
                                    <p className="date" >{moment(item.date, "YYYYMMDD hh:mm:ss").fromNow()}</p>
                                </div>
                                )

                                    : //this  is item.msg statement colon
                                    
                                (  
                                 <div className="msg" style={alignSend}>                
                                    <div className="chatimg">
                                    
                                    <img src={item.ChatImg} alt="chat_image" />
                                    </div>
                                   <p className="date" style={datesend}>{moment(item.date, "YYYYMMDD hh:mm:ss").fromNow()}</p>
    
                                 </div>
                                )
                            )
                            
                                                         
                                :  // this colon in item.whoSendId  == auth.currentUser.uid 

                                item.RecivedGroupId == userinfo.GroupKey &&
                                
                                    item.msg ?
                                    
                                    (
                                      
                                        <div className="msg" style={alignRecived}>
                                        <p style={msgRecived}>{item.msg}</p>
                                        <h5 className='whorecivedName'>{item.whoSendName}</h5> 
                                        <p className="date">{moment(item.date, "YYYYMMDD hh:mm:ss").fromNow()}</p>
                                        </div>
                                    )
                                    : // this colon item.msg portion
                                    (
                                        <div className="msg" style={alignRecived}>                
                                        <div className="chatimg">
                                        <img src={item.ChatImg} alt="chat_image" />
                                        </div>
                                       <p className="date" style={dateRecived}>{moment(item.date, "YYYYMMDD hh:mm:ss").fromNow()}</p>
        
                                     </div>
                                     )
                                
                                
                                                                    
                        ))
                        
                        : 

                        msgStrogestate.map((item) => (

                            item.whoSendId == auth.currentUser.uid ?
    
                            item.msg ?
                                (
                                <div className="msg" style={alignSend}>
                                    <p style={msgSend}>{item.msg}</p>
                                    <p className="date" >{moment(item.date, "YYYYMMDD hh:mm:ss").fromNow()}</p>
                                </div>
                                )
                                    :
                                (  
                                 <div className="msg" style={alignSend}>                
                                    <div className="chatimg">
                                    <img src={item.ChatImg} alt="chat_image" />
                                    </div>
                                   <p className="date" style={datesend}>{moment(item.date, "YYYYMMDD hh:mm:ss").fromNow()}</p>
    
                                 </div>)
                                 
                           
                                :
                                item.msg ?
                                (
                                  
                                    <div className="msg" style={alignRecived}>
                                    <p style={msgRecived}>{item.msg}</p>
                                    <p className="date">{moment(item.date, "YYYYMMDD hh:mm:ss").fromNow()}</p>
                                    </div>
                                )
                                :
                                (
                                    <div className="msg" style={alignRecived}>                
                                    <div className="chatimg">
                                    <img src={item.ChatImg} alt="chat_image" />
                                    </div>
                                   <p className="date" style={dateRecived}>{moment(item.date, "YYYYMMDD hh:mm:ss").fromNow()}</p>
    
                                 </div>
                                 )
                                
                                
    
                        ))
                    }

                    


                </div>
                
                {  userinfo.status == 'Groupmsg' ?

                    userinfo.GroupKey == GroupExistMember ?
                    (
                        <div className="msgsendArea">
                            <input type="text" placeholder='Message' value={msg} onChange={HandleinputMsg} />
                            <AiOutlineCamera className='cemera' onClick={handleOpen} />

                            <div className="sendIcon" onClick={() => HandleSendMsg()} >
                                <AiOutlineSend className='sendmainiocn' />
                            </div>
                        </div>
                    )
                    
                    :

                    (

                        <div className="msgsendArea">
                            <input type="text" placeholder='Message' 
                            
                            style=
                            {
                                {backgroundColor: userinfo.status == "Groupmsg" && 'red', color:'white',fontSize:'18px',marginBottom:'20px  '}
                                
                            } 

                            value= {`  You are not ${userinfo.GroupName
                            } Eligible for Group Message. First join Group`} 

                            />
                            <AiOutlineCamera className='cemera' 
                            
                            style=
                            {
                                {color: userinfo.status == "Groupmsg" && 'white'}
                                
                            } 
                            
                            />

                            <div className="sendIcon"  >
                                <AiOutlineSend className='sendmainiocn' />
                            </div>
                        </div>
                    )

                    :

                    (
                        
                            <div className="msgsendArea">
                                <input type="text" placeholder='Message' value={msg} onChange={HandleinputMsg} />
                                <AiOutlineCamera className='cemera' onClick={handleOpen} />
    
                                <div className="sendIcon" onClick={() => HandleSendMsg()} >
                                    <AiOutlineSend className='sendmainiocn' />
                                </div>
                            </div>
                        
                    )
                }

                
                {/* Modal part jsx start  */}

                <Modal
                    aria-labelledby="spring-modal-title"
                    aria-describedby="spring-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Fade in={open}>
                    <Box sx={style}>
                        <Typography id="spring-modal-title" variant="h6" component="h2">
                        Send photos
                        </Typography>
                        <>
                            <input  style={{marginTop:'10px'}} type="file" onChange={HandleUploadImage}/>
                            {
                                progress > 0
                                &&
                            <LinearProgress style={{marginTop: '10px'}} variant="buffer" value={progress}  />
                            }
                            
                            <Button  style={{marginTop:'14px'}}variant="contained" endIcon={<SendIcon />} onClick={HandleSendImage}>
                                Send 
                            </Button>
                        </>
                      
                    </Box>
                    </Fade>
                </Modal>
                {/* Modal part jsx End  */}
            </div>
        </>

    )
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const msgRecived = {
    background: '#F1F1F1',
    position: 'absolute',
    marginRight: '25px',
    left: '14px',
    bottom: '49px',

}

const msgSend = {

    background: '#5F35F5',
    color: '#fff',
    marginRight: '25px',
    position: 'absolute',
    right: '-14px',
    bottom: '49px',
}

const datesend = {
    position: 'absolute',
    right: '-23px',
    bottom: '-40px',
    marginBottom: '3px',
}

const dateRecived = {
    position: 'absolute',
    left: '0px',
    bottom: '-40px'
}
const alignRecived = {
    justifyContent: 'flex-start'
}

const alignSend = {
    justifyContent: 'flex-end',

}






export default Userchatbox