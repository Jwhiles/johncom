import { useState, useEffect } from 'react';

export const DataTransferWidget = ({ position = 'bottom-right', theme = 'light', updateInterval = 1000, showDetailsInitial = false, stopAfterLoad = false }) => {
  const [totalBytes, setTotalBytes] = useState(0);
  const [resourceCounts, setResourceCounts] = useState({
    css: 0,
    js: 0,
    img: 0,
    font: 0,
    other: 0
  });
  const [showDetails, setShowDetails] = useState(showDetailsInitial);
  const [visible, setVisible] = useState(true);

  // Format bytes into human-readable format
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Update stats using Performance API
  const updateStats = () => {
    if (!window.performance || !window.performance.getEntries) return;
    
    const entries = window.performance.getEntries();
    let newTotal = 0;
    const newCounts = {
      css: 0,
      js: 0,
      img: 0,
      font: 0,
      other: 0
    };
    
    // Process each resource
    entries.forEach(entry => {
      // Only process resource entries
      if (entry.entryType === 'resource' && entry.transferSize) {
        newTotal += entry.transferSize;
        
        // Categorize by resource type
        if (entry.name.match(/\.css(\?|$)/)) {
          newCounts.css += entry.transferSize;
        } else if (entry.name.match(/\.js(\?|$)/)) {
          newCounts.js += entry.transferSize;
        } else if (entry.name.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/)) {
          newCounts.img += entry.transferSize;
        } else if (entry.name.match(/\.(woff|woff2|ttf|otf|eot)(\?|$)/)) {
          newCounts.font += entry.transferSize;
        } else {
          newCounts.other += entry.transferSize;
        }
      }
    });
    
    setTotalBytes(newTotal);
    setResourceCounts(newCounts);
  };

  useEffect(() => {
    // Start tracking when component mounts
    if (window.performance && window.performance.getEntries) {
      updateStats();
      
      // Set up interval for periodic updates
      const interval = setInterval(() => {
        updateStats();
      }, updateInterval);
      
      // Update when page loads
      window.addEventListener('load', () => {
        updateStats();
        
        // Final update after a short delay
        setTimeout(() => {
          updateStats();
          // Clear interval if stopAfterLoad is true
          if (stopAfterLoad) {
            clearInterval(interval);
          }
        }, 1000);
      });
      
      // Cleanup interval on unmount
      return () => clearInterval(interval);
    }
  }, [updateInterval, stopAfterLoad]);

  // Position styles
  const positionStyles = {
    'top-right': { top: '20px', right: '20px' },
    'top-left': { top: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' }
  };

  // Theme styles
  const themeStyles = {
    light: {
      backgroundColor: '#ffffff',
      color: '#333333'
    },
    dark: {
      backgroundColor: '#333333',
      color: '#ffffff'
    }
  };

  if (!visible) return null;

  return (
    <div 
      className="data-transfer-widget"
      style={{
        position: 'fixed',
        padding: '10px 15px',
        borderRadius: '8px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '14px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
        zIndex: 9999,
        ...positionStyles[position],
        ...themeStyles[theme]
      }}
    >
      <div 
        className="close-btn"
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          opacity: 0.6
        }}
        onClick={() => setVisible(false)}
      >
        ×
      </div>
      
      <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 600 }}>
        Data Transfer
      </h3>
      
      <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '5px' }}>
        {window.performance ? formatBytes(totalBytes) : 'API not supported'}
      </div>
      
      {showDetails && (
        <div style={{ marginTop: '10px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span>JavaScript:</span>
            <span>{formatBytes(resourceCounts.js)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span>CSS:</span>
            <span>{formatBytes(resourceCounts.css)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span>Images:</span>
            <span>{formatBytes(resourceCounts.img)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span>Fonts:</span>
            <span>{formatBytes(resourceCounts.font)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span>Other:</span>
            <span>{formatBytes(resourceCounts.other)}</span>
          </div>
        </div>
      )}
      
      <div 
        style={{ 
          display: 'inline-block', 
          marginTop: '5px', 
          cursor: 'pointer', 
          textDecoration: 'underline', 
          opacity: 0.8, 
          fontSize: '12px' 
        }}
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? 'Hide' : 'Show'} details
      </div>
    </div>
  );
};

