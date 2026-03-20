import React, { useState } from 'react';
import { FaFacebook, FaBolt, FaUsers, FaShieldAlt, FaKey, FaCheckCircle, FaChevronDown, FaChevronUp, FaExternalLinkAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FacebookLogin = ({ onLogin, onManualToken, sdkError }) => {
  const [appId, setAppId] = useState(localStorage.getItem('fb_app_id') || '');
  const [showSettings, setShowSettings] = useState(!localStorage.getItem('fb_app_id'));
  const [showGuide, setShowGuide] = useState(false);
  const [loginMethod, setLoginMethod] = useState('standard'); // 'standard' or 'manual'
  const [manualToken, setManualToken] = useState('');

  const handleLoginClick = () => {
    if (loginMethod === 'manual') {
      if (!manualToken.trim()) {
        alert('กรุณาวาง Access Token ก่อน');
        return;
      }
      onManualToken(manualToken.trim());
      return;
    }

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
        
        {/* Connection Tabs */}
        <div style={{ 
          display: 'inline-flex', background: 'rgba(255,255,255,0.05)', 
          padding: '4px', borderRadius: '12px', marginBottom: '30px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <button 
            onClick={() => setLoginMethod('standard')}
            style={{ 
              padding: '10px 24px', borderRadius: '10px', fontSize: '0.9rem',
              background: loginMethod === 'standard' ? 'var(--primary)' : 'transparent',
              color: 'white', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease'
            }}
          >
            มาตรฐาน (Redirect)
          </button>
          <button 
            onClick={() => setLoginMethod('manual')}
            style={{ 
              padding: '10px 24px', borderRadius: '10px', fontSize: '0.9rem',
              background: loginMethod === 'manual' ? 'var(--primary)' : 'transparent',
              color: 'white', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease'
            }}
          >
            ด่วน (ใช้ Token) ⚡
          </button>
        </div>

        {loginMethod === 'standard' ? (
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '550px', margin: '0 auto 40px auto' }}>
              เชื่อมต่อ Facebook จริง ค้นหากลุ่มเป้าหมาย เข้ากลุ่มอัตโนมัติ และโพสต์ไปยังหลายกลุ่มพร้อมกัน
            </p>

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
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ maxWidth: '500px', margin: '0 auto' }}
          >
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '20px' }}>
              วาง Access Token จาก Graph API Explorer เพื่อเชื่อมต่อทันที
            </p>
            <div className="glass-card" style={{ padding: '20px', textAlign: 'left', marginBottom: '25px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
                Facebook Access Token
              </label>
              <textarea 
                rows="3"
                placeholder="EAA..."
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                style={{ 
                  width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', color: 'white', padding: '12px', fontSize: '0.9rem',
                  outline: 'none', resize: 'none'
                }}
              />
              <button 
                onClick={handleLoginClick}
                className="btn-primary"
                style={{ width: '100%', marginTop: '15px', padding: '15px' }}
              >
                เชื่อมต่อด้วย Token นี้ 🚀
              </button>
            </div>
            
            <a 
              href="https://developers.facebook.com/tools/explorer/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'var(--primary)', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              ไปเอา Token จาก Graph API Explorer <FaExternalLinkAlt size={12} />
            </a>
          </motion.div>
        )}

        {/* Permissions info */}
        <div style={{ marginTop: '30px', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          {[
            { label: 'โปรไฟล์', perm: 'public_profile' },
            { label: 'อีเมล', perm: 'email' },
            { label: 'ข้อมูลกลุ่ม', perm: 'groups_access_member_info' },
            { label: 'การจัดการกลุ่ม', perm: 'user_managed_groups' },
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
            <FaKey size={12} /> ตั้งค่า App ID (วิธีมาตรฐาน) {showSettings ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
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
                  <FaCheckCircle size={12} /> App ID บันทึกแล้ว — กดปุ่มสถานะ "มาตรฐาน" แล้วกดล็อกอินได้เลย
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
                    <li>ไปที่ <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>developers.facebook.com</a></li>
                    <li>ที่หน้า Dashboard คลิก <strong style={{ color: 'white' }}>"Add Product"</strong> → เลือก <strong style={{ color: 'white' }}>"Facebook Login"</strong></li>
                    <li>ใน <strong style={{ color: 'white' }}>Valid OAuth Redirect URIs</strong> → เพิ่ม URL: <code style={{ color: '#00d2ff' }}>{window.location.origin}/</code></li>
                    <li>ไปที่ "Settings → Basic" คัดลอก App ID มาวางที่ช่องด้านบน</li>
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
