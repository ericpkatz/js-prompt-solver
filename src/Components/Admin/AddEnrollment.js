import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addEnrollment } from '../../store';

const AddEnrollment = ({ cohort })=> {
  const { admin : { courses, users, promptAttempts } } = useSelector(state => state);
  const notEnrolled = users.filter( user => !cohort.enrollments.map( enrollment => enrollment.user ).find( u => u.id === user.id));
  const dispatch = useDispatch();
  const create = (userId)=> {
    if(userId){
      dispatch(addEnrollment({ userId, cohortId: cohort.id }));
    }
  };
  return (
    <form>
      <select className='form-select' onChange={ (ev)=> create(ev.target.value) }>
        <option>Add Enrollment</option>
        {
          notEnrolled.map( user => {
            return <option key={ user.id } value={ user.id }>{ user.login }</option>
          })
        }
      </select>
    </form>
  );
};

export default AddEnrollment;
