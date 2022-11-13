import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { markAsReviewed } from '../store';

const FeedbackTo = ()=> {
  const dispatch = useDispatch();
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

  return (
    <div>
      <Link to={`/enrollments/${id}`}>Back to Code Prompts</Link>
      <h4>{ promptAttempt.codePrompt.title }</h4>
      {
        !!feedbacks.find(feedback => feedback.reviewed) && <div className='alert alert-success'>You have no more feedback to review for this prompt attempt</div>
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
              <button onClick={ ()=> _markAsReviewed(feedback)} className='btn btn-primary' disabled={ feedback.reviewed}>Mark as Reviewed</button>
            </div>
          );
        })
      }
    </div>
  );
};

export default FeedbackTo;
