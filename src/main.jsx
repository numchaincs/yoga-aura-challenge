import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
// 1. เพิ่มบรรทัดนี้เพื่อ import ตัวแทร็ก
import { Analytics } from "@vercel/analytics/react"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    {/* 2. วางตัวแทร็กไว้ตรงนี้ข้างๆ <App /> */}
    <Analytics /> 
  </React.StrictMode>
);