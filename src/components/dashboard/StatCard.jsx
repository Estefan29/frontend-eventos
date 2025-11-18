import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../common/Card';

const StatCard = ({ icon: Icon, label, value, change, trend = 'up', color = '#3b82f6' }) => {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{
          backgroundColor: `${color}15`,
          padding: '12px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={28} color={color} />
        </div>
        
        {change && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: trend === 'up' ? '#dcfce7' : '#fee2e2',
            color: trend === 'up' ? '#16a34a' : '#dc2626',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {change}
          </div>
        )}
      </div>

      <h3 style={{
        color: '#6b7280',
        fontSize: '0.875rem',
        fontWeight: '500',
        marginBottom: '8px',
        margin: 0
      }}>
        {label}
      </h3>

      <p style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#1f2937',
        margin: 0
      }}>
        {value}
      </p>
    </Card>
  );
};

export default StatCard;