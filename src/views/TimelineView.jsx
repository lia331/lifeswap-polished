import React, {useState} from 'react';
import { motion } from 'framer-motion';
const CHOICES = [
  {id:'risk_inv', label:'Accept a risky investment opportunity'},
  {id:'move_city', label:'Move to another city for a dream job'},
  {id:'adopt_pet', label:'Adopt a pet'},
  {id:'side_project', label:'Start an ambitious side project'},
  {id:'collab_yes', label:'Say yes to a stranger who offers collaboration'}
];

export default function TimelineView({tl,onBack,onShare,onUpdate}){
  const [local, setLocal] = useState(tl);
  function apply(choiceId, accepted){
    const effects = accepted ? {happiness:5,wealth:3} : {happiness:-2};
    const nt = {...local};
    for(const k in effects) nt.attributes[k] = Math.max(0, Math.min(100,(nt.attributes[k]||50)+effects[k]));
    nt.history = nt.history.concat([{day:nt.day+1, decision: CHOICES.find(c=>c.id===choiceId).label, accepted, effects, story: `${nt.profile.name||'You'} ${accepted? 'accepted' : 'declined'} ${choiceId}`}]);
    nt.day++;
    setLocal(nt);
    onUpdate(nt);
  }
  return (
    <section className="card play">
      <button className="close" onClick={onBack}>← Back</button>
      <h3>{local.title}</h3>
      <div className="stats">
        <div>Happiness: {local.attributes.happiness}</div>
        <div>Wealth: {local.attributes.wealth}</div>
        <div>Relationships: {local.attributes.relationships}</div>
        <div>Fame: {local.attributes.fame}</div>
      </div>
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="choicecard">
        <p>{CHOICES[ local.day % CHOICES.length ].label}</p>
        <div className="row">
          <button className="btn" onClick={()=>apply(CHOICES[ local.day % CHOICES.length ].id, true)}>Yes</button>
          <button className="btn alt" onClick={()=>apply(CHOICES[ local.day % CHOICES.length ].id, false)}>No</button>
          <button className="btn" onClick={onShare}>Share</button>
        </div>
      </motion.div>
      <div className="history">
        <h4>History</h4>
        {local.history.slice().reverse().map((h,i)=>(<div className="historyItem" key={i}><small>Day {h.day}</small><div>{h.story}</div></div>))}
      </div>
    </section>
  );
}
