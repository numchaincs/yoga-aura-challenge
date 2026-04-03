import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import SpiritAnimal from "./SpiritAnimal";

export default function ResultScreen({ score = 0, onRestart }) {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const resultRef = useRef(null);

  // 1. แปลงคะแนนเป็นตัวเลขที่ถูกต้อง
  const finalScore = isNaN(score) ? 0 : Math.round(score);

  // 2. คำนวณหาชื่อสัตว์ตามเกณฑ์ใน SpiritAnimal.jsx
  let animalName = "fox"; // ค่าเริ่มต้น
  if (finalScore >= 90) animalName = "crane";
  else if (finalScore >= 70) animalName = "wolf";
  else if (finalScore >= 50) animalName = "fox";
  else if (finalScore >= 25) animalName = "panda";
  else animalName = "penguin";

  const handleSaveImage = async () => {
    if (resultRef.current) {
      try {
        const canvas = await html2canvas(resultRef.current, {
          backgroundColor: "#1a1033",
          scale: 2,
        });
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "my-yoga-aura.png";
        link.click();
        triggerToast("บันทึกภาพลงเครื่องแล้ว ✨");
      } catch (err) {
        triggerToast("เกิดข้อผิดพลาดในการบันทึก");
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://yoga-aura-challenge-7ud5.vercel.app/");
    triggerToast("คัดลอกลิงก์ชวนเพื่อนแล้ว! 🤝");
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="result-screen" style={{ 
      padding: '40px 20px', textAlign: 'center', minHeight: '100vh',
      background: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>
      
      {/* การ์ดผลลัพธ์ที่จะถูกบันทึกภาพ */}
      <div 
        ref={resultRef} 
        style={{ 
          padding: '30px', borderRadius: '30px', 
          background: 'linear-gradient(135deg, #2d1b4d 0%, #1a1033 100%)',
          border: '2px solid #A855F7', width: '100%', maxWidth: '350px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}
      >
        <p style={{ color: '#E9D5FF', letterSpacing: '2px', fontSize: '14px', margin: '0 0 10px 0' }}>YOUR YOGA AURA IS</p>
        
        {/* ส่งชื่อสัตว์ (animalName) เข้าไป แทนการส่ง score */}
        <div style={{ height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
           <SpiritAnimal animal={animalName} animate={true} />
        </div>

        <div style={{ marginTop: '20px' }}>
          <span style={{ fontSize: '14px', color: '#E9D5FF', opacity: 0.8 }}>Stability Score</span>
          <div style={{ fontSize: '56px', fontWeight: '900', color: '#A855F7', lineHeight: '1' }}>
            {finalScore}%
          </div>
          <p style={{ marginTop: '10px', color: '#E9D5FF', fontStyle: 'italic' }}>
            {animalName === "wolf" ? "Focus & Strength" : animalName === "crane" ? "Pure Balance" : "Keeping Balance"}
          </p>
        </div>
      </div>

      {/* ปุ่มกด */}
      <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '300px' }}>
        <button onClick={handleSaveImage} style={{ padding: '18px', borderRadius: '18px', border: 'none', background: '#A855F7', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)' }}>
          📥 บันทึกภาพผลลัพธ์
        </button>

        <button onClick={handleCopyLink} style={{ padding: '18px', borderRadius: '18px', border: '2px solid #A855F7', background: 'transparent', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
          🤝 ชวนเพื่อนมาเล่น
        </button>

        <button onClick={onRestart} style={{ marginTop: '10px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textDecoration: 'underline' }}>
          ลองใหม่อีกครั้ง
        </button>
      </div>

      {/* Toast */}
      {showToast && (
        <div style={{ position: 'fixed', bottom: '40px', background: 'white', color: '#1e293b', padding: '12px 24px', borderRadius: '50px', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 1000 }}>
          {toastMsg}
        </div>
      )}
    </div>
  );
}