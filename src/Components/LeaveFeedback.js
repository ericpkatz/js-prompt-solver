import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchAvailableFeedbackMap } from '../store';
import DateLabel from './common/DateLabel';
import BackToCodePrompts from './common/BackToCodePrompts';


const Feedback = ({ _feedback, addFeedback, removeFeedback })=> {
  const [feedback, setFeedback] = useState(_feedback);
  useEffect(()=> {
    setFeedback(_feedback);
  }, [_feedback]);

  return (
    <div>
        <textarea className='form-control' value={ feedback.comments } onChange={ ev => setFeedback({...feedback, comments: ev.target.value})}></textarea>
        <button className='btn btn-primary btn-sm mt-2 me-2' onClick={ ()=> addFeedback({ feedback})} disabled={ !feedback.comments }>{ feedback.id ? 'Update Your' : 'Give' } Feedback</button>
    { !!feedback.id && <button className='btn btn-warning btn-sm mt-2' onClick={ ()=> removeFeedback({ feedback })}>Remove Your Feedback</button> }
    <div className='mt-3'>
    { !!feedback.id &&  <DateLabel date={ feedback.updatedAt} /> }
    </div>
    </div>
  );
};

const LeaveFeedback = ()=> {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { enrollmentId, promptAttemptId } = useParams();
  const { availableFeedbackMap, enrollments } = useSelector(state => state);
  const promptAttempt = availableFeedbackMap.find(promptAttempt => promptAttempt.id === promptAttemptId);
  const enrollment = enrollments.find( enrollment => enrollment.id === enrollment.id);

  if(!promptAttempt || !enrollment){
    return null;
  }
  const yourPromptAttempt = enrollment.promptAttempts.find(yours => yours.codePromptId === promptAttempt.codePromptId);

  const addFeedback = async({ feedback })=> {
    if(!feedback.id){
      const response = await axios(`/api/promptAttempts/${promptAttempt.id}/feedbacks`, {
        method: 'post',
        withCredentials: true,
        data: feedback 
      });
    }
    else {
      const response = await axios(`/api/promptAttempts/${promptAttempt.id}/feedbacks/${feedback.id}`, {
        method: 'put',
        withCredentials: true,
        data: feedback 
      });
    }
    dispatch(fetchAvailableFeedbackMap());
    navigate(`/enrollments/${enrollment.id}`);
  };

  const removeFeedback = async({ feedback })=> {
    const response = await axios(`/api/promptAttempts/${promptAttempt.id}/feedbacks/${feedback.id}`, {
      method: 'delete',
      withCredentials: true
    });
    dispatch(fetchAvailableFeedbackMap());
    navigate(`/enrollments/${enrollment.id}`);
  };

  const feedback = promptAttempt.feedbacks.find(feedback => feedback.enrollmentId === enrollmentId) || { comments: ''};

  return (
    <div>
      <BackToCodePrompts enrollment={ enrollment } />
      <h1>Provide Feedback for your Peers</h1>
      <h2>{ promptAttempt.codePrompt.title }</h2>
      <h3>Your Attempt</h3>
      <pre>
        { yourPromptAttempt.attempt }
      </pre>
      <h3>{promptAttempt.enrollment.user.login}'s Attempt</h3>
      <pre>
        { promptAttempt.attempt }
      </pre>
      <Feedback _feedback={ feedback } removeFeedback={ removeFeedback } addFeedback={ addFeedback } /> 
    </div>
  );
};

export default LeaveFeedback;
