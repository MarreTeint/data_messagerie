'use client'

import { registerSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


function ErrorMessage(){
    return (
        <div className="text-red-500">
            <span>Message not aligned with schema</span>
        </div>
    );
}

export default function Message({ params }: { params: { slug: string } }) {
    const router = useRouter();
    const [data, setData] = useState({ 
        metadata: {title:"", sender:"", receiver:"", date:""}, 
        message: "", 
        previous: "",
        core_extentions:{
            "readed": false,
            "yes_no": {"question": "", "answer": false}, 
            "multiple_choice": {"question": "Which option do you prefer for lunch?","options": ["Sandwiches", "Salad", "Pizza"],"answer": "Sandwiches"},
            "time_selector": {"hour": 9, "minutes": 30},
            "color_selector": {"red": 128,"green": 0,"blue": 255}
        }
    });

    const [valid, setValid] = useState({valid: false, errors: []});

    // Verify that the message exists & put it in data
    useEffect(() => {
        try {
            const din = require(`./../../inbox/${params.slug}.json`);
            setData(din);
        } catch (e) {
            router.push('/404');
        }
    }, [router]);

    const schema = require('./../../schema.json');
    registerSchema(schema, "http://example.com/schema.json");
    // Validate message with schema
    useEffect(() => {
        validate("http://example.com/schema.json", data).then((result:any) => {
            setValid(result);
        });
        fetch(`/api/DataFiles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: params.slug, data: data })
        }).then(response => {
            if (response.ok) {
                console.log('Slug and data sent successfully');
            } else {
                console.log('Failed to send slug and data');
            }
        });
    }, [data]);

    // Check if I am the receiver or not
    const user = require('./../../user.json');
    const isReceiver = data.metadata.receiver === user.username;

    function MessageReaded(){
        if (isReceiver){
            setData({...data, core_extentions: {...data.core_extentions, readed: !data.core_extentions.readed}});
        }
    }
    
    function AnswerYN(answer: boolean){
        if (isReceiver){
            setData({...data, core_extentions: {...data.core_extentions, yes_no: {...data.core_extentions.yes_no, answer: answer}}});
        }
    }

    function AnswerMultiple(answer: string){
        if (isReceiver){
            setData({...data, core_extentions: {...data.core_extentions, multiple_choice: {...data.core_extentions.multiple_choice, answer: answer}}});
        }
    }

    function AnswerTime(answer: string){
        if (isReceiver){
            const dataAnswer = answer.split(":");
            setData({...data, core_extentions: {...data.core_extentions, time_selector: {hour: parseInt(dataAnswer[0]), minutes: parseInt(dataAnswer[1])}}});
        }
    }

    function AnswerColor(answer: string){
        if (isReceiver){
            const dataAnswer = answer.substring(1);
            setData({...data, core_extentions: {...data.core_extentions, color_selector: {red: parseInt(dataAnswer.substring(0, 2), 16), green: parseInt(dataAnswer.substring(2, 4), 16), blue: parseInt(dataAnswer.substring(4, 6), 16)}}});
        }
    }

    if (!data.metadata.title || !data.metadata.sender || !data.metadata.date || !data.message) {
        return null; // noting printed while loading
    }
    if (!valid.valid) {
        return <ErrorMessage/>;
    }

    const date = new Date(data.metadata.date);
    // set readed with data.core_extentions.readed
    
    return (
        <div>
            <hr />
            <div>
                from: {data.metadata.sender} {isReceiver ? null : <span>(me)</span>} - to: {data.metadata.receiver} {isReceiver ? <span>(me)</span> : null}
                <br />
                title: {data.metadata.title} - {date.toString()}
                <br /><hr />
                {data.message}
                <br /><hr />
            </div>

            {data.core_extentions !== undefined && data.core_extentions.readed !== undefined && (
                <div>
                    <label>Message readed: </label>
                    <input type="checkbox" checked={data.core_extentions.readed} onChange={() => MessageReaded()}/>
                </div>
            )}
            {data.core_extentions !== undefined && data.core_extentions.yes_no !== undefined && (
                <div>
                    <label>{data.core_extentions.yes_no.question}</label>
                    <br />
                    <input type="radio" name="answeryn" value="yes" checked={data.core_extentions.yes_no.answer}  onChange={() => AnswerYN(true)}/>
                    <label>Yes</label>
                    <input type="radio" name="answeryn" value="no" checked={!data.core_extentions.yes_no.answer && data.core_extentions.yes_no.answer != null}  onChange={() => AnswerYN(false)}/>
                    <label>No</label>
                </div>
            )}
            {data.core_extentions !== undefined && data.core_extentions.multiple_choice !== undefined && (
                <div>
                    <label>{data.core_extentions.multiple_choice.question}</label>
                    <br />
                    {data.core_extentions.multiple_choice.options.map((option: string) => (
                        <div key={option}>
                            <input type="radio" name="answer" value={option}  checked={data.core_extentions.multiple_choice.answer === option} onChange={() => AnswerMultiple(option)}/>
                            <label>{option}</label>
                        </div>
                    ))}
                </div>
            )}
            {data.core_extentions !== undefined && data.core_extentions.time_selector !== undefined && (
                <div>
                    <label>Time: </label>
                    <input type="time" value={String(data.core_extentions.time_selector.hour).padStart(2, '0')+':'+String(data.core_extentions.time_selector.minutes).padStart(2, '0')} onChange={(event) => AnswerTime(event.target.value)} />
                </div>
            )}
            {data.core_extentions !== undefined && data.core_extentions.color_selector !== undefined && (
                <div>
                    <label>Color: </label>
                    <input type="color" value={'#'+data.core_extentions.color_selector.red.toString(16).padStart(2, '0')+data.core_extentions.color_selector.green.toString(16).padStart(2, '0')+data.core_extentions.color_selector.blue.toString(16).padStart(2, '0')} onChange={(event) => AnswerColor(event.target.value)} />
                </div>
            )}
            <hr /><br />

            <Message params={{ slug: data.previous }} />
        </div>
    );
}
    