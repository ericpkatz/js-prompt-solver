import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEnrollment } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import EnrollmentDetail from '../common/EnrollmentDetail';
import Back from '../common/Back';

const Enrollments = ()=> {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { admin: { enrollments }} = useSelector(state => state);
  const enrollment = enrollments[id];

  useEffect(()=> {
    if(!enrollment){
      dispatch(fetchEnrollment(id))
    }
  }, [id]);

  if(!enrollment){
    return null;
  }

  return (
    <div>
      <Back url='/' text='Back to Admin' />
      <EnrollmentDetail enrollment={ enrollment } userView={ false }/>
    </div>
  );
};

export default Enrollments;
