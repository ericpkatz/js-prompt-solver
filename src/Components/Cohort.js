import React, { useEffect } from 'react';
import { useParams, Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { attemptLogin, logout, fetchCourses, fetchCohorts, fetchPromptAttempts, fetchAssignments } from '../store';
import AdminDashboard from './Admin/Dashboard';
import PromptAttempt from './PromptAttempt';

const Cohort = ()=> {
  const { promptAttempts, codePrompts, auth, enrollments, assignments } = useSelector(state => state);
  const { id } = useParams();
  const enrollment = enrollments.find( enrollment => enrollment.id === id );
  if(!enrollment){
    return null;
  }
  const cohort = enrollment.cohort; 
  let shown = false;
  return (
            <div key={ cohort.id}>
              <h2>{ cohort.name } { cohort.course.title }</h2>
              <Link to={`/cohorts/${cohort.id}/feedback`}>Feedback</Link>
              <div>
                {
                  !cohort.topic && <div>You have no assignments</div> 
                }
                
                <ul>
                  {
                    !!cohort.topic && 
                    cohort
                      .topic
                      .codePrompts
                      .sort((a, b)=> a.rank - b.rank)
                      .map( codePrompt => {
                        const promptAttempt = enrollment.promptAttempts
                          .find(promptAttempt => promptAttempt.codePromptId === codePrompt.id) || {
                            codePromptId: codePrompt.id, enrollmentId: enrollment.id }
                        if(shown || promptAttempt.submitted){
                          return null;
                        }
                        if(!promptAttempt.submitted){
                          shown = true;
                        }
                        return (
                          <div key = {codePrompt.id }>
                          ({ codePrompt.rank })
                          <PromptAttempt key={ codePrompt.id } promptAttempt = { promptAttempt} codePrompt={ codePrompt }/>
                          </div>
                        );
                      })
                  }
                </ul>
                {
                  !shown && cohort.topic && cohort.topic.codePrompts.length && <div>You have attempted all of your code prompts for this topic. Would you like to practice more, or leave feedback for others?</div>
                }
              </div>
            </div>
          );
};

export default Cohort;
