import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { socket } from './socket';



const edit = require("./img/edit_icon.png")


let lockedTicket = { ticketId: 0 };

const Tickets = () => {

const [ticketList, setTicketList] = useState([]);

const Button = ({ onClick, children }) => {
    return (
        <div className="unlocked" type="button" onClick={onClick}>
            {children}
        </div>
    );
}

    const lockStatus = (current) => {
        socket.emit("lockSocket", current)
        lockedTicket.ticketId = current;
        };

useEffect(
    () => {
        socket.connect();
        socket.on("allTickets", (data) => {
            setTicketList(data);

        })

        return () => {
            socket.disconnect();
        }
        },
        []
    )

        return (
        <div>
            <Link to="/"><button id="1">Back to map</button></Link>
            <h1>Current tickets:</h1>
                {ticketList.map((ticket) => {

                    if (ticket.locked && lockedTicket.ticketId === ticket.id) {
                        return (
                            <div className="locked" key={ticket.id}>{ticket.id} - {ticket.code} - {ticket.trainnumber} - {ticket.traindate}
                            <Link to="/edit" state={{ ticket: ticket }} className="link"><img src={edit} width="15px" alt="edit"></img></Link></div>
                        );
                        }
                    else if (ticket.locked) {
                    return (
                        <div className="locked" key={ticket.id}>{ticket.id} - {ticket.code} - {ticket.trainnumber} - {ticket.traindate}
                        </div>
                    );
                    }
                    else {
                        return (
                        <Button onClick={() => { lockStatus(ticket.id)} } style={{fontSize: '20px'}} key={ticket.id}>{ticket.id} - {ticket.code} - {ticket.trainnumber} - {ticket.traindate}
                        </Button>
                        );
                    }
                })}
        </div>
        )

}
    export default Tickets;


