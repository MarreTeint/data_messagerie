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
    function MessageReaded(receiver: boolean){
        if (receiver){
            setReaded(!readed);
        }
    }

    function AnswerYN(receiver: boolean, answer: boolean){
        if (receiver){
            setAnsweryn(answer);
        }
    }

    function AnswerMultiple(receiver: boolean, answer: string){
        if (receiver){
            setAnswermultiple(answer);
        }
    }

    function AnswerTime(receiver: boolean, answer: string){
        if (receiver){
            const data = answer.split(":");
            setAnswertime({hour: parseInt(data[0]), minutes: parseInt(data[1])});
        }
    }

    function AnswerColor(receiver: boolean, answer: string){
        if (receiver){
            // hex to rgb
            const data = answer.substring(1);
            setAnswercolor({red: parseInt(data.substring(0, 2), 16), green: parseInt(data.substring(2, 4), 16), blue: parseInt(data.substring(4, 6), 16)});
        }
    }

    const router = useRouter();
    const [data, setData] = useState({ 
        metadata: {title:"", sender:"", receiver:"", date:""}, 
        message: "", 
        core_extentions:{
            "readed": false,
            "yes_no": {"question": "", "answer": false}, 
            "multiple_choice": {"question": "Which option do you prefer for lunch?","options": ["Sandwiches", "Salad", "Pizza"],"answer": "Sandwiches"},
            "time_selector": {"hour": 9, "minutes": 30},
            "color_selector": {"red": 128,"green": 0,"blue": 255}
        }
    });
    const [valid, setValid] = useState({valid: false, errors: []});
    const [readed, setReaded] = useState(false); 
    const [answeryn, setAnsweryn] = useState(false);
    const [answermultiple, setAnswermultiple] = useState("");
    const [answertime, setAnswertime] = useState({hour: 0, minutes: 0});
    const [answercolor, setAnswercolor] = useState({red: 0, green: 0, blue: 0});

    // Verify that the message exists & put it in data
    useEffect(() => {
        try {
            const din = require(`./../../inbox/${params.slug}.json`);
            setData(din);
        } catch (e) {
            router.push('/404');
        }
    }, [params.slug, router]);

    const schema = require('./../../schema.json');
    registerSchema(schema, "http://example.com/schema.json");
    // Validate message with schema
    useEffect(() => {
        validate("http://example.com/schema.json", data).then((result:any) => {
            setValid(result);
        });
    }, [data]);

    // Check if I am the receiver or not
    const user = require('./../../user.json');
    const isReceiver = data.metadata.receiver === user.username;

    // initialize core extentions
    useEffect(() => {
        if (data.core_extentions.readed !== undefined) {
            setReaded(data.core_extentions.readed);
        }
        if (data.core_extentions.yes_no !== undefined) {
            setAnsweryn(data.core_extentions.yes_no.answer);
        }
        if (data.core_extentions.multiple_choice !== undefined) {
            setAnswermultiple(data.core_extentions.multiple_choice.answer);
        }
        if (data.core_extentions.time_selector !== undefined) {
            setAnswertime(data.core_extentions.time_selector);
        }
        if (data.core_extentions.color_selector !== undefined) {
            setAnswercolor(data.core_extentions.color_selector);
        }
    }, [data.core_extentions.readed, data.core_extentions.yes_no]);

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
                from: {data.metadata.sender} {isReceiver ? null : <span>(me)</span>} - to: {data.metadata.receiver} {isReceiver ? <span>me</span> : null}
                <br />
                title: {data.metadata.title} - {date.toString()}
                <br /><hr />
                {data.message}
                <br /><hr />
            </div>

            {data.core_extentions.readed !== undefined && (
                <div>
                    <label>Message readed: </label>
                    <input type="checkbox" checked={readed} onChange={() => MessageReaded(isReceiver)}/>
                </div>
            )}
            {data.core_extentions.yes_no !== undefined && (
                <div>
                    <label>{data.core_extentions.yes_no.question}</label>
                    <br />
                    <input type="radio" name="answeryn" value="yes" checked={answeryn}  onChange={() => AnswerYN(isReceiver, true)}/>
                    <label>Yes</label>
                    <input type="radio" name="answeryn" value="no" checked={!answeryn && answeryn != null}  onChange={() => AnswerYN(isReceiver, false)}/>
                    <label>No</label>
                </div>
            )}
            {data.core_extentions.multiple_choice !== undefined && (
                <div>
                    <label>{data.core_extentions.multiple_choice.question}</label>
                    <br />
                    {data.core_extentions.multiple_choice.options.map((option: string) => (
                        <div key={option}>
                            <input type="radio" name="answer" value={option}  checked={answermultiple === option} onChange={() => AnswerMultiple(isReceiver, option)}/>
                            <label>{option}</label>
                        </div>
                    ))}
                </div>
            )}
            {data.core_extentions.time_selector !== undefined && (
                <div>
                    <label>Time: </label>
                    <input type="time" value={String(answertime.hour).padStart(2, '0')+':'+String(answertime.minutes).padStart(2, '0')} onChange={(event) => AnswerTime(isReceiver, event.target.value)} />
                </div>
            )}
            {data.core_extentions.color_selector !== undefined && (
                <div>
                    <label>Color: </label>
                    <input type="color" value={'#'+answercolor.red.toString(16).padStart(2, '0')+answercolor.green.toString(16).padStart(2, '0')+answercolor.blue.toString(16).padStart(2, '0')} onChange={(event) => AnswerColor(isReceiver, event.target.value)} />
                </div>
            )}
            <hr />
        </div>
    );
}
    