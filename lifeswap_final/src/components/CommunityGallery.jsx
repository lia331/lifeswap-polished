import React, {useEffect, useState} from 'react';
export default function CommunityGallery({supabase,user}){
  const [stories, setStories] = useState([]);
  useEffect(()=>{
    async function load(){
      const {data} = await supabase.from('lifeswap_stories').select('*').order('created_at',{ascending:false}).limit(50);
      if(data) setStories(data);
    }
    load();
  },[]);
  return (
    <section className="card">
      <h2>Community Stories</h2>
      <div className="grid">
        {stories.map(s=>(
          <div className="story" key={s.id}>
            <h4>{s.title}</h4>
            <p className="muted">By {s.user_email||'Anon'}</p>
            <div>{s.excerpt}</div>
          </div>
        ))}
      </div>
      <p className="muted">Share your best alternate life stories to be featured here.</p>
    </section>
  );
}
