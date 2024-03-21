import Link from "next/link"

export default async function Home() {
  return(
    <div>
       <Link href="/view/01">working message</Link><br />
      <Link href="/view/02">broken message</Link><br />
    </div>
  );
}
