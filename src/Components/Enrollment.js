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
  const unreviewedFeedback = feedbacksTo.filter(feedback=> !feedback.reviewed && feedback.promptAttempt.enrollmentId === enrollment.id);
  let shown = false;
  //todo - get unacknowledged feedbacks
  const seen = {};
  const seenForThem = {};
  return (
            <div key={ cohort.id}>
              <ul>
                <li><strong>Your Course:</strong> { cohort.course.title }</li>
                <li><strong>Your Cohor:</strong> { cohort.name }</li>
                {
                 !!cohort.topic && <li><strong>Your Cohorts Current Topic:</strong> { cohort.topic.title }</li>
                }
              </ul>
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
                          <PromptAttempt key={ codePrompt.id } promptAttempt = { promptAttempt} codePrompt={ codePrompt }/>
                          </div>
                        );
                      })
                  }
                </ul>
                <div>
                {
                  unreviewedFeedback.map( feedback=> {
                    if(seen[feedback.promptAttemptId]){
                      return null;
                    }
                    seen[feedback.promptAttemptId] = true;
                    return (
                      <div className='alert alert-success' key={ feedback.id }>
                        You have received <Link to={`/enrollments/${enrollment.id}/feedbacks/${feedback.promptAttemptId}`}>feedback</Link> for <strong>{ feedback.promptAttempt.codePrompt.title }</strong> from { feedback.enrollment.user.login }

                      </div>
                    );
                  })
                }
                </div>
                <div>
                {
                  availableFeedbackMap.map( promptAttempt => {
                    if(promptAttempt.feedbacks.find(feedback=> feedback.enrollmentId === enrollment.id)){
                      return null;
                    }
                    if(seenForThem[promptAttempt.codePromptId]){
                      return null;
                    }
                    seenForThem[promptAttempt.codePromptId] = true;
                    return (
                      <div className='alert alert-primary' key={ promptAttempt.id }>
                        You can leave {promptAttempt.enrollment.user.login } <Link to={`/enrollments/${enrollment.id}/feedbacks/${promptAttempt.id}/leave`}>feedback</Link> for <strong>{ promptAttempt.codePrompt.title }</strong>

                      </div>
                    );
                  })
                }
                </div>
                
                {
                  !shown && !!cohort.topic && <div>
                    Looks like you are all done with the code prompts for <strong>{ cohort.topic.title }</strong>. Would you like to take a look back at some of your work? <Link to='/history'>History</Link>
                  </div>
                }
              </div>
            </div>
          );
};

export default Enrollment;
