import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { markAsReviewed } from '../store';
import BackToCodePrompts from './common/BackToCodePrompts';

const FeedbackTo = ()=> {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, promptAttemptId } = useParams();
  const { feedbacksTo, enrollments } = useSelector(state => state);
  const feedbacks = feedbacksTo.filter(feedback => feedback.promptAttemptId === promptAttemptId && feedback.promptAttempt.enrollmentId === id);
  const _markAsReviewed = (feedback)=> {
    dispatch(markAsReviewed(feedback))
  };
  const enrollment = enrollments.find( enrollment => enrollment.id === id );
  if(!enrollment){
    return null;
  }
  const promptAttempt = enrollment.promptAttempts.find(promptAttempt => promptAttempt.id === promptAttemptId);

  if(feedbacks.filter(feedback => !feedback.reviewed).length === 0){
    navigate(`/enrollments/${enrollment.id}`);
  } 
  return (
    <div>
      <BackToCodePrompts enrollment={ enrollment } />
      <h4>{ promptAttempt.codePrompt.title }</h4>
      {
        feedbacks.filter(feedback => !feedback.reviewed).length === 0 && <div className='alert alert-success'>You have no more feedback to review for this prompt attempt</div>
      }
      {
        feedbacks.map( feedback => {
          return (
            <div key={ feedback.id }>
              <pre>
              {
                feedback.promptAttempt.attempt
              }
              </pre>
              <pre>
              { feedback.comments }
              </pre>
              <button onClick={ ()=> _markAsReviewed(feedback)} className='btn btn-primary mb-2' disabled={ feedback.reviewed}>Mark as Reviewed</button>
            </div>
          );
        })
      }
    </div>
  );
};

export default FeedbackTo;
