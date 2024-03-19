import { registerSchema, validate } from "@hyperjump/json-schema/draft-2020-12";

export default async function Home() {
  const data = require('./inbox/01.json');
  const schema = require('./schema.json');

  registerSchema(schema, "http://example.com/schema.json");
  const out = await validate("http://example.com/schema.json", data);

  return (
    <div>
      <h1>Home</h1>
      <p>{JSON.stringify(out)}</p>
    </div>
  );
}
