import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEnrollment } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import EnrollmentDetail from '../common/EnrollmentDetail';
import Back from '../common/Back';

const Enrollments = ()=> {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin: { enrollments, courses }} = useSelector(state => state);
  const enrollment = enrollments[id];

  useEffect(()=> {
    if(!enrollment){
      dispatch(fetchEnrollment(id))
    }
  }, [id]);

  if(!enrollment){
    return null;
  }
  const course = courses.find(course => course.id === enrollment.cohort.courseId);
  let otherEnrollees = [];
  if(course){
    otherEnrollees = course.cohorts.find(cohort => cohort.id === enrollment.cohortId).enrollments; 
  }

  return (
    <div>
      <Back url='/admin' text='Back to Admin' />
      <select onChange={ ev => navigate(`/admin/enrollments/${ev.target.value}`)} value={id}  className='form-control mt-2 mb-2'>
        {
          otherEnrollees.map( enrollee => {
            return (
              <option key={enrollee.id} value={enrollee.id}>{ enrollee.user.login }</option>
            );
          })
        }
      </select>
      <EnrollmentDetail enrollment={ enrollment } userView={ false }/>
    </div>
  );
};

export default Enrollments;
