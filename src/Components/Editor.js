import React, { useRef, useState, useEffect } from 'react';
import { savePromptAttempt, removeStudentTest } from '../store';
import { useDispatch } from 'react-redux';
import { formatDate, executeCode, _logger } from '../utils';

const Editor = ({ promptAttempt })=> {
  const [el, setEl] = useState(null);
  const [editor, setEditor] = useState(null);
  const [ _console, setConsole] = useState(null);
  const runButton = useRef();

  useEffect(()=> {
    if(el){
      const _editor = CodeMirror(el, {
        value: promptAttempt.attempt, 
        lineNumbers: true,
        language: 'javascript'
      });
      setEditor(_editor);
    }
  }, [el]);


  const _executeCode = (test)=> {
    const logger = _logger(_console);
    executeCode(`${editor.getValue()};${ test || ''}`, logger, JSHINT);
  }

  const save = async(ev) => {
    ev.preventDefault();
    const elem = document.activeElement;
    _executeCode();
  }

  return (
    <div>
      <form onSubmit={ save }>
        <div id='ide'>
          <div ref={el => setEl(el)}></div>
          <div className='console' ref={el => setConsole(el)}></div>
        </div>
        <div className='mt-2'>
          <button ref={ runButton } id='run' className='btn btn-primary btn-sm me-2' >Run Your Code</button>
        </div>
      </form>
    </div>
  );
};

export default Editor;
