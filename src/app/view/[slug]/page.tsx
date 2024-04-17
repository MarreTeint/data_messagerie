import Message from './Message';
import SideBar from './SideBar';
import TopBar from './TopBar';

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="flex">
      <div className="w-1/4 border-r border-gray-300">
        <SideBar />
      </div>
      <div className="w-3/4">
        <TopBar />
        <Message params={params} />
      </div>
    </div>
  );
}
