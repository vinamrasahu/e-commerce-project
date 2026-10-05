   
   import React from "react";  
     
     import { useState } from "react";
     export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(form);
    };
  
    return (
      <div style={{ fontFamily: "'Poppins', sans-serif" }}>
  
        {/* Breadcrumb */}
        <div style={{ background: "#f5f5f0", borderBottom: "1px solid #e8e8e8", padding: "32px 0", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#555", margin: 0 }}>
            <span style={{ textTransform: "uppercase" }}>Home</span>
            <span style={{ margin: "0 10px", color: "#aaa" }}>/</span>
            <span style={{ textTransform: "uppercase", color: "#222" }}>Contact Us</span>
          </p>
        </div>
  
        {/* Google Map */}
        <div style={{ width: "100%", height: 380 }}>
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.95373631531676!3d-37.817209979751784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sau!4v1620000000000!5m2!1sen!2sau"
            width="100%"
            height="100%"
            style={{ border: 0, display: "block" }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>
  
        {/* Contact body */}
        <div style={{ display: "flex", minHeight: 420 }}>
  
          {/* Left — info + social */}
          <div style={{ width: "35%", background: "#f5f5f0", padding: "56px 48px", display: "flex", flexDirection: "column", gap: 32 }}>
  
            {/* Phone */}
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={iconCircle}>
                <svg width="18" height="18" fill="none" stroke="#1a1a1a" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.1 3.3a1 1 0 01-.23 1.02L7.91 9.24a16.05 16.05 0 006.85 6.85l1.24-1.24a1 1 0 011.02-.23l3.3 1.1a1 1 0 01.68.95V19a2 2 0 01-2 2C8.955 21 3 15.046 3 7.718V5z" />
                </svg>
              </div>
              <div>
                <p style={infoText}>+012 345 678 102</p>
                <p style={infoText}>+012 345 678 102</p>
              </div>
            </div>
  
            {/* Email */}
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={iconCircle}>
                <svg width="18" height="18" fill="none" stroke="#1a1a1a" strokeWidth="1.8" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="4" />
                  <path strokeLinecap="round" d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                </svg>
              </div>
              <div>
                <p style={infoText}>urname@email.com</p>
                <p style={{ ...infoText, color: "#7c3aed" }}>urwebsitenaem.com</p>
              </div>
            </div>
        
            {/* Address */}
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={iconCircle}>
                <svg width="18" height="18" fill="none" stroke="#1a1a1a" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </div>
              <div>
                <p style={infoText}>Address goes here,</p>
                <p style={infoText}>street, Crossroad 123.</p>
              </div>
            </div>
  
            {/* Follow Us */}
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", marginBottom: 16 }}>Follow Us</p>
              <div style={{ display: "flex", gap: 16 }}>
                {[
                  { d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                  { d: "M17.657 6.343A8 8 0 116.343 17.657 8 8 0 0117.657 6.343zM15 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-3 1a3.5 3.5 0 110 7 3.5 3.5 0 010-7z" },
                  { d: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" },
                  { d: "M7 16.5l-5-3L17 3l1 10-4-2-2 4-5-4.5z" },
                  { d: "M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 8v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                ].map((icon, i) => (
                  <a key={i} href="#" style={socialIcon}>
                    <svg width="14" height="14" fill="none" stroke="#1a1a1a" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon.d} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
  
          {/* Right — contact form */}
          <div style={{ flex: 1, background: "#ececec", padding: "56px 48px" }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1a1a1a", marginBottom: 28 }}>Get In Touch</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Name*"
                  style={inputStyle} />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email*"
                  style={inputStyle} />
              </div>
              <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject*"
                style={inputStyle} />
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your Message*"
                rows={6} style={{ ...inputStyle, resize: "vertical" }} />
              <div>
                <button type="submit" style={sendBtn}>SEND</button>
              </div>
            </form>
          </div>
        </div>
  
      </div>
    );
  }
  
  const iconCircle = {
    width: 44, height: 44, borderRadius: "50%", border: "1px solid #1a1a1a",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
  };
  const infoText = { fontSize: 13, color: "#444", margin: 0, lineHeight: 1.7 };
  const socialIcon = {
    width: 30, height: 30, borderRadius: "50%", border: "1px solid #aaa",
    display: "flex", alignItems: "center", justifyContent: "center", color: "#444"
  };
  const inputStyle = {
    width: "100%", padding: "12px 16px", fontSize: 13, color: "#444",
    background: "#f5f5f5", border: "1px solid #ddd", outline: "none",
    fontFamily: "'Poppins', sans-serif", boxSizing: "border-box", borderRadius: 0
  };
  const sendBtn = {
    padding: "12px 40px", background: "#1a1a1a", color: "#fff",
    fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
    border: "none", cursor: "pointer", borderRadius: 0, fontFamily: "'Poppins', sans-serif"
  };