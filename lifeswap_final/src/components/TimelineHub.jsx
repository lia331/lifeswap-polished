import React, {useState} from 'react';
const FICTIONAL_ICONS = [
  {id:'icon1', name:'Aisha Monroe', era:'Pop Legend', bio:'Fictional pop legend inspired by modern icons — fictionalized.'},
  {id:'icon2', name:'Jon Vargas', era:'Sports Legend', bio:'A celebrated athlete from a small town — fictionalized.'},
  {id:'icon3', name:'Dr. Elena Kirov', era:'Scientist', bio:'Renowned researcher in renewable tech — fictionalized.'}
];
export default function TimelineHub({supabase,user}){
  const [selected, setSelected] = useState(null);
  const [timelines, setTimelines] = useState({});
  function createFromIcon(icon){
    const id = 'tl_'+Math.random().toString(36).slice(2,9);
    setTimelines(prev=>({...prev, [id]: {id, title:icon.name+' — '+icon.era, day:0, attributes:{happiness:50,wealth:40,relationships:60,fame:80}, history:[], profile:{name:icon.name}}}));
  }
  return (
    <section className="card">
      <h2>Play Famous Lives (Fictionalized)</h2>
      <p className="muted">For legal safety we offer historically-inspired or fully fictionalized icons. Real modern public figures require licensing.</p>
      <div className="grid">
        {FICTIONAL_ICONS.map(i=>(
          <div key={i.id} className="lifecard" onClick={()=>createFromIcon(i)}>
            <div className="thumb" />
            <div><strong>{i.name}</strong><div className="muted">{i.era}</div><p>{i.bio}</p></div>
          </div>
        ))}
      </div>
      <h3>Your Timelines</h3>
      <div className="grid">
        {Object.values(timelines).map(t=>(<div key={t.id} className="lifecard"><strong>{t.title}</strong><div className="muted">Day {t.day}</div></div>))}
      </div>
    </section>
  );
}
