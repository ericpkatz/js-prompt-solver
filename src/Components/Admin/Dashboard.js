import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CreateCohort from './CreateCohort';
import CreateUser from './CreateUser';
import CreateCourse from './CreateCourse';
import AddEnrollment from './AddEnrollment';
import SetTopicForCohort from './SetTopicForCohort';
import { deleteUser, deleteCohort, deleteEnrollment } from '../../store';
import { Link } from 'react-router-dom';

const AdminDashboard = ()=> {
  const { admin : { courses, users, promptAttempts } } = useSelector(state => state);
  const dispatch = useDispatch();
  return (
    <div id='admin-dashboard'>
      <section className='me-3'>
      <h2>Courses</h2>
      <CreateCourse />
      <ul>
        {
          courses.map( course => {
            return (
              <li key={ course.id }>
                <h3><Link to={`/admin/courses/${course.id}`}>{ course.title }</Link></h3>
                <CreateCohort course={ course } courseId={ course.id }/>
                <ul>
                  {
                    course.cohorts.map( cohort => {
                      return (
                        <li key={ cohort.id } className='cohort-card'>
                          <h4>{ cohort.name }
                          <button className='ms-2 btn btn-danger btn-sm' onClick={ ()=> dispatch(deleteCohort(cohort)) }>x</button>
                          </h4>
                          {
                            cohort.topicId && <div>{ cohort.topic.title }</div>
                          }
                          <SetTopicForCohort cohort={ cohort }/>
                          <AddEnrollment cohort={ cohort }/>
                          <ul>
                            {
                              cohort.enrollments.map( ({ user, id, promptAttempts }) => {
                                return (
                                  <li key={ user.id }>
                                    <Link to={ `/admin/enrollments/${ id }`}>{
                                      user.login
                                    } ({ promptAttempts.length })
                                    </Link>
                                    <button className='ms-2 btn btn-danger btn-sm' onClick={ ()=> dispatch(deleteEnrollment(id))}>x</button>
                                  </li>
                                );
                              })
                            }
                          </ul>
                        </li>
                      );
                    })
                  }
                </ul>
              </li>
            );
          })
        }
      </ul>
      </section>
      <section>
      <h2>Users</h2>
      <CreateUser />
      <ul>
        {
          users.map( user => {
            return (
              <li key={ user.id }>
                <Link to={`/admin/users/${user.id}`}>{ user.login }</Link>
                <pre>
                  <a href={`/login/${user.token}`}>login</a>
                </pre>
                <button className='ms-2 btn btn-danger btn-sm' onClick={ ()=> dispatch(deleteUser(user)) }>x</button>
              </li>
            )
          })
        }
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;
