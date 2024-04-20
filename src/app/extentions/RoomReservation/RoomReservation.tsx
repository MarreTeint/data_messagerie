'use client'
import { registerSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { useState } from "react";

export default function RoomReservation(data: any){
    const schema = require('./schema.json');
    const [valid, setValid] = useState<any>({valid: false, errors: []});
    registerSchema(schema, "http://example.com/schema.json")

    const start = new Date(data.data.from);
    const end = new Date(data.data.to);

    validate("http://example.com/schema.json", data).then((result) => {
        setValid(result);
    });
    
    return (
        <div>
            <h1>Room Reservation</h1>
            {valid.valid?<p>Room reserved : {data.data.room} ({start.toString()} - {end.toString()})</p>:<p>Invalid reservation</p>}
        </div>
    );
}