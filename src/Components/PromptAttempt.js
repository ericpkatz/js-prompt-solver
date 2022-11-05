import React, { useState, useEffect } from 'react';
import { savePromptAttempt } from '../store';
import { useDispatch } from 'react-redux';
import { formatDate, executeCode, _logger } from '../utils';

const PromptAttempt = ({ promptAttempt, codePrompt })=> {
  const [el, setEl] = useState(null);
  const [elScaffold, setElScaffold] = useState(null);
  const [editor, setEditor] = useState(null);
  const [ _console, setConsole] = useState(null);
  const dispatch = useDispatch();

  useEffect(()=> {
    if(elScaffold){
      console.log(elScaffold);
      const _editor = CodeMirror(elScaffold, {
        value: (codePrompt && codePrompt.scaffold) ? codePrompt.scaffold.trim() : '', 
        lineNumbers: false,
        language: 'javascript',
        readOnly: true,
        viewportMargin: Infinity
      });
      _editor.setSize('100%', '3rem');
    }
  }, [elScaffold]);

  useEffect(()=> {
    if(el){
      const _editor = CodeMirror(el, {
        value: promptAttempt.attempt || '', 
        lineNumbers: true,
        language: 'javascript'
      });
      setEditor(_editor);
      _editor.on('change', ev => {
        setAttempt(ev.getValue());
        
      });
    }
  }, [el]);
  const [attempt, setAttempt] = useState(promptAttempt.attempt || '');

  const _executeCode = ()=> {
    const logger = _logger(_console);
    executeCode(`${(codePrompt && codePrompt.scaffold) ? codePrompt.scaffold.trim() : ''};${editor.getValue()}`, logger, JSHINT);
  }

  const save = ev => {
    ev.preventDefault();
    _executeCode();
    promptAttempt = {...promptAttempt, attempt: editor.getValue(), submitted: document.activeElement.id === 'submit' ? true : false };
    dispatch(savePromptAttempt(promptAttempt));
  }
  console.log(codePrompt);

  return (
    <div>
      <form onSubmit={ save }>
        <div className='scaffold' ref={el => setElScaffold(el)}></div>
        <div id='ide'>
          <div ref={el => setEl(el)}></div>
          <div className='console' ref={el => setConsole(el)}></div>
        </div>
        <div>
          <button id='run' disabled={!attempt}>Run Your Code</button>
          <button id='submit' disabled={ !promptAttempt.id }>Submit Your Code to Get Next Prompt</button>
        </div>
      </form>
    </div>
  );
};

export default PromptAttempt;
