import React, { useEffect } from 'react';
import { useParams, Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { attemptLogin, logout, fetchCourses, fetchCohorts, fetchPromptAttempts, fetchAssignments } from '../store';
import AdminDashboard from './Admin/Dashboard';
import PromptAttempt from './PromptAttempt';

const Cohort = ()=> {
  const { promptAttempts, codePrompts, auth, cohorts, assignments } = useSelector(state => state);
  const { id } = useParams();
  const cohort = cohorts.find(cohort => cohort.id === id);
  if(!cohort){
    return null;
  }
  const filteredAssignments = assignments
    .filter(assignment => assignment.cohortId === cohort.id)
    .filter(({ due, assigned }) => {
      const now = new Date();
      return now > new Date(assigned) && now < new Date(due); 
    });
  let shown = false;
  return (
            <div key={ cohort.id}>
              <h2>{ cohort.name } { cohort.course.title }</h2>
              <Link to={`/cohorts/${cohort.id}/feedback`}>Feedback</Link>
              <div>
                {
                  filteredAssignments.map( assignment => {
                    return (
                      <div key={ assignment.id }>
                        { assignment.topic.title }
                        ({ new Date(assignment.assigned).toLocaleDateString() })-({ new Date(assignment.due).toLocaleDateString() })
                        <ul>
                          {
                            assignment.topic.codePrompts.sort((a, b)=> a.rank*1 - b.rank*1).map( (codePrompt, idx) => {
                              const promptAttempt = promptAttempts.find( promptAttempt => promptAttempt.codePromptId === codePrompt.id) || { assignmentId: assignment.id, enrollmentId: cohort.enrollment.id, codePromptId: codePrompt.id };
                              if(promptAttempt.submitted || shown){
                                return null;
                              }
                              shown = true;
                              return (
                                <li key={ codePrompt.id }>
                                  <pre>
                                  { codePrompt.title }
                                  </pre>
                                  ({ idx + 1} of { assignment.topic.codePrompts.length})
                                  <PromptAttempt promptAttempt={ promptAttempt } codePrompt={ codePrompt }/>
                                </li>
                              );
                            })
                          }
                          {
                            !shown && <li>You have completed all prompts for this topic</li>
                          }
                        </ul>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          );
};

export default Cohort;
