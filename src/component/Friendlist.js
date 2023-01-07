import React, { useState } from 'react'
import { useEffect } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import { Alert } from '@mui/material';
const Friendlist = () => {
    const auth = getAuth();
    const db = getDatabase();
    let [frdrequestlist, setfrdrequestlist] = useState([]);
    let [frdreqRerender, setfrdreqRerender] = useState(true);


    useEffect(() => {
        
        const FriendrequestRef = ref(db, 'Friendrequest/');
        onValue(FriendrequestRef, (snapshot) => {
            let FriendrequestArray = [];
            snapshot.forEach((item) => {
                if (item.val().reciverId == auth.currentUser.uid) {
                    FriendrequestArray.push({
                        Friendrequestid: item.key,
                        sendername: item.val().sendername,
                        senderId: item.val().senderId,
                        reciverId: item.val().reciverId,
                        recivername: item.val().recivername
                    })
                }

            })
            setfrdrequestlist(FriendrequestArray)
        });

    }, [frdreqRerender])

    // Accept friend request function 

    const HandleAceept = (acceptitem) => {
        // console.log('whole accept item', acceptitem)
        set(push(ref(db, 'Friends/')), {
            Friendrequestid: acceptitem.Friendrequestid,
            sendername: acceptitem.sendername,
            senderId: acceptitem.senderId,
            reciverId: acceptitem.reciverId,
            recivername: acceptitem.recivername,
            date: `${new Date().getDate()} / ${new Date().getMonth() + 1} / ${new Date().getFullYear()}`

        }).then(() => {
            remove(ref(db, 'Friendrequest/' + acceptitem.Friendrequestid))

        }).then(() => {
            setfrdreqRerender(!frdreqRerender);
        })

    }

    return (
        <div className="grouplist friendlist">
            <BsThreeDotsVertical className='dots-iocn' />
            <h2 className="heading">Friend Request</h2>

            {frdrequestlist.map((item) => (

                <div className="box-content">
                    <div className="img">
                        <img src="./assets/images/r7.png" alt="grouplist profile images" />
                    </div>

                    <div className="title">
                        <h2> {item.sendername}</h2>
                        <p>{item.reciverId}</p>
                    </div>


                    <div onClick={() => HandleAceept(item)} className="accept-btn">
                        <button>Accept</button>
                    </div>

                </div>


            ))}

            {frdrequestlist.length == 0 &&
                <Alert style={{ width: '80%', margin: '0 auto', marginTop: '20px' }} severity="info">No friend request</Alert>
            }

        </div>
    )
}

export default Friendlist