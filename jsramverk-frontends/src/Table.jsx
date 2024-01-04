import "./App.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { config } from './Constants';

const URL = config.url;
let arr = [];
let arrData = [];
let listRes;

function getToken() {
    return sessionStorage.getItem('token');
}

function getApikey() {
    return sessionStorage.getItem('apikey');
}

export default function Table({setOneMarker}) {
    let apiKey = getApikey();
    let token = getToken();
    const endpoint = `${URL}/graphql?api_key=${apiKey}`;


    const queryData = `{ Delays {
        OperationalTrainNumber, 
        LocationSignature, 
        FromLocation { LocationName }, 
        ToLocation { LocationName }, 
        AdvertisedTimeAtLocation, 
        EstimatedTimeAtLocation } }`;

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState([]);
    const [listitems, setListitems] = useState([]);


    useEffect(() => {
        setLoading(true);

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: queryData })
        })
            .then(response => response.json())
            .then(data => setResult(data.data.Delays))
        setLoading(false)
    }, [token, endpoint, queryData])

    // Function to change to one marker and one list item, then back to all
    function markerFunc(dataNumber, data, arr, arrData) {
        arr.push(dataNumber)
        arrData.push(data)

        if (arrData.includes(data) && arrData.length <= 1) {
            setListitems(arrData)
        } else {
            setListitems([]);
            arrData.splice(0, arrData.length)
        }

        if (arr.length%2 !== 0 && arr[arr.length-1] === arr[arr.length-2] && arr[arr.length-2] === arr[arr.length-3]) {
            return dataNumber
        } else if (arr.length%2 === 0 && arr[arr.length-1] === arr[arr.length-2]) {
            return null
        }
        return dataNumber
    }

    if (listitems.length === 0) {
        listRes = result;
    } else {
        listRes = listitems;
    }
        return (
                <div className="styled-table">
                    {loading ? 'Loading...' : (
                    <table>
                        <tbody>
                        <tr>
                            <th>Train number:</th>
                            <th>Current station:</th>
                            <th>Route:</th>
                            <th>Delay:</th>
                            <th>Add ticket:</th>
                        </tr>
                        {listRes.map((data, index) => {
                            if (data.FromLocation !== null) {
                            return (
                                <tr key={index}>
                                    <td style={{width: "22vh"}}><Link onClick={() => setOneMarker(markerFunc(data.OperationalTrainNumber, data, arr, arrData))} className="link">{data.OperationalTrainNumber}</Link></td>
                                    <td style={{width: "23vh"}}>{data.LocationSignature}</td>
                                    <td style={{width: "23vh"}}>{data.FromLocation ? data.FromLocation[0].LocationName + " → " : ""} {data.ToLocation ? data.ToLocation[0].LocationName : ""}</td>
                                    <td style={{width: "20vh"}}>{outputDelay(data)}</td>
                                    <td style={{width: "20vh"}}><Link to="/ticket" state={{ data: data }} className="link">+</Link></td>
                                </tr>
                            );
                        }
                            return "";
                        })}
                        </tbody>
                    </table>
                    )}
                </div>
            );
        }

        function outputDelay(item) {
            let advertised = new Date(item.AdvertisedTimeAtLocation);
            let estimated = new Date(item.EstimatedTimeAtLocation);
        
            const diff = Math.abs(estimated - advertised);
        
            return Math.floor(diff / (1000 * 60)) + " minutes";
        }
