import React from 'react';
import './App.css';
import moment from 'moment/moment';
import 'moment/locale/it'
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate} from "react-router-dom";
import AnimateRoutes from './components/AnimateRoutes';
import BottomNavi from './components/BottomNavigation';
import Paper from '@mui/material/Paper';
import MuiBottomNavigationAction from "@mui/material/BottomNavigationAction";
import { BottomNavigation } from '@mui/material';
import { styled } from "@mui/material/styles";
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';

function App() {

  const [value, setValue] = React.useState(0);
  const [selectedPage, setSelectedPage] = useState('home'); // Stato iniziale selezionato


  const BottomNavigationAction = styled(MuiBottomNavigationAction)(`
  color: #f6f6f6;
`);

React.useEffect(() => {
  setValue("")
  console.log("sono entrato baby")
  console.log(localStorage.getItem("naviBottom"))

}, [value]);

  return (
<>

<Router>
<div className='container' style={{padding:"0px"}}>
 
<div className='container' style={{padding: "0px", marginTop:"60px"}}>
<AnimateRoutes />
</div>
</div>

<BottomNavi />

</Router>


</>
  );
}

export default App;
