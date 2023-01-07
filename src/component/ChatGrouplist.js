import React, { useEffect } from 'react'
import { BiMessage } from 'react-icons/bi'
import { GrGroup} from 'react-icons/gr'
import { getDatabase, ref, onValue } from "firebase/database";
import { useState } from 'react';
import { ActiveChat } from '../Slices/ActiveSlice';
import { useDispatch } from 'react-redux';
import {Modal ,  Box ,List ,Avatar,ListItem ,ListItemAvatar,ListItemText,Typography, Divider ,Alert} from "@mui/material";
import { Info } from '@mui/icons-material';

const ChatGrouplist = () => {

    const db = getDatabase()
    const dispatch = useDispatch()

    const [GrouplistState, setGrouplistState] = useState([]);
    const [ApprovedGroupMemberlist , setApprovedGroupMemberlist ] = useState([]);

    // modal state 

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const [colorChange ,setcolorChange] = useState(true);


    const handleClose = () => {
        
        setcolorChange(true)
        setOpen(false);
    
    }


    useEffect(() => {
        let GrouplistArray = []
        const starCountRef = ref(db, 'Grouplist/');
        onValue(starCountRef, (snapshot) => {
            snapshot.forEach((item) => {
                const groupitem = {
                    Adminid: item.val().AdminId,
                    AdminName: item.val().AdminName,
                    GroupName: item.val().GroupName,
                    GroupPhotoURL: item.val().GroupPhotourl,
                    GroupTagName: item.val().GroupTagName,
                    GroupKey: item.key
                }
                GrouplistArray.push(groupitem)
            })
            setGrouplistState(GrouplistArray)

        });

    }, [])

    

    const HandleGrouplist = (item) => {
        // console.log('Group msg info ' , item);
        let userinfo = {}
        userinfo.status = 'Groupmsg';
        userinfo.GroupName = item.GroupName;
        userinfo.GroupKey = item.GroupKey;
        userinfo.Adminid = item.Adminid;
        userinfo.AdminName = item.AdminName;

        dispatch(ActiveChat(userinfo))
    }

    // HandleGroupMemberList funtionality start 

    const HandleGroupMemberList = (items) => {

        // console.log('Groupmemberlsit ' , items)
        const starCountRef = ref(db, 'GroupMember/');
        onValue(starCountRef, (snapshot) => {
           const ApprovedGroupMemberArr = [];
            snapshot.forEach((item)=> {
                if(items.GroupKey == item.val().GroupId) {
                    ApprovedGroupMemberArr.push({
                        GroupMemberkeys : item.key,
                        AdminId : item.val().AdminId,
                        AdminName : item.val().AdminName,
                        GroupId : item.val().GroupId,
                        GroupName : item.val().GroupName,
                        GroupTagName : item.val().GroupTagName,
                        GroupjoinMember : item.val().GroupjoinMember,
                        GroupjoinMemberPhoto : item.val().GroupjoinMemberPhoto,
                        GroupjoinMemberid : item.val().GroupjoinMemberid,                    
                    })
                }                
            })
            setApprovedGroupMemberlist(ApprovedGroupMemberArr);     
            
            handleOpen(true);
            setcolorChange(false);
    });

    }



    return (
        <>
            <div className="grouplist">

                <h2 className="heading">Group List</h2>

                {GrouplistState.map((item) => (

                    <div className="box-content" onClick={() => HandleGrouplist(item)}>

                        <div className="img">
                            <img src={item.GroupPhotoURL}  alt="Group photo"/>
                        </div>

                        <div className="title">
                            <h2>{item.GroupName}</h2>
                            <p> {item.GroupTagName} </p>
                        </div>

                        <div className="accept-btn">
                            <button > <BiMessage /> </button>
                        </div>

                        <div className="accept-btn"  onClick={()=> HandleGroupMemberList(item)}>
                            <button style={{backgroundColor: colorChange ?'#5F35F5' :'yellowGreen' }}> <GrGroup  /> </button>
                        </div>
                    </div>

                ))}


                {/* modal is here  */}

                <Modal

                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >
                    <Box sx={style}>
                       
                       {ApprovedGroupMemberlist.map((item)=> (

                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                                
                                                
                            <ListItem alignItems="flex-start">

                                <ListItemAvatar>
                                <Avatar alt="Cindy Baker" src={item.GroupjoinMemberPhoto} />
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
                                    
                                    </Typography >
                                    {' is a  member  of this group'}
                                    </React.Fragment>
                                }
                                />
                            </ListItem>

                            <Divider variant="inset" component="li" />

                            </List>
                       ))}
                       {ApprovedGroupMemberlist.length == 0 &&
                        <Alert severity="warning">NO Group Member Yet , Try  To Join !</Alert>
                       }
                    
                    </Box>

                </Modal>

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
    boxShadow: 24,
    p: 4,
  };

export default ChatGrouplist