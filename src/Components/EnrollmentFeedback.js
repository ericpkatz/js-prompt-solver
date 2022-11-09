import React, { useEffect } from 'react';
import { useParams, Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { attemptLogin, logout, fetchCourses, fetchCohorts, fetchPromptAttempts, fetchAssignments, resetTopic } from '../store';
import AdminDashboard from './Admin/Dashboard';
import PromptAttempt from './PromptAttempt';
import moment from 'moment';
import { parse } from 'marked';
import ReactMarkdown from 'react-markdown'

const EnrollmentFeedback = ()=> {
  const { promptAttempts, codePrompts, auth, enrollments, assignments } = useSelector(state => state);
  const { id } = useParams();
  const dispatch = useDispatch();
  const enrollment = enrollments.find( enrollment => enrollment.id === id );
  if(!enrollment){
    return null;
  }
  const cohort = enrollment.cohort; 
  let shown = false;
  return (
            <div key={ cohort.id}>
              <h2>Feedback { cohort.name } { cohort.course.title }</h2>
              <h3>Your Prompt Attempts</h3>
                {
                  enrollment.promptAttempts
                    .filter(promptAttempt => promptAttempt.submitted)
                    .sort((a, b)=> new Date(b.updatedAt) - new Date(a.updatedAt))
                    .map( promptAttempt => {
                      return (
                        <div key={ promptAttempt.id }>
                          <label className={`badge bg-${ promptAttempt.archived ? 'secondary': 'primary'}`}>{ new Date(promptAttempt.updatedAt).toLocaleString() }</label>
                          <h4>{ promptAttempt.codePrompt.title }</h4>
                          <pre>{promptAttempt.attempt}</pre>
                          <div>
                            TODO - show folks who reviewed you ({ promptAttempt.feedbacks.length })
                          </div>
                          <div>
                            <Link to={`/promptAttempts/${promptAttempt.id}/provideFeedback`}>Review this Code Prompt</Link>
                          </div>
                        </div>
                      );
                    })
                }
            </div>
          );
};

export default EnrollmentFeedback;
