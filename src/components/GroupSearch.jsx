import React, { useState } from 'react';
import { FaSearch, FaUsers, FaLock, FaGlobe, FaPlus, FaCheck, FaPaperPlane, FaExternalLinkAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const GroupSearch = ({ results, onSearch, isLoading, selectedGroups, onToggleSelect, onLoadMyGroups }) => {
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) onSearch(keyword);
  };

  const isSelected = (groupId) => selectedGroups.some(g => g.id === groupId);

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Search Box */}
      <div className="glass-card" style={{ padding: '25px', marginBottom: '25px' }}>
        <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
          <FaSearch size={16} color="var(--primary)" />
          ค้นหากลุ่มเป้าหมาย
        </h3>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative', minWidth: '200px' }}>
            <input 
              type="text" 
              placeholder="พิมพ์คำค้นหา เช่น ขายของออนไลน์, Freelance, Marketing..." 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ paddingLeft: '42px' }}
            />
            <FaSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '14px' }} />
          </div>
          <button type="submit" className="btn-primary" disabled={isLoading} style={{ whiteSpace: 'nowrap' }}>
            {isLoading ? '🔄 กำลังค้นหา...' : '🔍 ค้นหากลุ่ม'}
          </button>
          <button type="button" className="btn-outline" onClick={onLoadMyGroups} disabled={isLoading} style={{ whiteSpace: 'nowrap' }}>
            📋 โหลดกลุ่มของฉัน
          </button>
        </form>
      </div>

      {/* Results Count */}
      {results.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            พบ <strong style={{ color: 'white' }}>{results.length}</strong> กลุ่ม
            {selectedGroups.length > 0 && (
              <> | เลือกแล้ว <strong style={{ color: 'var(--primary)' }}>{selectedGroups.length}</strong> กลุ่ม</>
            )}
          </span>
        </div>
      )}

      {/* Group Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '16px' 
      }}>
        <AnimatePresence>
          {results.map((group, index) => {
            const selected = isSelected(group.id);
            return (
              <motion.div 
                key={group.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className="glass-card"
                style={{ 
                  padding: '18px', 
                  position: 'relative', 
                  overflow: 'hidden',
                  border: selected ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                  transition: 'border-color 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => onToggleSelect(group)}
              >
                {/* Selected badge */}
                {selected && (
                  <div style={{ 
                    position: 'absolute', top: '10px', right: '10px', 
                    background: 'var(--primary)', borderRadius: '50%',
                    width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <FaCheck size={12} color="white" />
                  </div>
                )}

                <div style={{ display: 'flex', gap: '14px' }}>
                  <img 
                    src={group.picture?.data?.url || group.icon || 'https://via.placeholder.com/60'} 
                    alt={group.name} 
                    style={{ width: '55px', height: '55px', borderRadius: '12px', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/60?text=G'; }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '0.95rem', lineHeight: '1.25', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: selected ? '30px' : '0' }}>
                      {group.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.78rem', flexWrap: 'wrap' }}>
                      {group.member_count && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaUsers size={11} /> {Number(group.member_count).toLocaleString()} สมาชิก
                        </span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {group.privacy === 'OPEN' ? <FaGlobe size={11} /> : <FaLock size={11} />}
                        {group.privacy === 'OPEN' ? 'สาธารณะ' : 'ส่วนตัว'}
                      </span>
                      {group.administrator && (
                        <span style={{ color: '#ffc107', fontSize: '0.7rem' }}>👑 Admin</span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn-outline" 
                    style={{ flex: 1, padding: '7px', fontSize: '0.8rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://facebook.com/groups/${group.id}`, '_blank');
                    }}
                  >
                    <FaExternalLinkAlt size={10} /> เปิดกลุ่ม
                  </button>
                  <button 
                    className={selected ? 'btn-primary' : 'btn-outline'}
                    style={{ flex: 1, padding: '7px', fontSize: '0.8rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSelect(group);
                    }}
                  >
                    {selected ? <><FaCheck size={10} /> เลือกแล้ว</> : <><FaPlus size={10} /> เลือกกลุ่ม</>}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {results.length === 0 && !isLoading && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <FaSearch size={40} style={{ opacity: 0.3, marginBottom: '15px' }} />
          <p>ค้นหากลุ่มด้วย keyword หรือกด "โหลดกลุ่มของฉัน" เพื่อเริ่มใช้งาน</p>
        </div>
      )}
    </div>
  );
};

export default GroupSearch;
