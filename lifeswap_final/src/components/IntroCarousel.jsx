import React from 'react';
import { motion } from 'framer-motion';
export default function IntroCarousel(){
  const slides = [
    {id:1, title:'Create an AI avatar', desc:'Upload a selfie and get a stylized avatar.'},
    {id:2, title:'Live alternate lives', desc:'Make choices and see different outcomes.'},
    {id:3, title:'Share with friends', desc:'Export story cards and share on social media.'}
  ];
  return (
    <div className="carousel card">
      {slides.map(s=>(
        <motion.div key={s.id} className="slide" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.8}}>
          <div className="slide-thumb" />
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}
