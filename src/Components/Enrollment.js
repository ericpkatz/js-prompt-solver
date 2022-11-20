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
                <li><strong>Your Cohort:</strong> { cohort.name }</li>
                {
                 !!cohort.topic && <li><strong>Your Topic:</strong> { cohort.topic.title }</li>
                }
              </ul>
              <div>
                {
                  !cohort.topic && <div>You have no assignments</div> 
                }
                <div>
                {
                  unreviewedFeedback.map( feedback=> {
                    if(seen[feedback.promptAttemptId]){
                      return null;
                    }
                    seen[feedback.promptAttemptId] = true;
                    return (
                      <div className='alert alert-primary' key={ feedback.id }>
                        You have received <Link to={`/enrollments/${enrollment.id}/feedbacks/${feedback.promptAttemptId}`}>feedback</Link> for <strong>{ feedback.promptAttempt.codePrompt.title }</strong>

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
                        You can leave <Link to={`/enrollments/${enrollment.id}/feedbacks/${promptAttempt.id}/leave`}>feedback</Link> for <strong>{ promptAttempt.codePrompt.title }</strong>

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
                        console.log(promptAttempt);
                        return (
                          <div key = {codePrompt.id }>
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
