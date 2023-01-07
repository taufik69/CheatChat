import React, { useEffect ,useState} from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Alert } from '@mui/material';
import { getAuth } from "firebase/auth";
import { getDatabase, ref,set, onValue, remove, push} from "firebase/database";


const BlockedUser = () => {
    const auth = getAuth();
    const db = getDatabase();

    const [blockUser , setblockUser] = useState([])


    // Fetching object data in raltime database on blockuser section
    useEffect(() => {

        const starCountRef = ref(db, 'Blockeduser/');
        onValue(starCountRef, (snapshot) => {
            let blockuserlist = []
            snapshot.forEach((item) => {

                if(item.val().blockbyId == auth.currentUser.uid) {

                    const blockitem = {

                        id:item.key,
                        block : item.val().block,
                        blockDate : item.val().blockDate,
                        blockId : item.val().blockId,
                        blockbyId : item.val().blockbyId,
                       
                    }
                    blockuserlist.push(blockitem);
                } else if(auth.currentUser.uid == item.blockId){
                    
                    const blockitem = {

                        id:item.key,
                        blockDate : item.val().blockDate,                       
                        blockby : item.val().blockby,
                        blockbyId : item.val().blockbyId,
                    }
                    blockuserlist.push(blockitem);
                }
                
            })
            setblockUser(blockuserlist)
        });

    }, [])

    // console.log('all blocked user is :' , blockUser);

    // unBlock funtionality start

    let HandleUnBlock = (item) => {
        console.log('from unblock item :' , item)

        set(push(ref(db, 'Friends/')), {
            
            sendername : item.block,
            senderId :item.blockId,
            reciverId : auth.currentUser.uid,
            recivername : auth.currentUser.displayName,
            Friendrequestid : item.id,
            date : `${new Date().getFullYear() } - ${new Date().getMonth() + 1} - ${new Date().getDate()}`
            
          }).then(()=> {
            remove(ref(db, 'Blockeduser/' + item.id));
          })


    }

    return (
        <>

            <div className="grouplist MyGroup">
                <BsThreeDotsVertical className='dots-iocn' />

                <h2 className="heading">Blocked User</h2>

                    
                {blockUser.map((item)=> (

                    

                        <div className="box-content">
                            <div className="img">
                                <img src="./assets/images/r6.png" alt="grouplist profile images" />
                            </div>
                            <div className="title">
                                <h2>{item.block}</h2>
                                <p>You are blocked!</p>
                            </div>
                            {auth.currentUser.uid == item.blockbyId ?
                            (

                            <div className="accept-btn">
                                <p className='date' style={{ paddingBottom: '10px',marginLeft:'10px' }}>{item.blockDate}</p>
                                <button onClick={()=> HandleUnBlock(item)} >UnBlock</button>
                            </div>

                            )
                            :
                            ""
                        }
                            
                        </div>                        

                ))}

                {blockUser.length == 0 &&
                    <Alert style={{ margin: '50px ' }} severity="error"> NO Blocked Friends </Alert>
                }

            </div>

        </>
    )
}

export default BlockedUser