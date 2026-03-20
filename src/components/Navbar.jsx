import React from 'react';
import { FaFacebook, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="glass-card" style={{ 
      margin: '10px 20px', 
      padding: '12px 24px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky',
      top: '10px',
      zIndex: 1000,
      borderRadius: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          background: 'var(--primary)', 
          width: '40px', 
          height: '40px', 
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px var(--primary-glow)'
        }}>
          <FaFacebook size={24} color="white" />
        </div>
        <h2 style={{ fontSize: '1.4rem', margin: 0 }}>
          Social <span className="gradient-text">Tools</span>
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Active Account</div>
            </div>
            <img 
              src={user.picture?.data?.url || 'https://via.placeholder.com/32'} 
              alt="Profile" 
              style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--primary)' }} 
            />
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onLogout}
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: 'none', 
                color: '#ff4b4b',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <FaSignOutAlt size={18} />
            </motion.button>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaUserCircle size={20} />
            Not Connected
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
