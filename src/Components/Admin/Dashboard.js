import React from 'react';
import { useSelector } from 'react-redux';

const AdminDashboard = ()=> {
  const { admin : { courses, users, promptAttempts } } = useSelector(state => state);
  return (
    <div id='admin-dashboard'>
      <section>
      <h2>Courses</h2>
      <ul>
        {
          courses.map( course => {
            return (
              <li key={ course.id }>
                { course.title }
                <form>
                  <input placeholder='add cohort'/>
                </form>
                <ul>
                  {
                    course.cohorts.map( cohort => {
                      return (
                        <li key={ cohort.id }>
                          { cohort.name }
                          <form>
                            <select>
                              <option>Add Enrollment</option>
                            </select>
                          </form>
                          <ul>
                            {
                              cohort.users.map( user => {
                                const _promptAttempts = promptAttempts.filter( promptAttempt => promptAttempt.enrollmentId === user.enrollment.id);
                                return (
                                  <li key={ user.id }>
                                    {
                                      user.login
                                    } ({ _promptAttempts.length })
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
      <ul>
        {
          users.map( user => {
            return (
              <li key={ user.id }>
                { user.login }
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
