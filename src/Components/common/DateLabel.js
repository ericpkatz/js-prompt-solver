import React from 'react';

const DateLabel = ({ date })=> {
  return <span className='badge bg-secondary'>{ date.toLocaleString() }</span>
};

export default DateLabel;
