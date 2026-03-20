import React, { useState } from 'react';
import { FaSearch, FaUsers, FaLock, FaGlobe, FaPlus, FaCheck, FaPaperPlane, FaExternalLinkAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const GroupSearch = ({ results, onSearch, isLoading, selectedGroups, onToggleSelect, onLoadMyGroups, onAddManualGroup }) => {
  const [keyword, setKeyword] = useState('');
  const [manualInput, setManualInput] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) onSearch(keyword);
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onAddManualGroup(manualInput.trim());
      setManualInput('');
    }
  };

  const isSelected = (groupId) => selectedGroups.some(g => g.id === groupId);

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Search & Add Box */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
        {/* Keyword Search */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}>
            <FaSearch size={14} color="var(--primary)" />
            ค้นหาด้วย Keyword (กลุ่มที่เป็นสมาชิก)
          </h3>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                type="text" 
                placeholder="เช่น ขายของ, Marketing..." 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{ paddingLeft: '38px', fontSize: '0.9rem' }}
              />
              <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '13px' }} />
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading} style={{ padding: '0 15px' }}>
              <FaSearch />
            </button>
          </form>
          <button 
            type="button" 
            className="btn-outline" 
            onClick={onLoadMyGroups} 
            disabled={isLoading} 
            style={{ width: '100%', marginTop: '12px', fontSize: '0.85rem' }}
          >
            📋 โหลดกลุ่มทั้งหมดของฉัน
          </button>
        </div>

        {/* Manual Add by Link */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}>
            <FaPlus size={14} color="var(--secondary)" />
            เพิ่มกลุ่มด้วยลิงก์ (รวดเร็ว)
          </h3>
          <form onSubmit={handleManualAdd} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="วางลิงก์กลุ่ม หรือ ID กลุ่ม..." 
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              style={{ flex: 1, fontSize: '0.9rem' }}
            />
            <button type="submit" className="btn-secondary" disabled={isLoading} style={{ padding: '0 15px' }}>
              เพิ่ม
            </button>
          </form>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px' }}>
            เหมาะสำหรับ: กลุ่มที่ค้นหาไม่เจอ แต่คุณมี URL ของกลุ่มนั้นๆ
          </p>
        </div>
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
                        {group.privacy === 'OPEN' || group.privacy === 'Public' ? <FaGlobe size={11} /> : <FaLock size={11} />}
                        {(group.privacy === 'OPEN' || group.privacy === 'Public') ? 'สาธารณะ' : 'ส่วนตัว'}
                      </span>
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
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <FaSearch size={40} style={{ opacity: 0.1, marginBottom: '20px', color: 'white' }} />
          <h4 style={{ color: 'white', marginBottom: '10px' }}>ไม่พบผลลัพธ์การค้นหา?</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '450px', margin: '0 auto 25px auto' }}>
            เนื่องจากข้อจำกัดของ Facebook API ระบบไม่สามารถค้นหากลุ่มสาธารณะภายนอกด้วย Keyword ได้โดยตรง
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <button 
              className="btn-primary" 
              onClick={() => window.open(`https://www.facebook.com/search/groups?q=${encodeURIComponent(keyword || 'ค้นหากลุ่ม')}`, '_blank')}
            >
              🔍 ค้นหาบน Facebook.com
            </button>
            <button 
              className="btn-outline" 
              onClick={onLoadMyGroups}
            >
              📋 โหลดกลุ่มของฉัน
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupSearch;
