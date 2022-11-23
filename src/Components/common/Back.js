import React from 'react';
import { Link } from 'react-router-dom';

const Back = ({ text, url })=> {
  return (
      <h3><Link style={{ textDecoration: 'none'}} to={ url }><i className="bi bi-arrow-left-square-fill me-2"></i>{ text }</Link></h3>
  );
};

export default Back;
