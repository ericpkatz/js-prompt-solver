import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CreateCohort from './CreateCohort';
import CreateUser from './CreateUser';
import AddEnrollment from './AddEnrollment';
import { deleteUser, deleteCohort, deleteEnrollment } from '../../store';
import { Link, useParams } from 'react-router-dom';

const AdminDashboard = ()=> {
  const { admin : { courses, users, topics, promptAttempts } } = useSelector(state => state);
  const { id } = useParams();
  const dispatch = useDispatch();
  const course = courses.find( course => course.id === id);
  if(!course){
    return null;
  }
  const _topics = topics.filter(topic => topic.courseId === course.id);
  return (
    <div id='admin-dashboard'>
      <section>
        <h2><Link to='/admin'>Courses</Link> - { course.title }</h2>
        <h3>Topics</h3>
        <pre>
    {
      JSON.stringify(course, null, 2)
    }
    {
      JSON.stringify(_topics, null, 2)
    }
        </pre>
      </section>
    </div>
  );
};

export default AdminDashboard;
