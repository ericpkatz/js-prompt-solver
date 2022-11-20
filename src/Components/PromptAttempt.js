import React, { useState, useEffect } from 'react';
import { savePromptAttempt, removeStudentTest } from '../store';
import { useDispatch } from 'react-redux';
import { formatDate, executeCode, _logger } from '../utils';

const PromptAttempt = ({ promptAttempt, codePrompt })=> {
  const [el, setEl] = useState(null);
  const [elScaffold, setElScaffold] = useState(null);
  const [elScaffoldAfter, setElScaffoldAfter] = useState(null);
  const [editor, setEditor] = useState(null);
  const [ _console, setConsole] = useState(null);
  const dispatch = useDispatch();

  useEffect(()=> {
    if(elScaffold){
      const _editor = CodeMirror(elScaffold, {
        value: (codePrompt && codePrompt.scaffold) ? codePrompt.scaffold.trim() : '', 
        lineNumbers: false,
        language: 'javascript',
        readOnly: true,
        viewportMargin: Infinity
      });
      const lines = codePrompt.scaffold.split('\n').length;
      _editor.setSize('100%', `${lines * 1.5}rem`);
    }
  }, [elScaffold]);

  useEffect(()=> {
    if(elScaffoldAfter){
      const _editor = CodeMirror(elScaffoldAfter, {
        value: codePrompt.scaffoldAfter.trim(), 
        lineNumbers: false,
        language: 'javascript',
        readOnly: true,
        viewportMargin: Infinity
      });
      const lines = codePrompt.scaffoldAfter.split('\n').length;
      _editor.setSize('100%', `${lines * 1.5}rem`);
    }
  }, [elScaffold]);

  useEffect(()=> {
    if(el){
      const _editor = CodeMirror(el, {
        value: promptAttempt.attempt || '//your code here', 
        lineNumbers: true,
        language: 'javascript'
      });
      console.log(codePrompt.id, 'create');
      setEditor(_editor);
      _editor.on('change', ev => {
        setAttempt(ev.getValue());
      });
    }
  }, [el]);

  const [attempt, setAttempt] = useState(promptAttempt.attempt || '');

  const _executeCode = (test)=> {
    const logger = _logger(_console);
    executeCode(`${codePrompt.scaffold};${editor.getValue()};${codePrompt.scaffoldAfter};${ test || ''}`, logger, JSHINT);
  }

  const save = ev => {
    ev.preventDefault();
    if(document.activeElement.classList.contains('btn-danger')){
      return;//removing student test
    }
    //const idx = document.activeElement.getAttribute('data-idx'); 

    /*
    if(idx){
      runTest(idx*1);
    }
    else {
      _executeCode();
    }
    */
    const tests = codePrompt.codePromptTests.map((_, idx)=> {
      return runTest(idx);
    }).join(';');
    const studentTests = (promptAttempt.promptAttemptTests || []).map((_, idx)=> {
      return studentTest(idx)
    }).join(';');
    _executeCode(tests + studentTests);
    
    promptAttempt = {...promptAttempt, attempt: editor.getValue(), submitted: document.activeElement.id === 'submit' ? true : false };
    dispatch(savePromptAttempt(promptAttempt));
  }

  const studentTest = (idx)=> {
    const { input, output, operator, outputDataType } = promptAttempt.promptAttemptTests[idx].test;
    const code = `
if(${input} ${operator === 'EQUALS' ? '===' : ''} ${output}){
  console.log('Student Test ${idx + 1} passes');
}
else {
  console.log('Student Test ${idx + 1} does not pass');
}
    `;
    return code;
  };

  const runTest = (idx)=> {
    const { input, output, operator, outputDataType } = codePrompt.codePromptTests[idx].test;
    const code = `
if(${input} ${operator === 'EQUALS' ? '===' : ''} ${output}){
  console.log('Test ${idx + 1} passes');
}
else {
  console.log('Test ${idx + 1} does not pass');
}
    `;
    return code;
  };

  return (
    <div>
      <h3>{ codePrompt.title }</h3>
      <form onSubmit={ save }>
        <div className='scaffold' ref={el => setElScaffold(el)}></div>
        <div id='ide'>
          <div ref={el => setEl(el)}></div>
          <div className='console' ref={el => setConsole(el)}></div>
        </div>
        <div className='scaffold' ref={el => setElScaffoldAfter(el)}></div>
      <div>
      <h3>Tests</h3>
      <table className='table'>
        <tbody>
      {
        codePrompt.codePromptTests.map( (codePromptTest, idx) => {
          const { test } = codePromptTest;
          return (
            <tr key={ test.id }>
              <td>
                Test { idx + 1 }
              </td>
              <td>
                { test.input }
              </td>
              <td>
                { test.operator }
              </td>
              <td>
                { test.output }
              </td>
              <td>
                { test.outputDataType }
              </td>
              <td>
              </td>
            </tr>
          );
        })
      }
      {
        !!promptAttempt.id && promptAttempt.promptAttemptTests.map( (promptAttemptTest, idx) => {
          const { test } = promptAttemptTest;
          return (
            <tr key={ test.id }>
              <td>
                Student Test { idx + 1 }
              </td>
              <td>
                { test.input }
              </td>
              <td>
                { test.operator }
              </td>
              <td>
                { test.output }
              </td>
              <td>
                { test.outputDataType }
              </td>
              <td>
                <button className='btn btn-danger btn-sm' onClick={ ()=> dispatch(removeStudentTest(promptAttemptTest))}>
                Remove Student Test
                </button>
              </td>
            </tr>
          );
        })
      }
        </tbody>
      </table>
      </div>
        <div className='mt-2'>
          <button id='run' className='btn btn-primary btn-sm me-2' >Run and Save Your Code</button>
          <button id='submit' className='btn btn-warning btn-sm' disabled={ !promptAttempt.id }>Submit Your Code to Get Next Prompt</button>
        </div>
      </form>
    </div>
  );
};

export default PromptAttempt;
