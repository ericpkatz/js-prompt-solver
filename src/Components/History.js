import React from 'react';
import { useSelector } from 'react-redux';
import EnrollmentDetail from './common/EnrollmentDetail';
import BackToCodePrompts from './common/BackToCodePrompts';

const History = ()=> {
  const { enrollments } = useSelector(state => state);
  return (
    <div>
      <BackToCodePrompts />
      {
        enrollments.map( enrollment => {
          return (
            <EnrollmentDetail enrollment={ enrollment } key={ enrollment.id }/>
          );
        })
      }
    </div>
  );
};

export default History;
