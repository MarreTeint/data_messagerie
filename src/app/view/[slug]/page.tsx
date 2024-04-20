import Message from './Message';
import TopBar from './TopBar';

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="flex flex-col">
        <TopBar params={params}/>
        <Message params={params} />
    </div>
  );
}
