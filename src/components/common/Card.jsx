const Card = ({ children, className, style, hover = true }) => {
  const baseStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.3s',
    ...style
  };

  const hoverStyle = hover ? {
    onMouseOver: (e) => {
      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    },
    onMouseOut: (e) => {
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
    }
  } : {};

  return (
    <div 
      className={className}
      style={baseStyle}
      {...hoverStyle}
    >
      {children}
    </div>
  );
};

export default Card;