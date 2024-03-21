'use client'

import { registerSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Message({ params }: { params: { slug: string } }) {
    const router = useRouter();
    const [data, setData] = useState({ metadata: {title:"", sender:"", date:""}, message: ""});
    const [valid, setValid] = useState({});

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
    useEffect(() => {
        validate("http://example.com/schema.json", data).then((result) => {
            setValid(result);
        });
    }, [data]);

    if (!data.metadata.title || !data.metadata.sender || !data.metadata.date || !data.message) {
        return null;
    }

    return (
      <div>
        sender: {data.metadata.sender}
        <br />
        title: {data.metadata.title}
        <br />
        date: {data.metadata.date}
        <br />
        message: {data.message}
        <br />
        {JSON.stringify(valid)}
      </div>
    );
}
    