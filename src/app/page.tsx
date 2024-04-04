import fs from "fs"
import path from "path"
import Link from "next/link"

function getFilesInDirectory(directory: string): string[] {
  let results: string[] = [];

  const files = fs.readdirSync(directory);

  for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);

      if (stat && stat.isDirectory()) {
          results = results.concat(getFilesInDirectory(filePath));
      } else {
          results.push(filePath);
      }
  }

  return results;
}

export default async function Home() {
  const files = getFilesInDirectory("src/app/inbox");
  return(
    <div>
       <Link href="/view/0">404 message</Link><br />
        {
          files.map((file, index) => {
            //const data = path.parse(file);
            return (
              <div key={index}>
                <Link href={`/view/${path.parse(file).name}`}>{path.parse(file).name}</Link>
              </div>
            );
          })
        }
        <Link href="/extentions">Gerer mes extentions</Link>
    </div>
  );
}
