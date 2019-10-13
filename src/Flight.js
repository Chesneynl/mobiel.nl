import React from 'react';
import styled from 'styled-components';
import "./App.css";


function Flight({airlineCompany, departure, arrival, price}) {

    const Flight = styled.div`
        width:100%;
        border-radius:5px;
        background:#eee;
        margin-bottom:15px;
        padding:20px 10px;
    `;

    return (
        <Flight>
            <h3>Maatschappij : {airlineCompany}</h3>
            <p>Vertekt op : {departure}</p>
            <p>Komt aan op : {arrival}</p>
            <p>Prijs : &euro; {price}</p>
        </Flight>
    );
}

export default Flight;