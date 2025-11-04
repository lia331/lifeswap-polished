import React, {useState} from 'react';
export default function AvatarCreator({supabase, user}){
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [avatars, setAvatars] = useState([]);

  async function uploadAvatar(){
    if(!file){ alert('Choose an image first'); return; }
    setProcessing(true);
    // placeholder: in production, send image to avatar-generation service or serverless function
    setTimeout(()=>{
      const id = 'av_'+Math.random().toString(36).slice(2,9);
      setAvatars(prev=>[{id, url:URL.createObjectURL(file)}].concat(prev));
      setProcessing(false);
    }, 1500);
  }

  return (
    <section className="card">
      <h2>Create your AI Avatar</h2>
      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} />
      <div className="row">
        <button className="btn" onClick={uploadAvatar} disabled={processing}>{processing? 'Generating...':'Generate Avatar'}</button>
      </div>
      <div className="grid">
        {avatars.map(a=>(<div key={a.id} className="avatar"><img src={a.url} alt="avatar" /></div>))}
      </div>
      <p className="muted">Note: This demo uses client-side placeholder generation. For production, connect a secure server-side avatar AI or third-party API and obtain consent for image use.</p>
    </section>
  );
}
