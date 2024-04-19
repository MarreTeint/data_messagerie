import Link from "next/link";

export default function TopBar({ params }: { params: { slug: string } }) {
    return (
        <div>
            <Link href={`./../rep/${params.slug}`}><button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Answer</button></Link>
        </div>
    );
}