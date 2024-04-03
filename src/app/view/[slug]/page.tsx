import Message from './Message';
import SideBar from './SideBar';

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="flex">
      <div className="w-1/4 border-r border-gray-300">
        <SideBar />
      </div>
      <div className="w-3/4">
        <Message params={params} />
      </div>
    </div>
  );
}
