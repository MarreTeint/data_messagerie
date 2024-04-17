import Link from "next/link"

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="flex flex-col">
      <Link href="/"><button>Return Home</button></Link>
      <form>
        <div>
          <input type="text" className="border w-screen" placeholder="TO:" />
        </div>
        <div>
          <input type="text" className="border w-screen" placeholder="Subject:" />
        </div>
        <div>
          <textarea className="border w-screen" rows={20} placeholder="Message" />
        </div>
        <div>
          <input type="checkbox" className="border" /> <label>Ask if readed</label>
        </div>
        <div>
          <button className="border">Add a Y/N question</button>
          <button className="border">Add a multiple choice question</button>
          <button className="border">Add a time selector</button>
          <button className="border">Add a color choice</button>
        </div>
        <div>
          <button className="border" type="submit">Send</button>
        </div>
      </form>
    </div>
  );
}