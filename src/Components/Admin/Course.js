import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CreateCohort from './CreateCohort';
import CreateUser from './CreateUser';
import AssignTopic from './AssignTopic';
import { deleteUser, deleteCohort, deleteEnrollment } from '../../store';
import { Link, useParams } from 'react-router-dom';

const Course = ()=> {
  const { admin : { courses, users, topics, promptAttempts } } = useSelector(state => state);
  const { id } = useParams();
  const dispatch = useDispatch();
  const course = courses.find( course => course.id === id);
  if(!course){
    return null;
  }
  console.log(course);
  const filteredTopics = topics.filter(topic => topic.courseId === course.id);
  return (
    <div id='admin-dashboard'>
      <section>
        <h2><Link to='/admin'>Courses</Link> - { course.title }</h2>
        <h3>Topics</h3>
        <ul>
          {
            filteredTopics.map( topic => {
              const cohortsWithTopic = course.cohorts.filter( cohort => cohort.activeTopicId === topic.id);
              return (
                <li key={ topic.id }>
                  {
                    topic.title
                  }
                  <ul>
                    {
                      cohortsWithTopic.map( cohort => {
                        return (
                          <li key={ cohort.id }>
                            Currently assigned to { cohort.name }
                            <button className='btn btn-danger btn-sm ms-2'>x</button>
                          </li>
                        );
                      })
                    }
                  </ul>
                  ({ topic.codePrompts.length })
                  <AssignTopic topic={ topic } cohorts={ course.cohorts }/>
                </li>
              );
            })
          }
        </ul>
      </section>
    </div>
  );
};

export default Course;
