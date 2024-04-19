'use client'

export default function Page(){

    const ext = require('./ext.json');
    function UpdateExtention(ext: string, value: boolean){
        console.log(JSON.stringify({ext: ext, value: value}));
        fetch("/api/Extention", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ext: ext, value: value}),
        }).then((response) => response.json()).then((data) => {
            console.log(data);
        });
    }

    return (
        <div>
            <input type="checkbox" onChange={(event) => {UpdateExtention("RoomReservation", event.target.checked)}}/>Room Reservation
        </div>
    );
}