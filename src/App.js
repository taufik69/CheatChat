
import React, { useEffect, useState } from 'react'
import Registration from './pages/Registration';
import Login from './pages/Login';
import Home from './pages/Home';
import ResetPassword from './pages/ResetPassword';
import Chat from './pages/Chat';
import Notification from './pages/Notification';
import './Style.css'
import { BrowserRouter, Routes, Route, } from "react-router-dom"
import { IoCloudyNightOutline } from "react-icons/io5"
import { MdNightsStay } from 'react-icons/md'
import { getAuth, onAuthStateChanged } from "firebase/auth";

const App = () => {

  const auth = getAuth();
  let [darkmode, setdarkmode] = useState(false)
  let [contorlswitch, setcontorlswitch] = useState(false)

  // darkmode toggle button machanism
  const HandleNightmode = () => {
    setdarkmode(!darkmode)
  }

  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setcontorlswitch(true)
        // console.log('user alreay have:', user)
      } else {
        setcontorlswitch(false)
        setdarkmode(false)

      }
    });

  }, [])

  return (
    <>
      {/* <div className={darkmode ? "night" : "day"}> */}
      {/* 
      {contorlswitch &&

        <div className="darkmode" onClick={HandleNightmode}>
          {darkmode
            ?
            <span className='dayicon'> <IoCloudyNightOutline /> </span>
            :
            <span className='nighticon'><MdNightsStay /> </span>
          }
        </div>

      } */}


      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Registration />}> </Route>
          <Route path="/login" element={<Login />}> </Route>
          <Route path="/home" element={<Home />}> </Route>
          <Route path="/resetpassword" element={<ResetPassword />}> </Route>
          <Route path="/chat" element={<Chat />}> </Route>
          <Route path="/notification" element={<Notification />}> </Route>
        </Routes>
      </BrowserRouter>

      {/* </div> */}



    </>
  );
}


export default App
