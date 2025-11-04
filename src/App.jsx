import React, {useEffect, useState, useCallback, Suspense, lazy} from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';

// Supabase (same project as before)
const SUPABASE_URL = "https://fudatxdavxwoaiybsahm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1ZGF0eGRhdnh3b2FpeWJzYWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNDY3MjksImV4cCI6MjA3NzgyMjcyOX0.Nb3_GoQEPEDb4XAWuzZ03fqXN-kvlfRAvtghu5g9VEc";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Lazy components (simulate larger app)
const TimelineView = lazy(()=>import('./views/TimelineView.jsx'));
const GalleryView = lazy(()=>import('./views/GalleryView.jsx'));

// Daily event generator
const DAILY_EVENTS = [
  "Global AI summit shifts creative industries",
  "Solar storm causes brief internet outages",
  "Economic stimulus favors small creators",
  "Viral music trend sweeps metropolitan cities",
  "Climate migration reshapes coastal towns"
];

// simple hook for background synth (calm futuristic)
function useSynth(enabled){
  useEffect(()=>{
    if(!enabled) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 220;
    g.gain.value = 0.03;
    o.connect(g); g.connect(ctx.destination);
    o.start();
    let raf;
    let t0 = performance.now();
    function loop(){ let t=(performance.now()-t0)/1000; g.gain.value = 0.02 + 0.01*Math.sin(t*0.5); raf=requestAnimationFrame(loop); }
    loop();
    return ()=>{ o.stop(); if(raf) cancelAnimationFrame(raf); ctx.close(); };
  }, [enabled]);
}

export default function App(){
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home');
  const [profile, setProfile] = useState({name:'',interests:'',goals:'',personality:'Balanced'});
  const [timelines, setTimelines] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [musicOn, setMusicOn] = useState(true);
  const [dailyEvent, setDailyEvent] = useState(DAILY_EVENTS[Math.floor(Math.random()*DAILY_EVENTS.length)]);

  useSynth(musicOn);

  useEffect(()=>{
    const raw = localStorage.getItem('lifeswap_polished_state');
    if(raw){ try{ const s=JSON.parse(raw); setTimelines(s.timelines||{}); setProfile(s.profile||profile);}catch(e){} }
    supabase.auth.getSession().then(r=>{ if(r?.data?.session) setUser(r.data.session.user); });
    supabase.auth.onAuthStateChange((ev, sess)=>{ if(sess?.user) setUser(sess.user); else setUser(null); });
  },[]);

  useEffect(()=>{ localStorage.setItem('lifeswap_polished_state', JSON.stringify({profile,timelines})); }, [profile,timelines]);

  async function signIn(){ await supabase.auth.signInWithOAuth({provider:'google'}); }
  async function signOut(){ await supabase.auth.signOut(); setUser(null); }

  function createTimelines(){
    const templates = ['Musician — Tokyo','Founder — SF','DJ — Berlin','Archaeologist — Peru','Novelist — Coastal Town'];
    const newT = {...timelines};
    templates.forEach(t=>{
      const id = 'tl_'+Math.random().toString(36).slice(2,9);
      newT[id] = { id, title: (profile.name||'You') + ' — ' + t, day:0, attributes:{happiness:50,wealth:50,relationships:50,fame:10}, history:[], profile:{...profile}};
    });
    setTimelines(newT);
    if(user) saveRemote(user.id, {profile, timelines:newT});
    setView('gallery');
  }

  async function saveRemote(userId, data){
    try{
      const {error} = await supabase.from('lifeswap_progress').upsert({user_id:userId, data}, {onConflict:['user_id']});
      if(error) console.error(error);
    }catch(e){ console.error(e); }
  }
  async function loadRemote(userId){
    try{
      const {data,error} = await supabase.from('lifeswap_progress').select('data').eq('user_id', userId).single();
      if(data && data.data){ setProfile(data.data.profile||profile); setTimelines(data.data.timelines||{}); }
    }catch(e){ if(e) console.error(e); }
  }

  const shareCard = useCallback(async (tl) => {
    const node = document.getElementById('share-root');
    if(!node) return;
    try{
      const dataUrl = await toPng(node, {cacheBust:true});
      const a = document.createElement('a'); a.href=dataUrl; a.download='lifeswap_share.png'; a.click();
    }catch(e){ console.error(e); alert('Share failed: '+e.message); }
  },[]);

  useEffect(()=>{
    if(user) saveRemote(user.id, {profile,timelines});
  }, [timelines, user]);

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1 className="brand">LifeSwap</h1>
          <div className="tag muted">Step into your other life. Instantly.</div>
        </div>
        <div className="controls">
          <button className="btn" onClick={()=>setMusicOn(o=>!o)}>{musicOn? 'Music On':'Music Off'}</button>
          {user? <button className="btn alt" onClick={signOut}>Sign out</button> : <button className="btn" onClick={signIn}>Sign in (Google)</button>}
        </div>
      </header>

      <main className="container">

        <AnimatePresence mode="wait">
          {view==='home' && (
            <motion.section key="home" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="hero card">
              <h2>Welcome</h2>
              <p className="muted">Daily Event: <strong>{dailyEvent}</strong></p>
              <div className="form">
                <input placeholder="Your name" value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} />
                <input placeholder="Interests (comma)" value={profile.interests} onChange={e=>setProfile({...profile,interests:e.target.value})} />
                <div className="row">
                  <button className="btn" onClick={createTimelines}>Create Alternate Lives</button>
                  <button className="btn alt" onClick={()=>{ setProfile({name:'',interests:'',goals:'',personality:'Balanced'}); setTimelines({}); }}>Reset</button>
                </div>
                <p className="muted">Sign in to save progress across devices.</p>
              </div>
            </motion.section>
          )}

          {view==='gallery' && (
            <Suspense fallback={<div className="card">Loading gallery…</div>}>
              <motion.div key="gallery" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <GalleryView timelines={timelines} onSelect={(id)=>{ setActiveId(id); setView('timeline'); }} />
              </motion.div>
            </Suspense>
          )}

          {view==='timeline' && activeId && (
            <Suspense fallback={<div className="card">Loading timeline…</div>}>
              <TimelineView key={activeId} tl={timelines[activeId]} onBack={()=>setView('gallery')} onShare={()=>shareCard(timelines[activeId])} onUpdate={(t)=>{ setTimelines(prev=>({...prev, [t.id]: t})); }} />
            </Suspense>
          )}
        </AnimatePresence>

        <div id="share-root" style={{position:'absolute',left:-9999,top:-9999}} aria-hidden>
          <div style={{width:1200,height:630,padding:40,background:'#071021',color:'#e6eef6'}}>
            <h1 style={{fontSize:48}}>LifeSwap</h1>
            <h2 style={{fontSize:28}}>Your Alternate Life</h2>
          </div>
        </div>

      </main>

      <footer className="foot muted">LifeSwap • Polished • Mobile PWA</footer>
    </div>
  );
}
