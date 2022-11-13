import React, { useEffect } from 'react';
import { useParams, Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { attemptLogin, logout, fetchCourses, fetchCohorts, fetchPromptAttempts, fetchAssignments, resetTopic } from '../store';
import AdminDashboard from './Admin/Dashboard';
import PromptAttempt from './PromptAttempt';

const Enrollment = ()=> {
  const { promptAttempts, codePrompts, auth, enrollments, assignments, feedbacksTo, availableFeedbackMap } = useSelector(state => state);
  const { id } = useParams();
  const dispatch = useDispatch();
  const enrollment = enrollments.find( enrollment => enrollment.id === id );
  if(!enrollment){
    return null;
  }
  const cohort = enrollment.cohort; 
  const unreviewedFeedback = feedbacksTo.filter(feedback=> !feedback.reviewed && feedback.promptAttempt.enrollment.id === enrollment.id);
  let shown = false;
  //todo - get unacknowledged feedbacks
  return (
            <div key={ cohort.id}>
              <h2>{ cohort.name } { cohort.course.title }</h2>
              <div>
                {
                  !cohort.topic && <div>You have no assignments</div> 
                }
    <pre>
{ JSON.stringify(availableFeedbackMap, null, 2) }
    </pre>
                <div>
                {
                  unreviewedFeedback.map( feedback=> {
                    return (
                      <div className='alert alert-primary' key={ feedback.id }>
                        You have <Link to={`/enrollments/${enrollment.id}/feedbacks/${feedback.promptAttemptId}`}>feedback</Link> to review for <strong>{ feedback.promptAttempt.codePrompt.title }</strong>

                      </div>
                    );
                  })
                }
                </div>
                
                <ul>
                  {
                    !!cohort.topic && 
                    cohort
                      .topic
                      .codePrompts
                      .sort((a, b)=> a.rank - b.rank)
                      .map( codePrompt => {
                        const promptAttempt = enrollment.promptAttempts
                          .filter(promptAttempt => !promptAttempt.archived)
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
                  !shown && cohort.topic && cohort.topic.codePrompts.length && <div>You have attempted all of your code prompts for this topic. Would you like to practice more, or leave feedback for others? Or would you like to archive these codePrompts and do these again? Practice, practice, practice! <button className='btn btn-primary btn-sm' onClick={ ()=> dispatch(resetTopic({ topicId: cohort.topicId, enrollmentId: enrollment.id}))}>Reset This Topic</button></div>
                }
              </div>
            </div>
          );
};

export default Enrollment;
