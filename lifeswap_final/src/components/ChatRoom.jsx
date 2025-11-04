import React, {useEffect, useState, useRef} from 'react';
export default function ChatRoom({supabase, user}){
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const ref = useRef();
  useEffect(()=>{
    let mounted=true;
    async function load(){
      const {data} = await supabase.from('lifeswap_chat').select('*').order('created_at',{ascending:true}).limit(200);
      if(mounted && data) setMessages(data);
    }
    load();
    const sub = supabase.channel('public:chat').on('postgres_changes', {event:'INSERT', schema:'public', table:'lifeswap_chat'}, payload=>{
      setMessages(prev=>prev.concat(payload.new));
      ref.current && ref.current.scrollIntoView({behavior:'smooth'});
    }).subscribe();
    return ()=>{ mounted=false; sub.unsubscribe(); }
  },[]);

  async function send(){
    if(!text.trim()) return;
    await supabase.from('lifeswap_chat').insert([{user_id: user?.id||'anon', username: user?.email||'Anonymous', message:text, created_at: new Date().toISOString()}]);
    setText('');
  }

  return (
    <section className="card chat">
      <h2>Community Chat</h2>
      <div className="messages">
        {messages.map(m=>(<div key={m.id} className="message"><strong>{m.username}:</strong> {m.message}</div>))}
        <div ref={ref} />
      </div>
      <div className="row">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Share your story..." />
        <button className="btn" onClick={send}>Send</button>
      </div>
      <p className="muted">Public chat is moderated. Report messages by clicking them (placeholder).</p>
    </section>
  );
}
