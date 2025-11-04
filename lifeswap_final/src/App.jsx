import React, {useEffect, useState} from 'react';
import { createClient } from '@supabase/supabase-js';
import IntroCarousel from './components/IntroCarousel.jsx';
import AvatarCreator from './components/AvatarCreator.jsx';
import ChatRoom from './components/ChatRoom.jsx';
import Gallery from './components/CommunityGallery.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import TimelineHub from './components/TimelineHub.jsx';

const SUPABASE_URL = "https://fudatxdavxwoaiybsahm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1ZGF0eGRhdnh3b2FpeWJzYWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNDY3MjksImV4cCI6MjA3NzgyMjcyOX0.Nb3_GoQEPEDb4XAWuzZ03fqXN-kvlfRAvtghu5g9VEc";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App(){
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home');

  useEffect(()=>{
    supabase.auth.getSession().then(r=>{ if(r?.data?.session) setUser(r.data.session.user); });
    supabase.auth.onAuthStateChange((ev, sess)=>{ if(sess?.user) setUser(sess.user); else setUser(null); });
  },[]);

  return (
    <div className="app">
      <header className="topbar">
        <h1>LifeSwap</h1>
        <nav className="nav">
          <button onClick={()=>setView('home')}>Home</button>
          <button onClick={()=>setView('avatars')}>Create Avatar</button>
          <button onClick={()=>setView('timelines')}>Timelines</button>
          <button onClick={()=>setView('chat')}>Community Chat</button>
          <button onClick={()=>setView('gallery')}>Stories</button>
          <button onClick={()=>setView('leaderboard')}>Leaderboard</button>
        </nav>
      </header>

      <main className="container">
        {view==='home' && (
          <section>
            <IntroCarousel />
            <div className="cta">
              <h2>Step into your other life.</h2>
              <p className="muted">Create AI avatars, play historical lives, share your best moments.</p>
            </div>
          </section>
        )}

        {view==='avatars' && <AvatarCreator supabase={supabase} user={user} />}
        {view==='chat' && <ChatRoom supabase={supabase} user={user} />}
        {view==='gallery' && <Gallery supabase={supabase} user={user} />}
        {view==='leaderboard' && <Leaderboard supabase={supabase} />}
        {view==='timelines' && <TimelineHub supabase={supabase} user={user} />}
      </main>

      <footer className="foot muted">LifeSwap • Privacy-first • Freemium + Premium options</footer>
    </div>
  );
}
