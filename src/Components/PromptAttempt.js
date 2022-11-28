import React, { useRef, useState, useEffect } from 'react';
import { savePromptAttempt, removeStudentTest } from '../store';
import { useDispatch } from 'react-redux';
import { formatDate, executeCode, _logger } from '../utils';
import { updatePromptAttemptTest, fetchAvailableFeedbackMap, fetchFeedbacksTo, createPromptAttemptTest } from '../store';

const EditPromptAttemptTest = ({ promptAttemptTest, idx, updateHook })=> {
  const [test, setTest] = useState(promptAttemptTest.test);

  const dispatch = useDispatch();
  const onChange = (ev)=> {
    setTest({...test, [ev.target.name]: ev.target.value});
  };

  useEffect(()=> {
    setTest(promptAttemptTest.test )
  }, [promptAttemptTest]);

  const _updatePromptAttemptTest = async()=> {
    await dispatch(updatePromptAttemptTest({...promptAttemptTest, test }));
    updateHook();
  };

  const _removeStudentTest = async()=> {
    await dispatch(removeStudentTest(promptAttemptTest));
    updateHook();
  };
  return (
    <tr>
      <td>
        Student Test { idx + 1 }
      </td>
      <td>
        <input className='form-control' placeholder='input' name='input' value={ test.input } onChange={ onChange } autocomplete='off'/>
      </td>
      <td>
        <select name='operator' className='form-control' value={ test.operator } onChange={ onChange }>
          <option value='EQUALS'>equals</option>
          <option value='NEQUALS'>not equals</option>
        </select>
      </td>
      <td>
        <input className='form-control' placeholder='output' name='output' value={ test.output } onChange={ onChange } autocomplete='off'/>
      </td>
      <td>
        <select name='outputDataType' className='form-control' value={ test.outputDataType } onChange={ onChange }>

          <option value='STRING'>string</option>
          <option value='NUMERIC'>number</option>
        </select>
      </td>
      <td>
        <button onClick={()=> _updatePromptAttemptTest()} data-ignore='true' className='btn btn-primary btn-sm me-2' disabled={ !test.output || !test.input || (
          test.output === promptAttemptTest.test.output
          &&
          test.input === promptAttemptTest.test.input
          &&
          test.outputDataType === promptAttemptTest.test.outputDataType
          &&
          test.operator === promptAttemptTest.test.operator
        )}>
          Update Test
        </button>
        <button className='btn btn-danger btn-sm' onClick={ _removeStudentTest }>
        Remove Test
        </button>
      </td>
    </tr>
  );
};

const CreatePromptAttemptTest = ({ promptAttempt, updateHook, createHook })=> {
  const INITIAL = {
    input: '',
    output: '',
    operator: 'EQUALS',
    outputDataType: 'NUMERIC'
  } 
  const [test, setTest] = useState({...INITIAL});

  const dispatch = useDispatch();
  const onChange = (ev)=> {
    setTest({...test, [ev.target.name]: ev.target.value});
  };

  const _createPromptAttemptTest = async()=> {
    let _promptAttempt = promptAttempt;
    if(!promptAttempt.id){
      _promptAttempt = await createHook();
    }
    await dispatch(createPromptAttemptTest({test, promptAttempt: _promptAttempt }));
    setTest({ ...INITIAL });
    updateHook();
  };
  return (
    <tr>
      <td>
      </td>
      <td>
        <input className='form-control' placeholder='input' name='input' value={ test.input } onChange={ onChange } autoComplete='off'/>
      </td>
      <td>
        <select name='operator' className='form-control' value={ test.operator } onChange={ onChange }>
          <option value='EQUALS'>equals</option>
          <option value='NEQUALS'>not equals</option>
        </select>
      </td>
      <td>
        <input className='form-control' placeholder='output' name='output' value={ test.output } onChange={ onChange } autoComplete='off'/>
      </td>
      <td>
        <select name='outputDataType' className='form-control' value={ test.outputDataType } onChange={ onChange }>

          <option value='STRING'>string</option>
          <option value='NUMERIC'>number</option>
        </select>
      </td>
      <td>
        <button onClick={()=> _createPromptAttemptTest()} data-ignore='true' className='btn btn-primary btn-sm' disabled={ !test.output || !test.input }>Create Test</button>
      </td>
    </tr>
  );
};


const PromptAttempt = ({ promptAttempt, codePrompt })=> {
  const [el, setEl] = useState(null);
  const [editor, setEditor] = useState(null);
  const [ _console, setConsole] = useState(null);
  const dispatch = useDispatch();
  const runButton = useRef();

  useEffect(()=> {
    if(el){
      const _editor = CodeMirror(el, {
        value: promptAttempt.attempt || codePrompt.scaffold, 
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
    executeCode(`${editor.getValue()};${ test || ''}`, logger, JSHINT);
  }

  const save = async(ev) => {
    ev.preventDefault();
    const elem = document.activeElement;
    if(elem.getAttribute('data-ignore')){
      return;
    }
    if(elem.classList.contains('btn-danger')){
      return;//removing student test
    }
    const tests = codePrompt.codePromptTests.map((_, idx)=> {
      return runTest(idx);
    }).join(';');
    const studentTests = (promptAttempt.promptAttemptTests || []).map((_, idx)=> {
      return studentTest(idx)
    }).join(';');
    _executeCode(tests + studentTests);
    
    promptAttempt = {...promptAttempt, attempt: editor.getValue(), submitted: document.activeElement.id === 'submit' ? true : false };
    await dispatch(savePromptAttempt(promptAttempt));
    dispatch(fetchFeedbacksTo());
    dispatch(fetchAvailableFeedbackMap());
  }

  const studentTest = (idx)=> {
    const { input, output, operator, outputDataType } = promptAttempt.promptAttemptTests[idx].test;
    const code = `
if(${input} ${operator === 'EQUALS' ? '===' : ''} ${ outputDataType === 'STRING' ? "'": ''}${output} ${ outputDataType === 'STRING' ? "'": ''}){
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

  if(promptAttempt.promptAttemptTests){
    promptAttempt.promptAttemptTests.sort((a, b)=> new Date(a.createdAt) - new Date(b.createdAt));
  }

  const createHook = async()=> {
    _executeCode();
    
    promptAttempt = {...promptAttempt, attempt: editor.getValue(), submitted: false };
    promptAttempt = await dispatch(savePromptAttempt(promptAttempt, true));
    return promptAttempt;
  };
  return (
    <div>
      <h3>{ codePrompt.title }</h3>
      <form onSubmit={ save }>
        <div id='ide'>
          <div ref={el => setEl(el)}></div>
          <div className='console' ref={el => setConsole(el)}></div>
        </div>
      <div>
      <h3>Tests</h3>
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Input</th>
            <th>Operation</th>
            <th>Output</th>
            <th>Output Data Type</th>
            <th></th>
          </tr>
        </thead>
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
            <EditPromptAttemptTest key={ promptAttemptTest.id } promptAttemptTest={ promptAttemptTest } idx={ idx } updateHook={ ()=> {
              runButton.current.focus();
              runButton.current.click()}
            }/>
          );
        })
      }
    <CreatePromptAttemptTest createHook={ createHook } promptAttempt={ promptAttempt } updateHook={ ()=> {
              runButton.current.focus();
              runButton.current.click();

    }}/>
        </tbody>
      </table>
      </div>
        <div className='mt-2'>
          <button ref={ runButton } id='run' className='btn btn-primary btn-sm me-2' >Run and Save Your Code</button>
          <button id='submit' className='btn btn-warning btn-sm' disabled={ !promptAttempt.id }>Submit Your Code to Get Next Prompt</button>
        </div>
      </form>
    </div>
  );
};

export default PromptAttempt;
