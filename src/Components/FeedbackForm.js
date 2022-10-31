import React, { useState } from 'react';
import { createFeedback } from '../store';
import { useDispatch } from 'react-redux';

const FeedbackForm = ({ feedback })=> {
  const dispatch = useDispatch();

  const saveComments = (ev)=> {
    ev.preventDefault();
    dispatch(createFeedback({ ...feedback, comments }));
  }

  const [comments, setComments] = useState(feedback.comments || '');
  return (
    <form onSubmit={ saveComments }>
      <textarea className='comments' value={ comments } onChange={ ev => setComments(ev.target.value)}></textarea>
      <button disabled={ !comments || feedback.comments === comments }>Provide Feedback</button>
    </form>
  );
};

export default FeedbackForm;
