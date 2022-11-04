import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createCohort } from '../../store';

const CreateCohort = ({ courseId, course })=> {
  const { admin : { courses, users, promptAttempts } } = useSelector(state => state);
  const [ name, setName ] = useState('');
  const [ error, setError ] = useState('');
  const dispatch = useDispatch();
  const _createCohort = async(ev)=> {
    ev.preventDefault();
    try {
      await dispatch(createCohort({ name, courseId }));
      setName('');
      setError('');
    }
    catch(ex){
      setError(ex.response.data);
    }
  };
  return (
    <form onSubmit={ _createCohort }>
      {
        !!error && <pre className='error'>
        {
          JSON.stringify(error, null, 2)
        }
        </pre>
      }
      <input value={ name } placeholder={`add new cohort for ${ course.title }`} onChange={ ev => setName(ev.target.value )}/>
      <button disabled={ !name }>Create Cohort</button>
    </form>
  );
};

export default CreateCohort;
