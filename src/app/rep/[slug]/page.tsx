'use client'
import Link from "next/link"
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const date = new Date();
  const [newMessage, setNewMessage] = useState(params.slug === "new");
  const [coreReaded, setCoreReaded] = useState(false);
  const [coreYN, setCoreYN] = useState(false);
  const [coreMC, setCoreMC] = useState(false);
  const [coreTS, setCoreTS] = useState(false);
  const [coreCS, setCoreCS] = useState(false);
  const ext = require ("./../../extentions/ext.json");

  

  const [data, setData] = useState<any>({ 
    metadata: {title:"", sender:"John Doe", receiver:"", date: date.toISOString()}, 
    message: "", 
    previous: params.slug,
    core_extentions:{
        readed: false,
        yes_no: {question: "", answer: null}, 
        multiple_choice: {question: "",options: ["", "", ""],answer: ""},
        time_selector: {hour: 0, minutes: 0},
        color_selector: {red: 0,green: 0,blue: 0}
    },
    plugins : []
  });
  useEffect(() => {console.log(data)}, [data]);
  function updateTitle(title: string){
    setData({...data, metadata: {...data.metadata, title: title}});
  }
  function updateReceiver(receiver: string){
    setData({...data, metadata: {...data.metadata, receiver: receiver}});
  }
  function updateMessage(message: string){
    setData({...data, message: message});
  }

  function updateReaded(ask: boolean){
    setCoreReaded(ask);
  }

  function addYN(ask : boolean){
    setCoreYN(ask);
  }

  function updateYN(question: string){
    setData({...data, core_extentions: {...data.core_extentions, yes_no: {question: question, answer: null}}});
  }

  function addMultiple(ask : boolean){
    setCoreMC(ask);
  }

  function updateMultiple(text: string, options: string){
    switch(options){
      case "question":
        setData({...data, core_extentions: {...data.core_extentions, multiple_choice: {question: text, options: data.core_extentions.multiple_choice.options, answer: data.core_extentions.multiple_choice.answer}}});
        break;
      case "A":
        setData({...data, core_extentions: {...data.core_extentions, multiple_choice: {question: data.core_extentions.multiple_choice.question, options: [text, data.core_extentions.multiple_choice.options[1], data.core_extentions.multiple_choice.options[2]], answer: data.core_extentions.multiple_choice.answer}}});
        break;
      case "B":
        setData({...data, core_extentions: {...data.core_extentions, multiple_choice: {question: data.core_extentions.multiple_choice.question, options: [data.core_extentions.multiple_choice.options[0], text, data.core_extentions.multiple_choice.options[2]], answer: data.core_extentions.multiple_choice.answer}}});
        break;
      case "C":
        setData({...data, core_extentions: {...data.core_extentions, multiple_choice: {question: data.core_extentions.multiple_choice.question, options: [data.core_extentions.multiple_choice.options[0], data.core_extentions.multiple_choice.options[1], text], answer: data.core_extentions.multiple_choice.answer}}});
        break;
      case "D":
        setData({...data, core_extentions: {...data.core_extentions, multiple_choice: {question: data.core_extentions.multiple_choice.question, options: [data.core_extentions.multiple_choice.options[0], data.core_extentions.multiple_choice.options[1], data.core_extentions.multiple_choice.options[2], text], answer: data.core_extentions.multiple_choice.answer}}});
        break;
    }
  }

  function addTS(ask : boolean){
    setCoreTS(ask);
  }

  function addCS(ask : boolean){
    setCoreCS(ask);
  }

  function updatePlugins(plugin: string, value: boolean){
    if(value){
      setData({...data, plugins: [...data.plugins, {name: plugin, data: {}}]});
    }else{
      let plugins = data.plugins;
      let index = plugins.findIndex((element: any) => element.name === plugin);
      plugins.splice(index, 1);
      setData({...data, plugins: plugins});
    }
  }

  function RoomData(param: string, value: string){
    const extData = data.plugins.find((plugin: any) => plugin.name === "RoomReservation");
    if(param === "room"){
      extData.data[param] = value;
    } else {
      extData.data[param] = new Date(value).toISOString();
    }
    setData({...data, plugins: [extData]});
  }

  function submitForm(e: any){
    e.preventDefault();
    let dataSent = data;
    if(newMessage){
      delete dataSent.previous;
    }  
    if(!coreReaded){
      delete dataSent.core_extentions.readed;
    }
    if(!coreYN){
      delete dataSent.core_extentions.yes_no;
    }
    if(!coreMC){
      delete dataSent.core_extentions.multiple_choice;
    }
    if(!coreTS){
      delete dataSent.core_extentions.time_selector;
    }
    if(!coreCS){
      delete dataSent.core_extentions.color_selector;
    }
    if(!coreReaded && !coreYN && !coreMC && !coreTS && !coreCS){
      delete dataSent.core_extentions;
    }

    if(dataSent.plugins.length === 0){
      delete dataSent.plugins;
    }
    fetch("/api/DataFiles", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({data: data})
    }).then(response => {
      if(response.ok){
        console.log("Message sent successfully");
      } else {
        console.log("Failed to send message");
      }
    })
    router.push("/");
  }

  return (
    <div className="flex flex-col">
      <Link href="/"><button>Return Home</button></Link>
      <form onSubmit={(event) => {submitForm(event)}}>
        <div>
          <input type="text" className="border w-screen" required placeholder="TO:" onChange={(event) => {updateReceiver(event.target.value)}}/>
        </div>
        <div>
          <input type="text" className="border w-screen" required placeholder="Title:" onChange={(event) => {updateTitle(event.target.value)}}/>
        </div>
        <div>
          <textarea className="border w-screen" rows={20} required placeholder="Message" onChange={(event) => {updateMessage(event.target.value)}}/>
        </div>
        
        <div>
          <input type="checkbox" className="border" onChange={(event) => {updateReaded(event.target.checked)}}/> <label>Ask if readed</label>
        </div>
        <div>
          <input type="checkbox" className="border" onChange={(event) => {addYN(event.target.checked)}}/> <label>Add a Y/N question</label>
          {coreYN && <div><input className="border w-screen" type="text" placeholder="Yes/No question" onChange={(event) => {updateYN(event.target.value)}}/></div>}
        </div>
        <div>
          <input type="checkbox" className="border" onChange={(event) => {addMultiple(event.target.checked)}}/> <label>Add a multiple choice question</label>
          {coreMC && 
            <div>
              <input className="border w-screen" type="text" placeholder="Question" onChange={(event) => {updateMultiple(event.target.value, "question")}}/>
              <input className="border w-screen" type="text" placeholder="Option 1" onChange={(event) => {updateMultiple(event.target.value, "A")}}/>
              <input className="border w-screen" type="text" placeholder="Option 2" onChange={(event) => {updateMultiple(event.target.value, "B")}}/>
              <input className="border w-screen" type="text" placeholder="Option 3" onChange={(event) => {updateMultiple(event.target.value, "C")}}/>
              <input className="border w-screen" type="text" placeholder="Option 4" onChange={(event) => {updateMultiple(event.target.value, "D")}}/>
            </div>}
        </div>
        <div>
          <input type="checkbox" className="border" onChange={(event) => {addTS(event.target.checked)}}/> <label>Ask for a time</label>
        </div>
        <div>
          <input type="checkbox" className="border" onChange={(event) => {addCS(event.target.checked)}}/> <label>Ask for a color</label>
        </div>
        <div>
          {
            Object.keys(ext).map((key) => {
              return (
                ext[key] ? 
                <div key={key}>
                  <input type="checkbox" className="border" onChange={(event) => {updatePlugins(key, event.target.checked)}}/> <label>{key}</label>
                  {data.plugins.some((plugin: any) => plugin.name === key) ? 
                    <div>
                      <input type="text" placeholder="Room" onChange={(event) => {RoomData("room", event.target.value)}}/> <label>From:</label><input type="datetime-local" onChange={(event) => {RoomData("from", event.target.value)}}/><label>To:</label><input type="datetime-local" onChange={(event) => {RoomData("to", event.target.value)}}/>
                    </div>
                    : null}
                </div> 
                : null
              )
            })
          }
        </div>
        <div>
          <button className="border" type="submit">Send</button>
        </div>
      </form>
    </div>
  );
}