import React from 'react';
import { useSelector } from 'react-redux';

const AdminDashboard = ()=> {
  const { admin : { courses } } = useSelector(state => state);
  return (
    <div>
      Placeholder for admin Dashboard
      <ul>
        {
          courses.map( course => {
            return (
              <li key={ course.id }>
                { course.title }
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default AdminDashboard;
