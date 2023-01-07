import React, { useEffect } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useState } from 'react';
import { FaUserFriends } from 'react-icons/fa'
import { getAuth } from "firebase/auth";


const Userlist = () => {
    const auth = getAuth();
    let [userlistitem, setuserlistitem] = useState([]);
    let [frdrequestlist, setfrdrequestlist] = useState([]);
    let [friend, setfriend] = useState([]);
    let [ChangereRender, setChangereRender] = useState(false);

    const db = getDatabase();


    useEffect(() => {
        let userArray = [];
        const userRef = ref(db, 'users/');
        onValue(userRef, (snapshot) => {
            snapshot.forEach((item) => {
                userArray.push({
                    username: item.val().username,
                    email: item.val().email,
                    id: item.key
                });
            })
            setuserlistitem(userArray);
        });
    }, [])


    let HandleFriendRequest = (info) => {
        set(push(ref(db, 'Friendrequest/')), {
            sendername: auth.currentUser.displayName,
            senderId: auth.currentUser.uid,
            reciverId: info.id,
            recivername: info.username,
        });
        setChangereRender(!ChangereRender);
    }


    useEffect(() => {

        const FriendrequestRef = ref(db, 'Friendrequest/');
        onValue(FriendrequestRef, (snapshot) => {
            let FriendrequestArray = []
            snapshot.forEach((item) => {

                FriendrequestArray.push(item.val().reciverId + item.val().senderId)

            })
            setfrdrequestlist(FriendrequestArray)

        });
    }, [ChangereRender])

    // console.log('setfrdrequestlist', frdrequestlist)

    useEffect(() => {

        let FriendArray = []
        const FriendstRef = ref(db, 'Friends/');
        onValue(FriendstRef, (snapshot) => {
            snapshot.forEach((item) => {

                FriendArray.push(item.val().reciverId + item.val().senderId)

            })
            setfriend(FriendArray)

        });
    }, [])

    // console.log('userlistitem', userlistitem)
    return (
        <div className="grouplist friendlist friend">
            <BsThreeDotsVertical className='dots-iocn' />
            <h2 className="heading">User List</h2>


            {userlistitem.map((item) => (
                auth.currentUser.uid !== item.id &&
                <div className="box-content">
                    <div className="img">
                        <img src="./assets/images/r7.png" alt="grouplist profile images" />
                    </div>
                    <div className="title">
                        <h2> {item.username} </h2>
                        <p>{item.email}</p>

                    </div>

                    {friend.includes(item.id + auth.currentUser.uid) || friend.includes(auth.currentUser.uid + item.id)
                        ?
                        <div className="accept-btn uselistbtn">
                            <button> <FaUserFriends /> </button>
                        </div>
                        :

                        frdrequestlist.includes(item.id + auth.currentUser.uid) || frdrequestlist.includes(auth.currentUser.uid + item.id) ?

                            <div className="accept-btn uselistbtn">
                                <button> &rarr; </button>
                            </div>
                            :
                            <div onClick={() => HandleFriendRequest(item)} className="accept-btn uselistbtn">
                                <button >+</button>
                            </div>
                    }

                </div>


            ))}

        </div>
    )
}

export default Userlist