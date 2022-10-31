import React, { useEffect } from 'react';
import { useParams, Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { attemptLogin, logout, fetchCourses, fetchCohorts, fetchPromptAttempts, fetchAssignments } from '../store';
import AdminDashboard from './Admin/Dashboard';
import PromptAttempt from './PromptAttempt';
import FeedbackForm from './FeedbackForm';

const Feedback = ()=> {
  const { feedbacks, promptAttempts, codePrompts, auth, cohorts, assignments } = useSelector(state => state);
  const { id } = useParams();
  const cohort = cohorts.find(cohort => cohort.id === id);
  if(!cohort){
    return null;
  }
  const nonCommentedFeedback = feedbacks.filter(feedback => feedback.enrollmentId === cohort.enrollment.id && !feedback.comments); 
  const commentedFeedback = feedbacks.filter(feedback => feedback.enrollmentId === cohort.enrollment.id && !!feedback.comments); 
  let shown = false;
  //relevent feedbacks for this cohort?
  return (
            <div key={ cohort.id}>
              <h2>Feedback for <Link to={`/cohorts/${cohort.id}`}>{ cohort.name } { cohort.course.title }</Link></h2>
              <div id='feedback-grid'>
              <div>
                <h3>Feedback Required</h3>
                {
                  nonCommentedFeedback.map( feedback => {
                    const yours = promptAttempts.find(promptAttempt => promptAttempt.codePromptId === feedback.promptAttempt.codePromptId);
                    if(!yours){
                      return null;
                    }
                    return (
                    <div key={ feedback.id } className='review-container'>
                      <h4>
                      { yours.codePrompt.title } 
                      </h4>
                      <section className='review'>
                        <div>
                          <h5>Their Attempt</h5>
                          <pre className='code'>
                            { feedback.promptAttempt.attempt }
                          </pre>
                        </div>
                        <div>
                          <h5>Your Attempt</h5>
                          <pre className='code'>
                            { yours.attempt }
                          </pre>
                        </div>
                      </section>
                      <FeedbackForm feedback={ feedback }/>
                    </div>
                    );
                  })
                }
              </div>
              <div>
                <h3>Feedback You Have Given</h3>
                {
                  commentedFeedback.map( feedback => {
                    const yours = promptAttempts.find(promptAttempt => promptAttempt.codePromptId === feedback.promptAttempt.codePromptId);
                    if(!yours){
                      return null;
                    }
                    return (
                    <div key={ feedback.id } className='review-container'>
                      <h4>
                      { yours.codePrompt.title } 
                      </h4>
                      <section className='review'>
                        <div>
                          <h5>Their Attempt</h5>
                          <pre className='code'>
                            { feedback.promptAttempt.attempt }
                          </pre>
                        </div>
                        <div>
                          <h5>Your Attempt</h5>
                          <pre className='code'>
                            { yours.attempt }
                          </pre>
                        </div>
                      </section>
                      <FeedbackForm feedback={ feedback }/>
                    </div>
                    );
                  })
                }
              </div>
              <div>
                <h3>Feedback Given to You</h3>
                {
                  promptAttempts.map( promptAttempt => {
                    if(promptAttempt.feedbacks.length && promptAttempt.feedbacks.find(feedback => feedback.comments)){
                      return (
                        <div key={ promptAttempt.id }>
                          { promptAttempt.codePrompt.title }
                          <pre>
                          { promptAttempt.attempt }
                          </pre>
                          Comments:
                          {
                            promptAttempt.feedbacks.filter( feedback => feedback.comments).map( feedback => {
                              return (
                                <li key={ feedback.id }>
                                  { feedback.comments }
                                </li>
                              );
                            })
                          }
                        </div>
                      );
                    }
                  })
                }
              </div>
              </div>
            </div>
          );
};

export default Feedback;
