import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createCourse } from '../../store';

const CreateCourse = ()=> {
  const el = useRef();
  const dispatch = useDispatch();
  const [data, setData] = useState('');
  useEffect(()=> {
    el.current.addEventListener('change', (ev)=> {
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', ()=> {
        setData(reader.result);
      });
    });
  }, [el]);

  const _createCohort = (ev)=> {
    ev.preventDefault();
    dispatch(createCourse(data));
  };
  return (
    <form onSubmit={ _createCohort }>
      <div className='mb-3'>
      <input type='file' className='form-control' ref={ el }/>
      </div>
      <button disabled={ !data } className='btn btn-primary btn-sm'>Create Course</button>
    </form>
  );
};

export default CreateCourse;
