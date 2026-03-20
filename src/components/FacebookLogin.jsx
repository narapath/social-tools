import React, { useState } from 'react';
import { FaFacebook, FaBolt, FaUsers, FaShieldAlt, FaKey, FaCheckCircle, FaChevronDown, FaChevronUp, FaExternalLinkAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FacebookLogin = ({ onLogin, sdkError }) => {
  const [appId, setAppId] = useState(localStorage.getItem('fb_app_id') || '');
  const [showSettings, setShowSettings] = useState(!localStorage.getItem('fb_app_id'));
  const [showGuide, setShowGuide] = useState(false);

  const handleLoginClick = () => {
    if (!appId.trim()) {
      setShowSettings(true);
      alert('กรุณาใส่ Facebook App ID ก่อน (กดเปิด "ตั้งค่า App ID" ด้านล่าง)');
      return;
    }
    onLogin(appId.trim());
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh',
      textAlign: 'center',
      padding: '0 20px'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ maxWidth: '700px', width: '100%' }}
      >
        <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: '800', lineHeight: '1.1' }}>
          Supercharge your <br />
          <span className="gradient-text">Facebook Marketing</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '550px', margin: '0 auto 40px auto' }}>
          เชื่อมต่อ Facebook จริง ค้นหากลุ่มเป้าหมาย เข้ากลุ่มอัตโนมัติ และโพสต์ไปยังหลายกลุ่มพร้อมกัน
        </p>

        {/* Feature Icons */}
        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', marginBottom: '50px', flexWrap: 'wrap' }}>
          {[
            { icon: <FaBolt size={22} />, label: 'เชื่อมต่อจริง', color: 'var(--primary)' },
            { icon: <FaUsers size={22} />, label: 'ค้นหากลุ่ม', color: 'var(--secondary)' },
            { icon: <FaShieldAlt size={22} />, label: 'ขอสิทธิ์อัตโนมัติ', color: '#00c853' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ color: f.color }}>{f.icon}</div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{f.label}</span>
            </div>
          ))}
        </div>

        {/* Main Facebook Login Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLoginClick}
          style={{
            background: '#1877F2',
            color: 'white',
            border: 'none',
            padding: '18px 50px',
            borderRadius: '12px',
            fontSize: '1.2rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 4px 20px rgba(24, 119, 242, 0.5)',
            transition: 'all 0.3s ease',
            width: '100%',
            maxWidth: '450px',
            justifyContent: 'center'
          }}
        >
          <FaFacebook size={26} />
          เข้าสู่ระบบด้วย Facebook
        </motion.button>

        {/* Permissions info */}
        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          {[
            { label: 'โปรไฟล์', perm: 'public_profile' },
            { label: 'อีเมล', perm: 'email' },
          ].map((p, i) => (
            <span key={i} style={{
              background: 'rgba(24, 119, 242, 0.15)',
              color: '#7ab5ff',
              padding: '5px 14px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <FaShieldAlt size={10} /> {p.label}
            </span>
          ))}
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '10px' }}>
          กดปุ่มด้านบน → ระบบจะพาไปหน้า Facebook เพื่อขอสิทธิ์ → กลับมาที่เว็บนี้โดยอัตโนมัติ
        </p>

        {sdkError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              color: '#ff4b4b', fontSize: '0.85rem', marginTop: '20px',
              background: 'rgba(255, 75, 75, 0.1)', padding: '12px 18px', borderRadius: '10px',
              textAlign: 'left'
            }}
          >
            ⚠️ {sdkError}
          </motion.div>
        )}

        {/* Collapsible App ID Settings */}
        <div style={{ marginTop: '40px' }}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              cursor: 'pointer', fontSize: '0.85rem', display: 'inline-flex',
              alignItems: 'center', gap: '6px', padding: '8px 16px',
              borderRadius: '8px', transition: 'all 0.2s ease'
            }}
          >
            <FaKey size={12} /> ตั้งค่า App ID {showSettings ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
          </button>

          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="glass-card"
              style={{ padding: '25px', textAlign: 'left', marginTop: '10px' }}
            >
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                  Facebook App ID
                </label>
                <input
                  type="text"
                  placeholder="ใส่ App ID จาก developers.facebook.com เช่น 1234567890"
                  value={appId}
                  onChange={(e) => {
                    setAppId(e.target.value);
                    localStorage.setItem('fb_app_id', e.target.value);
                  }}
                  style={{ fontSize: '1rem' }}
                />
              </div>

              {appId.trim() && (
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px',
                  color: '#00c853', fontSize: '0.85rem',
                  background: 'rgba(0, 200, 83, 0.1)', padding: '8px 14px', borderRadius: '8px',
                  marginBottom: '15px'
                }}>
                  <FaCheckCircle size={12} /> App ID บันทึกแล้ว — กดปุ่ม "เข้าสู่ระบบด้วย Facebook" ด้านบนได้เลย
                </div>
              )}

              <div style={{ 
                background: 'rgba(0, 132, 255, 0.08)', padding: '15px', borderRadius: '10px',
                marginBottom: '15px', fontSize: '0.85rem', color: 'var(--text-muted)'
              }}>
                <strong style={{ color: 'white' }}>⚡ Redirect URI ที่ต้องตั้งค่าใน Facebook App:</strong>
                <div style={{ 
                  background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px', 
                  marginTop: '8px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#00d2ff',
                  wordBreak: 'break-all'
                }}>
                  {window.location.origin + window.location.pathname}
                </div>
                <p style={{ marginTop: '8px', fontSize: '0.78rem' }}>
                  คัดลอก URL นี้ไปวางใน Facebook App → Facebook Login → Settings → Valid OAuth Redirect URIs
                </p>
              </div>

              {/* Guide */}
              <button 
                className="btn-outline" 
                onClick={() => setShowGuide(!showGuide)}
                style={{ fontSize: '0.8rem', padding: '8px 16px' }}
              >
                {showGuide ? 'ซ่อนคำแนะนำ' : '📖 วิธีสร้าง Facebook App ID'}
              </button>

              {showGuide && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ marginTop: '15px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}
                >
                  <ol style={{ paddingLeft: '18px', color: 'var(--text-muted)', lineHeight: '2.2', fontSize: '0.85rem' }}>
                    <li>ไปที่ <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>developers.facebook.com</a> <FaExternalLinkAlt size={10} style={{ verticalAlign: 'middle' }} /></li>
                    <li>คลิก <strong style={{ color: 'white' }}>"My Apps"</strong> → <strong style={{ color: 'white' }}>"Create App"</strong></li>
                    <li>เลือก Use case: <strong style={{ color: 'white' }}>"Other"</strong> → Type: <strong style={{ color: 'white' }}>"Consumer"</strong></li>
                    <li>ตั้งชื่อ App → คลิก <strong style={{ color: 'white' }}>"Create App"</strong></li>
                    <li>ที่หน้า Dashboard คลิก <strong style={{ color: 'white' }}>"Add Product"</strong> → เลือก <strong style={{ color: 'white' }}>"Facebook Login"</strong> → <strong style={{ color: 'white' }}>"Set Up"</strong></li>
                    <li>ไปที่ <strong style={{ color: 'white' }}>"Facebook Login → Settings"</strong></li>
                    <li>ใน <strong style={{ color: 'white' }}>Valid OAuth Redirect URIs</strong> → เพิ่ม URL: <code style={{ color: '#00d2ff', background: 'rgba(0,210,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{window.location.origin}/</code></li>
                    <li>ไปที่ <strong style={{ color: 'white' }}>"Settings → Basic"</strong> → คัดลอก <strong style={{ color: '#00d2ff' }}>App ID</strong> มาวางที่ช่องด้านบน</li>
                    <li>ที่ "App Domains" เพิ่ม <strong style={{ color: 'white' }}>localhost</strong></li>
                    <li>กด <strong style={{ color: '#00c853' }}>Save Changes</strong> → กลับมากดปุ่ม "เข้าสู่ระบบด้วย Facebook" ได้เลย!</li>
                  </ol>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FacebookLogin;
