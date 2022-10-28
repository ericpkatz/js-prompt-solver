import React, { useState, useEffect } from 'react';
import { savePromptAttempt } from '../store';
import { useDispatch } from 'react-redux';

const PromptAttempt = ({ promptAttempt })=> {
  const [el, setEl] = useState(null);
  const [editor, setEditor] = useState(null);
  const dispatch = useDispatch();

  useEffect(()=> {
    if(el){
      const _editor = CodeMirror(el, {
        value: promptAttempt.attempt || '', 
        lineNumbers: true,
        language: 'javascript'
      });
      setEditor(_editor);
    }
  }, [el]);
  const [attempt, setAttempt] = useState(promptAttempt.attempt || '');

  const save = ev => {
    ev.preventDefault();
    console.log('we have the prompt? Can we assume the enrollment? Prompt, to topic. Is the topic currently assigned to an enrollment the cohort is in?');
    promptAttempt = {...promptAttempt, attempt: editor.getValue(), submitted: document.activeElement.id === 'submit' ? true : false };
    dispatch(savePromptAttempt(promptAttempt));
  }

  return (
    <div>
      <form onSubmit={ save }>
        <div ref={el => setEl(el)}></div>
        <div>
          <button id='run'>Run</button>
          <button id='submit' disabled={ !promptAttempt.id }>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default PromptAttempt;
