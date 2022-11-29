import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Editor from './Editor';
import Back from './common/Back';

const Practice = ()=> {
  const { id } = useParams();
  const { enrollments } = useSelector(state => state);
  const promptAttempts = enrollments.reduce((acc, enrollment)=> {
    acc = [...acc, ...enrollment.promptAttempts]
    return acc;
  }, []);
  const promptAttempt = promptAttempts.find(promptAttempt => promptAttempt.id === id);
  if(!promptAttempt){
    return null;
  }
  return (
    <div>
      <Back url='/history' text='Back to History' />
      <h2>Practice: { promptAttempt.codePrompt.title }</h2>
      <Editor promptAttempt={ promptAttempt }/>
    </div>
  );
};

export default Practice;
