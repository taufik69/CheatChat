import React, { useEffect, useState } from 'react'
import { Modal, Button, Box, TextField ,Fade,Backdrop,List,ListItem,ListItemAvatar,ListItemText,Typography,Divider,Avatar as Avatar2} from '@mui/material'
import { AiOutlineCloseSquare  } from 'react-icons/ai'
import {GrGroup} from 'react-icons/gr'
import Avatar from "react-avatar-edit";
import { Alert } from '@mui/material';
import { getDatabase, ref as ref_database, set, push, onValue } from "firebase/database";
import { getStorage, ref as ref_storage, uploadString, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

const GroupLIst = () => {

    const db = getDatabase();
    const auth = getAuth()
    const storage = getStorage();

    const [groupnameinput, setgroupnameinput] = useState('')
    const [tagname, settagname] = useState('')
    const [groupnameinputerror, setgroupnameinputerror] = useState('')
    const [tagnameError, settagnameError] = useState('')
    const [loading, setloading] = useState(false)
    const [open, setOpen] = useState(false);
    const [src] = useState(null)
    const [preview, setpreview] = useState(null)
    const [groupdatAall, setgroupdatAall] = useState([])
    const [realtime, setrealtime] = useState(false);
    const [GroupMemberlist , setGroupMemberlist] = useState([]);

    // for second modal 

   


    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const onclose = () => {
        setpreview(null)
    }

    // group image croping function
    const onCrop = (view) => {
        setpreview(view)
    }

    const HandleCreateGroup = () => {

        if (!groupnameinput) {
            setgroupnameinputerror('The Group Name Missing 👽')

        } else if (!tagname) {
            settagnameError('Must Nedd Tag Name 👽')
        }
        else {

            setgroupnameinput('')
            setgroupnameinputerror('')
            settagname('')
            settagnameError('')
            const storageRef = ref_storage(storage, 'Group_img ' + auth.currentUser.uid)
            const cropingimage = preview
            setloading(true)
            uploadString(storageRef, cropingimage, 'data_url').then((snapshot) => {
                // console.log('snapshot ', snapshot)
            }).then(() => {
                const starsRef = ref_storage(storageRef);
                getDownloadURL(starsRef)
                    .then((url) => {
                        // console.log('base 64 image download url succesfull 1st statge', url)
                        set(push(ref_database(db, 'Grouplist/')), {
                            GroupName: groupnameinput,
                            GroupTagName: tagname,
                            AdminId: auth.currentUser.uid,
                            AdminName: auth.currentUser.displayName,
                            GroupPhotourl: url
                        })
                    }).then(() => {
                        setTimeout(() => {
                            setpreview(null)
                            setOpen(false);
                            setloading(false)
                        }, 1000);
                        setrealtime(!realtime)
                        console.log('im charming form last state')
                    }).catch((error) => {
                        console.log('error from goDownloadURL', error)
                    })
            })
        }
    }
    // fething all data from data base
    useEffect(() => {
        const starCountRef = ref_database(db, 'Grouplist/');

        onValue(starCountRef, (snapshot) => {
            let groupAll = [];
            snapshot.forEach((item) => {
                let groupdata = {
                    GroupId: item.key,
                    AdminId: item.val().AdminId,
                    AdminName: item.val().AdminName,
                    GroupName: item.val().GroupName,
                    GroupPhotourl: item.val().GroupPhotourl,
                    GroupTagName: item.val().GroupTagName,
                }
                groupAll.push(groupdata)
            })
            setgroupdatAall(groupAll)
        });
    }, [realtime])

   

    const handlejoinBtn = (items) => {
        // console.log(`Grouprequest send elemetns : ${items.GroupId}`)

        set(push(ref_database(db, 'GroupJoinRequest/')), {

            AdminId: items.AdminId,
            AdminName:items.AdminName,
            GroupId: items.GroupId,
            GroupName:items.GroupName,
            GroupTagName:items.GroupTagName,
            GroupjoinMember: auth.currentUser.displayName,
            GroupjoinMemberid: auth.currentUser.uid,
            GroupjoinMemberPhoto: auth.currentUser.photoURL,

        }).then(() => {

            set(push(ref_database(db, 'Notification/')), {

            AdminId: items.AdminId,
            AdminName:items.AdminName,
            GroupId: items.GroupId,
            GroupName:items.GroupName,
            GroupTagName:items.GroupTagName,
            GroupjoinMember: auth.currentUser.displayName,
            GroupjoinMemberid: auth.currentUser.uid,
            GroupjoinMemberPhoto: auth.currentUser.photoURL,

                
            });

        })
    }

    // Fetching data from memberlsit realtime database using useEffect 

    useEffect(()=> {
        const starCountRef = ref_database(db, 'GroupMember/');
            onValue(starCountRef, (snapshot) => {
            const GroupMemberlistArr = [];
            snapshot.forEach((item)=> {
                if(item.val().GroupjoinMemberid == auth.currentUser.uid) {

                    GroupMemberlistArr.push(item.val().GroupId)
                }
            })     
            setGroupMemberlist(GroupMemberlistArr);               
        });
    },[])
    
    console.log('GroupMemberlist:' ,GroupMemberlist);


    

    return (
        <>
            <div className="grouplist">
                <div className="createBtn">
                    <button onClick={handleOpen}>Create Group</button>
                </div>
                <h2 className="heading">Group List</h2>
                {groupdatAall.map((items) => (
                    items.AdminId != auth.currentUser.uid &&
                    <div className="box-content">

                        <div className="img">
                            <img src={items.GroupPhotourl} alt="grouplist profile images" />
                        </div>

                        <div className="title">
                            <h2>{items.GroupName}</h2>
                            <p>{items.GroupTagName}</p>
                            <p>{items.GroupId}</p>
                        </div>

                        {GroupMemberlist.indexOf(items.GroupId) == -1 &&

                                <div className="accept-btn">
                                <button onClick={() => handlejoinBtn(items)}>Join</button>                            
                                </div>
                            
                            
                        }
                        
                    </div>

                ))}

                {groupdatAall.length == 0 &&
                    <Alert style={{ margin: '50px ' }} sehandleClose2verity="info"> NO Groups </Alert>
                }

                <Modal
                    hideBackdrop
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box className='ModalBoxgrouplist'>
                        <h2 >Fill up your groupI'll information</h2>
                        <Button onClick={handleClose}> <AiOutlineCloseSquare className='CloseBtn' /></Button>
                        <div className="upload_img">
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Avatar
                                    width={150}
                                    height={150}
                                    src={src}
                                    onCrop={onCrop}
                                    onClose={onclose}
                                />
                            </div>
                            {preview &&
                                <img style={{ marginTop: '10px' }} src={preview} alt="preview image" />
                            }

                        </div>

                        <div className="information">
                            <TextField
                                fullWidth label="Group Name"
                                className='inputfiled'
                                onChange={(e) => setgroupnameinput(e.target.value)}
                            />
                            <p className='showError'> {groupnameinputerror} </p>

                            <TextField
                                fullWidth label="Group TagLine"
                                className='inputfiled'
                                onChange={(e) => settagname(e.target.value)}
                            />
                            <p className='showError'> {tagnameError} </p>
                        </div>

                        {loading
                            ?
                            <>
                                <div onClick={HandleCreateGroup} className="createbtn2" >
                                    <button className='uploding_btn '>Creating Group<div style={{ right: '33%' }} className='loading'></div> </button>
                                </div>
                            </>
                            :
                            <>
                                <div onClick={HandleCreateGroup} className="createbtn2" >
                                    <button >Create Group</button>
                                </div>
                            </>
                        }
                    </Box>
                </Modal>

                
                
              
            </div>

        </>
    )
}

const style2 = {
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
  

export default GroupLIst