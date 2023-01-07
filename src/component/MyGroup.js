import React, { useState, useEffect } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { Alert ,Box ,Modal,List,ListItem,ListItemAvatar,Avatar,ListItemText,Typography,Divider,Button} from '@mui/material'
import { getDatabase, ref, onValue ,remove ,set, push} from "firebase/database";
import { getAuth } from "firebase/auth";


const MyGroup = () => {

    const db = getDatabase()
    const auth = getAuth()

    const [Grouplistall, setGrouplistall] = useState([]);
    const [joinGroupRequest , setjoinGroupRequest] = useState([]);


    // Modal state 

    const [open, setOpen] = useState(false);

    const handleOpen = (Groupinfo) => {
        setOpen(true);
                
        //    Fetching data form want to join database        
        const starCountRef = ref(db, 'GroupJoinRequest/');
        onValue(starCountRef, (snapshot) => {
            let JoinRequestArr = [];
            snapshot.forEach((item)=> {
                
                if(item.val().AdminId == auth.currentUser.uid  && item.val().GroupId == Groupinfo.GroupId) {
                    JoinRequestArr.push({
                        GroupJoinRequestid:item.key,
                        GroupId: Groupinfo.GroupId,
                        AdminId: item.val().AdminId, 
                        AdminName:item.val().AdminName,                       
                        GroupName:item.val().GroupName,                       
                        GroupTagName:item.val().GroupTagName,                       
                        GroupjoinMember: item.val().GroupjoinMember,
                        GroupjoinMemberPhoto: item.val().GroupjoinMemberPhoto,
                        GroupjoinMemberid: item.val().GroupjoinMemberid,
                    })
                }                
            })
            setjoinGroupRequest(JoinRequestArr);
          });

    }
            
    const handleClose = () => setOpen(false);

    // Read data from Grouplist realtime database

    useEffect(() => {
        const starCountRef = ref(db, 'Grouplist/');
        onValue(starCountRef, (snapshot) => {
            const goruplsitArray = []
            snapshot.forEach((item) => {
                const groupitem = {
                    GroupId: item.key,
                    AdminId: item.val().AdminId,
                    AdminName: item.val().AdminName,
                    GroupName: item.val().GroupName,
                    GroupPhotourl: item.val().GroupPhotourl,
                    GroupTagName: item.val().GroupTagName,
                }
                goruplsitArray.push(groupitem)
            })
            setGrouplistall(goruplsitArray)
        });
    }, [])
    
    
    // HandleJoinRequesrReject button functionalatiy below

    const HandleJoinRequesrReject = (item) => {
        
        remove(ref(db,"GroupJoinRequest/" + item.GroupJoinRequestid));
    }

    // HandleAcceptRequest button functionality 

    const HandleAcceptRequest = (item) => {

        // console.log('HandleAcceptRequest item is :' , item);
        set(push(ref(db, 'GroupMember/')), {
            
            AdminId : item.AdminId,
            AdminName :item.AdminName,
            GroupId : item.GroupId,
            GroupName : item.GroupName,
            GroupTagName : item.GroupTagName,
            GroupjoinMember : item.GroupjoinMember,
            GroupjoinMemberPhoto : item.GroupjoinMemberPhoto,
            GroupjoinMemberid :item.GroupjoinMemberid,
            
          }).then(()=> {
            remove(ref(db,"GroupJoinRequest/" + item.GroupJoinRequestid));
          })
    }

    return (
        <>
            <div className="grouplist MyGroup">
                <BsThreeDotsVertical className='dots-iocn' />
                <h2 className="heading">My Groups</h2>

                {Grouplistall.map((item) => (
                    item.AdminId == auth.currentUser.uid &&
                    <>

                        <div className="box-content">
                            <div className="img">
                                <img src={item.GroupPhotourl} alt="grouplist profile images" />
                            </div>
                            <div className="title">
                                <h2>{item.GroupName}</h2>
                                <p>{item.GroupTagName}</p>
                            </div>
                            <div className="accept-btn">
                                <p className='date' style={{ paddingBottom: '10px' }}>1/3/2022</p>
                                <button  onClick={()=>handleOpen(item)} >Join request</button>
                            </div>
                        </div>

                        {/* modal part start */}

                        <Modal

                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                >
                                <Box sx={style}>
                                    
                                    {joinGroupRequest.map((item)=>(
                                        <>
                                            {/* <h1>{item. GroupjoinMember}</h1>
                                            <img src={item. GroupjoinMemberPhoto} alt="groupimage"  /> */}

                                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                            <ListItem alignItems="flex-start">

                                                <ListItemAvatar>
                                                <Avatar alt="Remy Sharp" src={item.GroupjoinMemberPhoto} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={item.GroupjoinMember}
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography
                                                                sx={{ display: 'inline' }}
                                                                component="span"
                                                                variant="body2"
                                                                color="text.primary"
                                                            >
                                                                {item.GroupjoinMember}
                                                            </Typography>
                                                            {
                                                                "        --Wants to join Group !"
                                                            }
                                                        </React.Fragment>
                                                   }
                                                />
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                                   
                                            <Button onClick={()=> HandleAcceptRequest(item)} style={{marginTop:'10px' , marginLeft:'70px'}} variant="contained" color="success">
                                                Accept
                                            </Button>

                                            <Button onClick={()=> HandleJoinRequesrReject(item)} style={{marginTop:'10px' , marginLeft:'20px'}} variant="contained" color="error">
                                             Reject
                                            </Button>                                                   
                                
                                        </List>
                                            
                                        </>                                
                                    ))}

                                            {joinGroupRequest.length == 0 &&
                                                <Alert style={{width:'100%'}} severity="info"> NO Groups  Request</Alert>
                                            }
                                </Box>

                            </Modal>
                        {/* modal part End */}

                    </>

                ))}

                {Grouplistall.length == 0 &&
                    <Alert style={{ margin: '50px ' }} severity="info"> NO Groups </Alert>
                }


            </div>

        </>
    )
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    height:'400px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflow:'scroll',
    overflowX :'hidden',
  };

export default MyGroup