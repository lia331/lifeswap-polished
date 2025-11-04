import React from 'react';
export default function GalleryView({timelines,onSelect}){
  return (
    <section className="gallery card">
      <h2>Your Alternate Lives</h2>
      <div className="grid">
        {Object.values(timelines).map(tl=>(
          <div className="lifecard" key={tl.id} onClick={()=>onSelect(tl.id)}>
            <div className="thumb" />
            <div className="meta"><strong>{tl.title}</strong><div className="small">Day {tl.day} • Score {tl.attributes.happiness+tl.attributes.wealth+tl.attributes.relationships+tl.attributes.fame}</div></div>
          </div>
        ))}
      </div>
    </section>
  );
}
