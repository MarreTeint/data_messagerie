'use client'
import Link from "next/link"
import { useEffect, useState } from "react";

export default function Home() {
  const [files, setFiles] = useState<JSON[]>();

    useEffect(() => {fetch(`/api/DataFiles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        //console.log(response);
        response.json().then(data => {
          console.log(data);
          setFiles(data);
        });
      }
    });
  }, []);

  return(
    <div>
      <Link href={"/rep/new"}><button>Write a message</button></Link><br />
      {files && files.map((file: any) => {
        return <div><Link href={`/view/${file.file}`} key={file.file}>{file.metadata.title} - {file.metadata.sender}</Link></div>
      }
      )}
        <Link href="/extentions">Gerer mes extentions</Link>
    </div>
  );
}
