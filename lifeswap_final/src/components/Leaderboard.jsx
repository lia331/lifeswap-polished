import React, {useEffect, useState} from 'react';
export default function Leaderboard({supabase}){
  const [rows, setRows] = useState([]);
  useEffect(()=>{
    async function load(){ const {data} = await supabase.from('lifeswap_leaderboard').select('*').order('score',{ascending:false}).limit(50); if(data) setRows(data); }
    load();
  },[]);
  return (
    <section className="card">
      <h2>Leaderboard</h2>
      <ol>
        {rows.map(r=>(<li key={r.id}>{r.username} — {r.score} pts</li>))}
      </ol>
    </section>
  );
}
