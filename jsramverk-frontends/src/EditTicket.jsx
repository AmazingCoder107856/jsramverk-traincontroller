import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { config } from './Constants';

const URL = config.url;

function getToken() {
    return sessionStorage.getItem('token');
}

function getApikey() {
    return sessionStorage.getItem('apikey');
}


    const EditTicket = () => {
        let apiKey = getApikey();
        let token = getToken();

        const endpoint = `${URL}/graphql?api_key=${apiKey}`;


        const location = useLocation()
        const ticketData = location.state?.ticket
        let options = []
        const [result, setData] = useState([])

            useEffect(() => {
                let apiKey = getApikey();
                let token = getToken();
                const endpoint = `${URL}/graphql?api_key=${apiKey}`;
                const fetchInfo = () => {
                    const codesQuery = `{ Codes {
                        Code,
                        Level1Description,
                        Level2Description,
                        Level3Description
                    }}`;
                    return fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'x-access-token': token,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({ query: codesQuery })
                    })
                        .then((response) => response.json())
                        .then(d => setData(d.data.Codes)
                        )
                    }
                fetchInfo();
            }, []);

            result.map((code) => {
                options.push({
                    label: `${code.Code} - ${code.Level3Description}`,
                    value: `${code.Code}`
                })
                return options
            });

        const [selectedOption, setSelectedOption] = useState("first-option");

        const  handleDropdownChange = (event) => {
            setSelectedOption(event.target.value);
        }

        var updateTicket = `mutation{updateTicket(
            id: ${ticketData.id},
            code: "${selectedOption}",
            trainnumber: "${ticketData.trainnumber}",
            traindate: "${ticketData.traindate}"
            ){
                id
                code
                trainnumber
                traindate
            }}`;


    const handleSubmit = () => {
        if (selectedOption !== "first-option") {
            fetch(endpoint, {
                body: JSON.stringify({ query: updateTicket }),
                headers: {
                    'x-access-token': token,
                    "content-Type": "application/json"
                },
                method: "POST",
                })
                .then((response) => response.json())
                .then(() => {
                });
        }
    }

    return (
        <form action="/tickets" onSubmit={handleSubmit}>
            <h1>Update (#{ticketData.id}) for train: {ticketData.trainnumber}</h1>
            <h2>Please select new error code:</h2>
                <div className="pt-0 mb-3">
            <select value={selectedOption} onChange={handleDropdownChange}
            required>
                <option value="first-option">Choose an error code</option>
                {options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
            <div className="pt-0 mb-3">
            <button
                className="active:bg-blue-600 hover:shadow-lg focus:outline-none px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-blue-500 rounded shadow outline-none"
                type="submit"
            >
                update ticket
            </button>
            </div>
        </form>
    );
    };

    export default EditTicket;
