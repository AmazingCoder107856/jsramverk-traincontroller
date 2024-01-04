import React, { useRef, useState, useEffect } from "react";
import Leaflet from "leaflet"
import "leaflet/dist/leaflet.css" 
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"
import markerRetina from "leaflet/dist/images/marker-icon-2x.png"
import { socket } from './socket';
import { config } from './Constants';

const URL = config.url;

function getToken() {
    return sessionStorage.getItem('token');
}

function getApikey() {
    return sessionStorage.getItem('apikey');
}

Leaflet.Icon.Default.mergeOptions({
    iconRetinaUrl: markerRetina,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
});

// Get list with train numbers
function getTrainNumbers(data) {
    let trainNumber = [];
    for (let i=0; i<data.length; i++) {
        if (!(trainNumber.includes(data[i].OperationalTrainNumber))) {
            trainNumber.push(data[i].OperationalTrainNumber);
        }
    }

    return trainNumber;
}

async function getDelayedTrains() {
    let apiKey = getApikey();
    let token = getToken();
    const response = await fetch(`${URL}/delayed?api_key=${apiKey}`, {headers: {'x-access-token': token}});
    const data = await response.json();
    const trainData = getTrainNumbers(data.data);

    return trainData;
}

const MapComponent = (oneMarker) => { 
    const mapRef = useRef();
    const zoom = 5;
    const containerStyle = {
        width: "100vh",
        height: "99.5vh"
    }
    const center = {
        lat: 62.173276,
        lng: 14.942265
    }

    const [markers, setMarkers] = useState([]);

    let allMarkers = [...markers];

    const [delayed, setDelayed] = useState([]);

    const [trains, setTrains] = useState([]);

    useEffect(() => {
        async function getDelayed() {
            const data = await getDelayedTrains();
            setDelayed(data);
        };

        getDelayed();
    }, []);


    useEffect(
        () => {
            socket.connect();
            socket.on("message", (data) => {
                setTrains(data);
            })
            
            return () => {
                socket.disconnect();
            }
            },
            []
        )

        if (delayed.includes(trains.trainnumber)) {
            if (markers.find(({trainnumber}) => trainnumber === `${trains.trainnumber}`)) {
                const index = markers.findIndex((marker) => marker.trainnumber === trains.trainnumber);

                // allMarkers = [...markers];
                markers[index]= { ...markers[index], position: trains.position };
                // setMarkers(allMarkers);
            } else {
                // allMarkers = [...markers];
                const marker = {
                    position: trains.position,
                    trainnumber: trains.trainnumber
                }
                allMarkers.push(marker);
                setMarkers(allMarkers);
            }
        }

    // socket.on("message", (data) => {

    // });

    console.log("antal markers ", markers)
    console.log(delayed)

    if (oneMarker.oneMarker !== null) {
        for (let i = 0; i < markers.length; i++) {
            if(String(markers[i].trainnumber) === String(oneMarker.oneMarker)) {
                let index = markers.indexOf(i);

                return (
                    <MapContainer
                        style={containerStyle}
                        center={center}
                        zoom={zoom}
                        scrollWheelZoom={true}
                        ref={mapRef}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {
                            <MarkerContent
                                key={index}
                                position={markers[i].position}
                                trainnumber={markers[i].trainnumber}
                            />
                        }
                    </MapContainer>
                );
            }
        }
    }

    return (
        <MapContainer
            style={containerStyle}
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            ref={mapRef}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((marker, index) => (
                <MarkerContent
                    key={index}
                    position={marker.position}
                    trainnumber={marker.trainnumber}
                />
            ))}
        </MapContainer>
    );
};

const MarkerContent = (props) => {
    const markerRef = useRef();

    const { position, trainnumber } = props;  

    return <Marker
        position={position}
        trainnumber={trainnumber}
        ref={markerRef}
    >
        <Popup>
            <b>{trainnumber}</b>
        </Popup>
    </Marker>
}

export default MapComponent;
