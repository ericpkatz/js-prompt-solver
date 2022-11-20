import React from 'react';
import { Link } from 'react-router-dom';

const BackToCodePrompts = ({ enrollment })=> {
  return (
      <h3><Link style={{ textDecoration: 'none'}}to={`/enrollments/${enrollment.id}`}><i className="bi bi-arrow-left-square-fill me-2"></i>Back to Prompt Solver</Link></h3>
  );
};

export default BackToCodePrompts;
