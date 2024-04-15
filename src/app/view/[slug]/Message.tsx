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
        metadata: {title:"", sender:"", date:""}, 
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

    if (!data.metadata.title || !data.metadata.sender || !data.metadata.date || !data.message) {
        return null; // noting printed while loading
    }
    if (!valid.valid) {
        return <ErrorMessage/>;
    }

    const date = new Date(data.metadata.date);

    return (
        <div>
            <div>
                from: {data.metadata.sender}
                <br />
                title: {data.metadata.title} - {date.toString()}
                <br /><hr />
                {data.message}
                <br /><hr />
            </div>

            {data.core_extentions.readed !== undefined && (
                <div>
                    <label>Message readed: </label>
                    <input type="checkbox" checked={data.core_extentions.readed} />
                </div>
            )}
            {data.core_extentions.yes_no !== undefined && (
                <div>
                    <label>{data.core_extentions.yes_no.question}</label>
                    <br />
                    <input type="radio" name="answeryn" value="yes" checked={data.core_extentions.yes_no.answer} />
                    <label>Yes</label>
                    <input type="radio" name="answeryn" value="no" checked={!data.core_extentions.yes_no.answer && data.core_extentions.yes_no.answer != null} />
                    <label>No</label>
                </div>
            )}
            {data.core_extentions.multiple_choice !== undefined && (
                <div>
                    <label>{data.core_extentions.multiple_choice.question}</label>
                    <br />
                    {data.core_extentions.multiple_choice.options.map((option: string) => (
                        <div key={option}>
                            <input type="radio" name="answer" value={option} checked={data.core_extentions.multiple_choice.answer === option} />
                            <label>{option}</label>
                        </div>
                    ))}
                </div>
            )}
            {data.core_extentions.time_selector !== undefined && (
                <div>
                    <label>Time: </label>
                    <input type="time" value={String(data.core_extentions.time_selector.hour).padStart(2, '0')+':'+String(data.core_extentions.time_selector.minutes).padStart(2, '0')} />
                </div>
            )}
            {data.core_extentions.color_selector !== undefined && (
                <div>
                    <label>Color: </label>
                    <input type="color" value={'#'+data.core_extentions.color_selector.red.toString(16).padStart(2, '0')+data.core_extentions.color_selector.green.toString(16).padStart(2, '0')+data.core_extentions.color_selector.blue.toString(16).padStart(2, '0')}/>
                </div>
            )}
        </div>
    );
}
    