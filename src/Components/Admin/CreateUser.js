import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createUser } from '../../store';

const CreateUser = ({ courseId })=> {
  const { admin : { courses, users, promptAttempts } } = useSelector(state => state);
  const [ login, setLogin ] = useState('');
  const [ error, setError ] = useState('');
  const dispatch = useDispatch();
  const _createLogin = async(ev)=> {
    ev.preventDefault();
    try {
      await dispatch(createUser({ login }));
      setLogin('');
      setError('');
    }
    catch(ex){
      setError(ex.response ? ex.response.data : ex.message);
    }
  };
  return (
    <form onSubmit={ _createLogin }>
      {
        !!error && <pre className='error'>
        {
          JSON.stringify(error, null, 2)
        }
        </pre>
      }
      <div className='mb-3'>
      <input className='form-control' value={ login } placeholder='github login' onChange={ ev => setLogin(ev.target.value )}/>
      </div>
      <button disabled={ !login } className='btn btn-primary btn-sm'>Create User</button>
    </form>
  );
};

export default CreateUser;
