import Message from './Message';
import SideBar from './SideBar';

export default function Page({ params }: { params: { slug: string } }) {
  return(
  <div>
    <Message params={params} />
    <SideBar />
  </div>
  );
}
