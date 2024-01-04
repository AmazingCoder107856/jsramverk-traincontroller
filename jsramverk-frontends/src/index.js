import React from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import TicketsForm from './TicketsForm.jsx';
// import Tickets from './Tickets.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Tickets from './Tickets.jsx'
import EditTicket from './EditTicket.jsx';
import reportWebVitals from './reportWebVitals';
import PrivateRoute from './PrivateRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        {/* <BrowserRouter basename="/~dadh22/editor/"> */}
        <BrowserRouter>
          <Routes>
        <Route exact path='/' element={<PrivateRoute/>}>
            <Route exact path='/' element={<div className="side-by-side"><App/></div>}/>
        </Route>
        <Route exact path='/ticket' element={<PrivateRoute/>}>
            <Route exact path='/ticket' element={<div className="tickets"><TicketsForm/><Tickets /></div>}/>
        </Route>
        <Route exact path='/tickets' element={<PrivateRoute/>}>
            <Route exact path='/tickets' element={<div className="tickets"><Tickets/></div>}/>
        </Route>
        <Route exact path='/edit' element={<PrivateRoute/>}>
            <Route exact path='/edit' element={<div className="tickets"><EditTicket/></div>}/>
        </Route>
          <Route exact path='/register' element={<div className="register"><Register/></div>} />
          <Route exact path='/login' element={<div className="login"><Login/></div>}/>
        </Routes>
    </BrowserRouter>
  </React.StrictMode>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
