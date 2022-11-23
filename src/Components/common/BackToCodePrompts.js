import React from 'react';
import { Link } from 'react-router-dom';
import Back from './Back';

const BackToCodePrompts = ({ enrollment })=> {
  return (
    <Back url={`/enrollments/${enrollment.id}`} text='Back to Prompt Solver' />
  );
};

export default BackToCodePrompts;
