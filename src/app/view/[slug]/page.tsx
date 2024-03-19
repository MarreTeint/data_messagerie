
'use client'

import { registerSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { slug: string } }) {
  const router = useRouter();
  try {
    const data = require(`./../../inbox/${params.slug}.json`);
  
  const schema = require('./../../schema.json');

  registerSchema(schema, "http://example.com/schema.json");
  (async () => {
    const out = await validate("http://example.com/schema.json", data);
  })();

  return (
    <div>
      <p>{JSON.stringify(data)}</p>
      My Post: {params.slug}
    </div>
  );
  }catch(e){
    router.push('/404');
  }
}
