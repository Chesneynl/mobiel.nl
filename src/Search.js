import React, {useState, useEffect} from 'react';
import axios from "axios";
import styled from 'styled-components';
import Flight from './Flight';


function Search() {
    const Searchform = styled.div`
        background:#eee;
        padding:20px;
        margin-top:20px;
        display:block;
        margin-bottom:20px;
    `;

    const Formrow = styled.div`
        margin-bottom:20px;
    `;

    const Label = styled.label`
        font-size: 14px;
        margin-bottom:5px;
        display:block;
    `;

    const Select = styled.select`
        width:100%;
        padding:10px 5px;
    `;

    const Submit = styled.input.attrs({ 
        type: 'submit',
      })`
        background: #00d66c;
        color: #fff;
        cursor: pointer;
        text-transform: uppercase;
        width: 100%;
        border-radius: 5px;
        height: 35px;
        border-color: transparent;
        outline: none;
        text-align: center;
        &:hover {
            background-color: #0aad5c;
        }`

    const [flights, setFlights] = useState([]);
    const [resultTxt, setresultTxt] = useState("Vul hierboven het formulier in om te zoeken");
    const [inputs, setInputs] = useState([]);

    const getData = (querystring, priceReverse) => {

        if (querystring !== "") { 
            const config = {
                headers: {
                    apikey: "dd2282f9e1084d51b53d257760d78aed",
                }
            }
    
            axios.get(`https://api.transavia.com/v1/flightoffers/` + querystring + "&limit=20", config)
            .then((res) => {
                let flights = res.data.flightOffer;

                if (priceReverse) { 
                    flights = flights.reverse();
                }

                setresultTxt("");
                setFlights(flights);
            }, (error) => {
                setFlights([]);
                setresultTxt(error.message);
            });
        }
    }

    const handleSubmit =  (e) => {
        e.preventDefault();

        var inputFields = e.target.elements;
        
        setInputs([
            {name: inputFields.Origin.name, value: inputFields.Origin.value},
            {name: inputFields.OriginDepartureDate.name, value: inputFields.OriginDepartureDate.value + "&" + inputFields.OriginDepartureDateRange.value},
            {name: inputFields.DaysAtDestination.name, value: inputFields.DaysAtDestination.value},
            {name: inputFields.OrderBy.name, value: inputFields.OrderBy.value},
        ]);
    }

    function dateConverter(value) {
        let new_date = value.replace(/-/g, "").replace("&", "-");

        return new_date;
    }


    useEffect(() => { 
        let querystring = "";
        let reverse     = false;

        inputs.forEach(function (input, key) {
            
            if (input.value !== "") {
                if (input.name === "OriginDepartureDate") {
                    input.value = dateConverter(input.value);
                }

                let delimiter = key===0 ? "?" : "&";

                if (input.name === "OrderBy" && input.value === "PriceReverse") {
                    input.value = "Price";
                    reverse     = true;
                }

                querystring +=  delimiter + input.name + "=" + input.value;
            }
        });

        getData(querystring, reverse);

    }, [inputs]);
    
    return (
        <div className="container">
            <Searchform>
                <form onSubmit={handleSubmit}>
                    <Formrow>
                        <Label>Vertrek luchthaven</Label>
                        <Select name="Origin">
                            <option value="RTM">Rotterdam</option>
                            <option value="AMS">Amsterdam</option>
                        </Select>
                    </Formrow>
                    <Formrow>
                        <Label>Vertrek datum van </Label>
                        <input type="date"  name="OriginDepartureDate"  />
                    </Formrow>
                    <Formrow>
                        <Label>Vertrek datum tot</Label>
                        <input type="date"  name="OriginDepartureDateRange"  />
                    </Formrow>
                    <Formrow>
                        <Label>Aantal overnachtingen</Label>
                        <input type="number"   name="DaysAtDestination" />
                    </Formrow>
                    <Formrow>
                        <Label>Sorteren op</Label>
                        <Select name="OrderBy">
                            <option value="Price">Prijs laag-hoog</option>
                            <option value="PriceReverse">Prijs hoog-laag</option>
                            <option value="OriginDepartureDate">Vertrekdatum</option>
                        </Select>
                    </Formrow>

                    <Submit type="submit" name="submit" value="Zoeken..."/>
                </form>
            </Searchform>
                {resultTxt}
                {flights.map((flight, index) => (    
                    <Flight key={index} price={flight.pricingInfoSum.totalPriceOnePassenger} airlineCompany={flight.outboundFlight.marketingAirline.companyShortName} departure={flight.outboundFlight.departureDateTime} arrival={flight.outboundFlight.arrivalDateTime}/>
                ))}
        </div>
    );
}

export default Search;