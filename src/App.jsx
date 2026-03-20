import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FacebookLogin from './components/FacebookLogin';
import GroupSearch from './components/GroupSearch';
import AutoPost from './components/AutoPost';
import facebookService from './services/facebook';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaPaperPlane, FaShieldAlt, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

const App = () => {
  const [user, setUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [sdkError, setSdkError] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [toast, setToast] = useState(null);

  // ─── Handle redirect callback on page load ───────────────
  useEffect(() => {
    const init = async () => {
      // Check if this is a redirect callback from Facebook
      try {
        const callback = facebookService.handleRedirectCallback();
        if (callback) {
          // We just got a new token from Facebook redirect
          setLoading(true);
          setLoadingMsg('กำลังโหลดโปรไฟล์...');
          await loadProfile();
          setLoading(false);
          setLoadingMsg('');
          return;
        }
      } catch (e) {
        console.error('Redirect callback error:', e);
        setSdkError(`เกิดข้อผิดพลาดจากการเชื่อมต่อ Facebook: ${e.message}. โปรดตรวจสอบว่าคุณได้ตั้งค่า Redirect URI ใน Facebook App ถูกต้องแล้ว`);
        showToast('การเชื่อมต่อล้มเหลว', 'error');
      }

      // Check if we have a saved token
      if (facebookService.isTokenValid()) {
        setLoading(true);
        setLoadingMsg('กำลังตรวจสอบ session...');
        const valid = await facebookService.validateToken();
        if (valid) {
          await loadProfile();
        }
        setLoading(false);
        setLoadingMsg('');
      }
    };
    init();
  }, []);

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadProfile = async () => {
    try {
      const profile = await facebookService.getProfile();
      setUser(profile);
      const perms = await facebookService.getPermissions();
      setPermissions(perms);
      showToast(`ยินดีต้อนรับ ${profile.name}! 🎉`, 'success');
    } catch (e) {
      console.error('Profile load error:', e);
      showToast('ไม่สามารถโหลดโปรไฟล์ได้: ' + (e.message || e), 'error');
    }
  };

  // ─── Login (redirect to Facebook) ────────────────────────
  const handleLogin = (appId) => {
    if (!appId) {
      setSdkError('กรุณาระบุ Facebook App ID ในส่วนการตั้งค่าด้านล่าง');
      return;
    }
    setSdkError('');
    try {
      facebookService.startLogin(appId);
    } catch (e) {
      setSdkError(`ไม่สามารถเริ่มการเชื่อมต่อได้: ${e.message}`);
    }
  };

  // ─── Manual Token Login ──────────────────────────────────
  const handleManualToken = async (token) => {
    setLoading(true);
    setLoadingMsg('กำลังตรวจสอบ Token...');
    setSdkError('');
    try {
      facebookService.setAccessToken(token);
      await loadProfile();
      showToast('เชื่อมต่อด้วย Token สำเร็จ!', 'success');
    } catch (e) {
      console.error('Manual token error:', e);
      setSdkError(`Token ไม่ถูกต้องหรือหมดอายุ: ${e.message}`);
      facebookService.logout();
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };

  // ─── Logout ───────────────────────────────────────────────
  const handleLogout = () => {
    facebookService.logout();
    setUser(null);
    setSearchResults([]);
    setSelectedGroups([]);
    setPermissions([]);
    showToast('ออกจากระบบแล้ว', 'info');
  };

  // ─── Search Groups ────────────────────────────────────────
  const handleSearch = async (keyword) => {
    setLoading(true);
    setLoadingMsg(`กำลังค้นหากลุ่ม "${keyword}"...`);
    try {
      const groups = await facebookService.searchGroups(keyword);
      setSearchResults(groups);
      showToast(`พบ ${groups.length} กลุ่ม`, 'success');
    } catch (e) {
      showToast('ค้นหาไม่สำเร็จ: ' + (e.message || e), 'error');
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };

  // ─── Load My Groups ───────────────────────────────────────
  const handleLoadMyGroups = async () => {
    setLoading(true);
    setLoadingMsg('กำลังโหลดกลุ่มของคุณ...');
    try {
      const groups = await facebookService.getMyGroups();
      setSearchResults(groups);
      showToast(`โหลด ${groups.length} กลุ่มของคุณ`, 'success');
    } catch (e) {
      showToast('โหลดกลุ่มไม่สำเร็จ: ' + (e.message || e), 'error');
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };

  // ─── Toggle Group Selection ───────────────────────────────
  const handleToggleSelect = (group) => {
    setSelectedGroups(prev => {
      const exists = prev.find(g => g.id === group.id);
      if (exists) return prev.filter(g => g.id !== group.id);
      return [...prev, group];
    });
  };

  const handleRemoveGroup = (groupId) => {
    setSelectedGroups(prev => prev.filter(g => g.id !== groupId));
  };

  // ─── Post to Groups ──────────────────────────────────────
  const handlePost = async (groupIds, message, link, delayMs) => {
    setLoading(true);
    setLoadingMsg(`กำลังโพสต์ไปยัง ${groupIds.length} กลุ่ม...`);
    try {
      const results = await facebookService.batchPost(groupIds, message, link, delayMs, (current, total) => {
        setLoadingMsg(`กำลังโพสต์ ${current + 1}/${total}...`);
      });
      const successCount = results.filter(r => r.success).length;
      showToast(`โพสต์สำเร็จ ${successCount}/${groupIds.length} กลุ่ม`, successCount === groupIds.length ? 'success' : 'warning');
      return results;
    } catch (e) {
      showToast('เกิดข้อผิดพลาด: ' + (e.message || e), 'error');
      return [];
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };

  return (
    <div className="App">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FacebookLogin 
                onLogin={handleLogin} 
                onManualToken={handleManualToken}
                sdkError={sdkError}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Permissions Dashboard */}
              {permissions.length > 0 && (
                <div className="glass-card" style={{ 
                  padding: '16px 20px', marginBottom: '15px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.85rem' }}>
                    <FaShieldAlt color="var(--primary)" size={14} />
                    <strong>สิทธิ์การเข้าถึง Facebook</strong>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {permissions.map((p, i) => {
                      const granted = p.status === 'granted';
                      const declined = p.status === 'declined';
                      const permLabels = {
                        'public_profile': 'โปรไฟล์',
                        'email': 'อีเมล',
                        'groups_access_member_info': 'ข้อมูลกลุ่ม',
                        'publish_to_groups': 'โพสต์ในกลุ่ม',
                        'user_managed_groups': 'จัดการกลุ่ม'
                      };
                      return (
                        <span key={i} style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          padding: '4px 12px', borderRadius: '16px', fontSize: '0.75rem',
                          background: granted ? 'rgba(0,200,83,0.12)' : declined ? 'rgba(255,75,75,0.12)' : 'rgba(255,193,7,0.12)',
                          color: granted ? '#00c853' : declined ? '#ff4b4b' : '#ffc107'
                        }}>
                          {granted ? <FaCheckCircle size={10} /> : declined ? <FaTimesCircle size={10} /> : <FaExclamationTriangle size={10} />}
                          {permLabels[p.permission] || p.permission}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                <button 
                  className={activeTab === 'search' ? 'btn-primary' : 'btn-outline'} 
                  onClick={() => setActiveTab('search')}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <FaSearch size={14} /> ค้นหากลุ่ม
                  {searchResults.length > 0 && (
                    <span style={{
                      background: 'rgba(255,255,255,0.15)', 
                      padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem'
                    }}>{searchResults.length}</span>
                  )}
                </button>
                <button 
                  className={activeTab === 'autopost' ? 'btn-primary' : 'btn-outline'} 
                  onClick={() => setActiveTab('autopost')}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <FaPaperPlane size={14} /> โพสต์อัตโนมัติ
                  {selectedGroups.length > 0 && (
                    <span style={{
                      background: 'var(--primary)', color: 'white',
                      padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem'
                    }}>{selectedGroups.length}</span>
                  )}
                </button>
              </div>

              {activeTab === 'search' ? (
                <GroupSearch 
                  results={searchResults} 
                  onSearch={handleSearch} 
                  isLoading={loading}
                  selectedGroups={selectedGroups}
                  onToggleSelect={handleToggleSelect}
                  onLoadMyGroups={handleLoadMyGroups}
                />
              ) : (
                <AutoPost
                  selectedGroups={selectedGroups}
                  onRemoveGroup={handleRemoveGroup}
                  onPost={handlePost}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(5px)', zIndex: 9999, flexDirection: 'column', gap: '15px'
        }}>
          <div className="spinner"></div>
          <div style={{ color: 'white', fontSize: '1rem' }}>{loadingMsg || 'กำลังโหลด...'}</div>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            style={{
              position: 'fixed', bottom: '30px', left: '50%',
              padding: '14px 25px', borderRadius: '12px', fontSize: '0.9rem',
              zIndex: 10000, display: 'flex', alignItems: 'center', gap: '10px',
              background: toast.type === 'success' ? 'rgba(0, 200, 83, 0.9)' :
                         toast.type === 'error' ? 'rgba(255, 75, 75, 0.9)' :
                         toast.type === 'warning' ? 'rgba(255, 193, 7, 0.9)' :
                         'rgba(0, 132, 255, 0.9)',
              color: 'white',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
