import React, { useEffect, useState } from 'react'
import { BsThreeDotsVertical, BsTypeH1 } from 'react-icons/bs'
import { Alert } from '@mui/material';
import { BiMessage } from 'react-icons/bi'
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue , set, push ,remove} from "firebase/database";
import { useDispatch } from 'react-redux'
import { ActiveChat } from '../Slices/ActiveSlice'
import { localeData } from 'moment';

const Friend = (props) => {

    const dispatch = useDispatch()
    
    const auth = getAuth();
    const [storefriend, setstorefriend] = useState([]);
    // const [blockClickmanage , setblockClickmanage ] = useState('')
    const db = getDatabase();


    useEffect(() => {
        const FriendsRef = ref(db, 'Friends/');
        onValue(FriendsRef, (snapshot) => {
            let friendstore = []
            snapshot.forEach((item) => {
                // console.log('current user and sender id', item.val().senderId == auth.currentUser.uid)
                // console.log('current user and reciver name ', item.val().recivername)
                if (auth.currentUser.uid == item.val().reciverId || item.val().senderId == auth.currentUser.uid
                ) {

                    friendstore.push({
                        id:item.key,
                        reciverId: item.val().reciverId,
                        senderId: item.val().senderId,
                        recivername: item.val().recivername,
                        sendername: item.val().sendername,
                        date: item.val().date,

                    })

                }
            })
            setstorefriend(friendstore)
        })

    }, [])


    // console.log('total friend list :' ,storefriend)
    // Reducure control via below function

    const HandleboxAction = (item) => {
        let userinfo = {}
        if (auth.currentUser.uid == item.reciverId )
        {
            
            // console.log('reciver don\'t need');
            userinfo.status = 'singlemsg';
            userinfo.id = item.senderId;
            userinfo.name = item.sendername;
        } else {
            console.log('reciver need');
            userinfo.status = 'singlemsg';
            userinfo.id = item.reciverId;
            userinfo.name = item.recivername;

        }

        dispatch(ActiveChat(userinfo));
    }

    // trough string in local strorage 
    // useEffect(()=> {
    //     window.localStorage.setItem('blockcontrol',JSON.stringify(blockClickmanage));
    // },[blockClickmanage])

    // // get done string from local stroage
    // let blockcrontroldata = () => {        
    //    const blockdatalocal =  JSON.parse(window.localStorage.getItem('blockcontrol'));                       
    // //    setblockClickmanage(blockdatalocal);

    //    console.log('from local stroage :',blockdatalocal)
    //  }

     
    // handle block funtionality start

    let HandleBlock = (item) => {
        // console.log('item key is:',item.id)

        if(item.reciverId == auth.currentUser.uid) {
            
            // avobe object send realtime database

            set(push(ref(db, 'Blockeduser/')), {

                block : item.sendername,
                blockby : item.recivername,
                blockbyId : item.reciverId,
                blockId : item.senderId,
                blockDate : `${new Date().getFullYear()} - ${new Date().getMonth() + 1} - ${new Date().getDate()}`,

            }).then(()=> {
                remove(ref(db, 'Friends/' + item.id));
            })
            // .then(()=> {
            //     setblockClickmanage('done');
            // }).then(()=> {
            //     // blockcrontroldata();
            //     console.log('from if conditon of handleblock function');
            // })

        }else{
            
            set(push(ref(db, 'Blockeduser/')), {

                block : item.recivername,
                blockId: item.reciverId,
                blockby : item.sendername,
                blockbyId:item.senderId,
                blockDate : `${new Date().getFullYear()} - ${new Date().getMonth() + 1} - ${new Date().getDate()}`,

            }).then(()=> {
                remove(ref(db , "Friends/" + item.id));
            })
            // .then(()=> {
            //     setblockClickmanage('done');
            // }).then(()=> {                
            //     // blockcrontroldata();
            //     console.log('from else condtion to handleblock function');
            // })
            
            
            
        }
                
    }

    

    return (
        <>
            <div className="grouplist  friend">
                <BsThreeDotsVertical className='dots-iocn' />
                <h2 className="heading"> {storefriend.length > 1 ? `${storefriend.length} Friends` : ` ${storefriend.length} Friend`}</h2>
                {storefriend.map((item) => (
                    
                    <div className="box-content" onClick={() =>     HandleboxAction(item)} >
                        <div className="img">
                            <img src="./assets/images/r4.png" alt="grouplist profile images" />
                        </div>
                        <div className="title">
                            {auth.currentUser.uid == item.reciverId 

                            ?(<h2>{item.sendername} </h2>)
                            
                            :
                            (<h2>{item.recivername} </h2> )   
                        }
                            
                            <p>Hi Guys, Wassup! from </p>
                        </div>
                        <div className="accept-btn">

                            {props.item == 'date'

                                ?
                                (
                                    <p className='date' style={{marginLeft :"15px"}}>{item.date}</p>
                                ) 

                                :

                                (
                                    <div className="accept-btn">
                                    <button > <BiMessage /> </button>
                                    </div>
                                )
                                
                            }

                            {/* {blockClickmanage == 'done' ? */}

                            {/* (
                                <div className="accept-btn">
                                    <button> Block </button>
                                </div>
                            )
                            : */}
                            
                                <div className="accept-btn" onClick={()=>HandleBlock(item)}>
                                    <button> Block </button>
                                </div>
                            
                            {/* } */}

                             

                        </div>

                    </div>

                    
                ))}


                {storefriend.length == 0 &&
                    <Alert style={{ margin: '50px ' }} severity="info"> NO Friends </Alert>
                }

            </div>
        </>

    )
}

export default Friend