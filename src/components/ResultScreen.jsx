import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import SpiritAnimal from "./SpiritAnimal";

export default function ResultScreen({ score, onRestart }) {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const resultRef = useRef(null); // ใช้สำหรับอ้างอิงส่วนที่จะบันทึกภาพ

  // ฟังก์ชันบันทึกภาพลงเครื่อง
  const handleSaveImage = async () => {
    if (resultRef.current) {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: "#1a1a1a", // สีพื้นหลังของภาพที่บันทึก
        scale: 2, // เพิ่มความชัดของภาพ
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "my-yoga-aura.png";
      link.click();
      
      triggerToast("ได้บันทึกภาพลงเครื่องแล้ว");
    }
  };

  // ฟังก์ชัน Copy ลิงก์ชวนเพื่อน
  const handleCopyLink = () => {
    const shareLink = "https://yoga-aura-challenge-7ud5.vercel.app/";
    navigator.clipboard.writeText(shareLink);
    triggerToast("คัดลอกลิงก์ชวนเพื่อนแล้ว!");
  };

  // ฟังก์ชันแสดง Toast
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="result-screen" style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
      {/* ส่วนที่จะถูกถ่ายรูป */}
      <div ref={resultRef} style={{ padding: '20px', borderRadius: '20px', background: '#1a1a1a' }}>
        <h2 style={{ color: '#A855F7', marginBottom: '10px' }}>YOUR YOGA AURA</h2>
        <SpiritAnimal score={score} />
        <div style={{ marginTop: '15px', fontSize: '24px', fontWeight: 'bold' }}>
          Stability Score: {Math.round(score)}%
        </div>
      </div>

      {/* ปุ่มกดต่างๆ */}
      <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button 
          onClick={handleSaveImage}
          style={{ padding: '15px', borderRadius: '12px', border: 'none', background: '#A855F7', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
        >
          📥 บันทึกภาพลงเครื่อง
        </button>

        <button 
          onClick={handleCopyLink}
          style={{ padding: '15px', borderRadius: '12px', border: '2px solid #A855F7', background: 'transparent', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
        >
          🤝 ชวนเพื่อนมาเล่น
        </button>

        <button 
          onClick={onRestart}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', textDecoration: 'underline' }}
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>

      {/* Toast Message UI */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.9)',
          color: '#000',
          padding: '10px 20px',
          borderRadius: '25px',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          animation: 'fadeInOut 3s forwards'
        }}>
          {toastMsg}
        </div>
      )}

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; bottom: 40px; }
          15% { opacity: 1; bottom: 50px; }
          85% { opacity: 1; bottom: 50px; }
          100% { opacity: 0; bottom: 40px; }
        }
      `}</style>
    </div>
  );
}