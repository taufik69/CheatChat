import React, { useEffect, useState } from 'react';
import {MdOutlineNotificationsActive} from 'react-icons/md';
import { getDatabase, ref, onValue} from "firebase/database";

const NotificationList = () => {
    const db = getDatabase();

    const [notificationStroage , setnotificationStroage] = useState([]);

    // Fetching data form notification database using useEffect state
        
    useEffect(()=> {
        const starCountRef = ref(db, 'Notification/');
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
        });
    },[])

    
  return (
    <>
    
    <div className="notificationField">
        {notificationStroage.map( item => (
            <div className="notification">
                <MdOutlineNotificationsActive className='noti_icon'/>
                <p className='notidetails'> Now you are member of {item.GroupName} and admin is {item.AdminName}</ p>
            </div>

        ))}

        
        
    </div>
    
    </>
  )
}

export default NotificationList