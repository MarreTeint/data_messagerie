import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'POST'){
    const { slug } = req.query;
    const { data } = req.body;

    try {
      fs.writeFileSync(`./inbox/${slug}.json`, JSON.stringify(data));
        res.status(200).json({ success: true });
    }catch(e){
        res.status(500).json({ success: false });
    }
  }
}