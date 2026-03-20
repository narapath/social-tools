import React, { useState } from 'react';
import { FaPaperPlane, FaTimes, FaCheckCircle, FaTimesCircle, FaExternalLinkAlt, FaUsers, FaSpinner, FaLink } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AutoPost = ({ selectedGroups, onRemoveGroup, onPost }) => {
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [posting, setPosting] = useState(false);
  const [results, setResults] = useState([]);
  const [delay, setDelay] = useState(3);

  const handlePost = async () => {
    if (!message.trim()) {
      alert('กรุณาพิมพ์ข้อความก่อนโพสต์');
      return;
    }
    if (selectedGroups.length === 0) {
      alert('กรุณาเลือกกลุ่มอย่างน้อย 1 กลุ่ม');
      return;
    }

    setPosting(true);
    setResults([]);

    const groupIds = selectedGroups.map(g => g.id);
    const postResults = await onPost(groupIds, message.trim(), link.trim() || null, delay * 1000);
    
    // Map results with group names
    const enrichedResults = postResults.map(r => {
      const group = selectedGroups.find(g => g.id === r.groupId);
      return { ...r, groupName: group?.name || r.groupId };
    });
    setResults(enrichedResults);
    setPosting(false);
  };

  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Left: Post Editor */}
        <div className="glass-card" style={{ padding: '25px' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
            <FaPaperPlane size={16} color="var(--primary)" />
            เขียนโพสต์
          </h3>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>ข้อความ *</label>
            <textarea
              placeholder="พิมพ์ข้อความที่ต้องการโพสต์ลงกลุ่ม..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--card-border)',
                borderRadius: '12px',
                padding: '14px',
                color: 'white',
                fontSize: '0.95rem',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'Outfit, sans-serif',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              <FaLink size={10} /> ลิงก์แนบ (ไม่บังคับ)
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              ⏱️ หน่วงเวลาระหว่างโพสต์ (วินาที): <strong style={{ color: 'white' }}>{delay}s</strong>
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              style={{ 
                width: '100%', padding: '0', height: '6px', 
                background: 'rgba(255,255,255,0.1)', borderRadius: '3px',
                appearance: 'auto', border: 'none'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>1s (เร็ว)</span>
              <span>30s (ปลอดภัย)</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary"
            onClick={handlePost}
            disabled={posting || selectedGroups.length === 0 || !message.trim()}
            style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center' }}
          >
            {posting ? (
              <><FaSpinner className="spin" /> กำลังโพสต์...</>
            ) : (
              <><FaPaperPlane /> โพสต์ไปยัง {selectedGroups.length} กลุ่ม</>
            )}
          </motion.button>
        </div>

        {/* Right: Selected Groups & Results */}
        <div>
          {/* Selected Groups */}
          <div className="glass-card" style={{ padding: '20px', marginBottom: '15px' }}>
            <h4 style={{ marginBottom: '12px', fontSize: '0.95rem' }}>
              <FaUsers size={14} /> กลุ่มที่เลือก ({selectedGroups.length})
            </h4>
            {selectedGroups.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                ไปที่แท็บ "ค้นหากลุ่ม" เพื่อเลือกกลุ่มเป้าหมาย
              </p>
            ) : (
              <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedGroups.map(group => (
                  <div key={group.id} style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                      <img 
                        src={group.picture?.data?.url || group.icon || 'https://via.placeholder.com/30'}
                        alt="" 
                        style={{ width: '28px', height: '28px', borderRadius: '6px' }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/30?text=G'; }}
                      />
                      <span style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {group.name}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveGroup(group.id)}
                      style={{ background: 'none', border: 'none', color: '#ff4b4b', cursor: 'pointer', padding: '4px' }}
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Post Results */}
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card"
              style={{ padding: '20px' }}
            >
              <h4 style={{ marginBottom: '12px', fontSize: '0.95rem' }}>
                📊 ผลลัพธ์การโพสต์
              </h4>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ 
                  background: 'rgba(0, 200, 83, 0.1)', padding: '10px 15px', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', gap: '8px', color: '#00c853', fontSize: '0.9rem'
                }}>
                  <FaCheckCircle /> สำเร็จ: {successCount}
                </div>
                {failCount > 0 && (
                  <div style={{ 
                    background: 'rgba(255, 75, 75, 0.1)', padding: '10px 15px', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4b4b', fontSize: '0.9rem'
                  }}>
                    <FaTimesCircle /> ล้มเหลว: {failCount}
                  </div>
                )}
              </div>
              <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {results.map((r, i) => (
                  <div key={i} style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px',
                    fontSize: '0.8rem', padding: '6px 10px', borderRadius: '6px',
                    background: r.success ? 'rgba(0,200,83,0.05)' : 'rgba(255,75,75,0.05)'
                  }}>
                    {r.success ? <FaCheckCircle color="#00c853" size={12} /> : <FaTimesCircle color="#ff4b4b" size={12} />}
                    <span style={{ flex: 1 }}>{r.groupName}</span>
                    {r.success && r.postId && (
                      <a 
                        href={`https://facebook.com/${r.postId}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <FaExternalLinkAlt size={10} />
                      </a>
                    )}
                    {!r.success && <span style={{ color: '#ff4b4b', fontSize: '0.7rem' }}>{r.error}</span>}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Fast Joiner Section */}
      <div className="glass-card" style={{ padding: '25px', marginTop: '20px' }}>
        <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
          🚀 Fast Joiner
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '15px' }}>
          เปิดลิงก์กลุ่มเป้าหมายทีละกลุ่มเพื่อส่งคำขอเข้าร่วม (Facebook ไม่อนุญาตให้เข้ากลุ่มอัตโนมัติผ่าน API แต่เราจะช่วยเปิดให้คุณรวดเร็ว)
        </p>
        {selectedGroups.length > 0 ? (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={() => {
                selectedGroups.forEach((g, i) => {
                  setTimeout(() => {
                    window.open(`https://facebook.com/groups/${g.id}`, '_blank');
                  }, i * 1500);
                });
              }}
            >
              🚀 เปิดทุกกลุ่ม ({selectedGroups.length} กลุ่ม)
            </button>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', alignSelf: 'center' }}>
              จะเปิดแท็บใหม่ทีละกลุ่ม ห่างกัน 1.5 วินาที
            </span>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            เลือกกลุ่มจากแท็บ "ค้นหากลุ่ม" ก่อน
          </p>
        )}
      </div>
    </div>
  );
};

export default AutoPost;
