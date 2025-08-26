import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import './StatsCard.scss';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  trend = null, 
  color = 'primary',
  onClick = null 
}) => {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend.type === 'positive' ? <FiTrendingUp /> : <FiTrendingDown />;
  };

  return (
    <div 
      className={`stats-card ${color} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <div className="stats-header">
        <div className="stats-icon">
          {icon}
        </div>
        <div className="stats-info">
          <h3 className="stats-title">{title}</h3>
          <div className="stats-value">{formatValue(value)}</div>
        </div>
      </div>
      
      {trend && (
        <div className={`stats-trend ${trend.type}`}>
          {getTrendIcon()}
          <span className="trend-value">{trend.value}</span>
          <span className="trend-label">{trend.label}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
