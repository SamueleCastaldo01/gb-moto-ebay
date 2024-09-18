import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';


function Homepage ()  {

    localStorage.setItem("naviBottom", 0);

    let navigate = useNavigate();
  


    return (
        <>
{/**************NAVBAR MOBILE*************************************** */}
    <div className='navMobile row'>
      <div className='col-2'>
      </div>
      <div className='col' style={{padding: 0}}>
      <p className='navText'> GB Motoricambi Ebay </p>
      </div>
      </div>

      <motion.div
        initial= {{opacity: 0}}
        animate= {{opacity: 1}}
        transition={{ duration: 0.7 }}>
      <div className='container' style={{textAlign: "center", marginTop: "160px"}}>



      </div>

      </motion.div>
        </>
    )

}

export default Homepage 
