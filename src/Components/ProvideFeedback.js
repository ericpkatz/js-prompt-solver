import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

//enrollmentId of loggedin user
const _ProvideFeedback = ({ promptAttempt, feedback, addFeedback, removeFeedback })=> {
  const [comments, setComments] = useState('');
  useEffect(()=> {
    setComments(feedback.comments);
  }, [feedback]);
  return (
    <div>
      <div>
        <h4>Their Attempt</h4>
        <pre>{promptAttempt.attempt}</pre>
        <textarea className='form-control' value={ comments } onChange={ ev => setComments(ev.target.value)}></textarea>
        <button className='btn btn-primary btn-sm mt-2' onClick={ ()=> addFeedback({ comments, promptAttempt, feedback})} disabled={ !comments }>{ feedback.id ? 'Update Your' : 'Give' } Feedback</button>
      </div>
    { !!feedback.id && <button className='btn btn-warning btn-sm mt-2' onClick={ ()=> removeFeedback({ promptAttempt, feedback })}>Remove Your Feedback</button> }
    { !!feedback.id && <label>{ new Date(feedback.updatedAt).toLocaleString()}</label>}
    </div>
  );
};

const ProvideFeedback = ()=> {
  const { id } = useParams();
  const [promptAttempt, setPromptAttempt] = useState({});
  const [otherPromptAttempts, setOtherPromptAttempts] = useState([]);

  const load = async()=> {
    const response = await axios(`/api/promptAttempts/${id}/provideFeedback`, {
      method: 'get',
      withCredentials: true
    });
    setPromptAttempt(response.data.promptAttempt);
    setOtherPromptAttempts(response.data.otherPromptAttempts);

  };

  useEffect(()=> {
    load();
  }, [id]);

  if(!promptAttempt.id){
    return null;
  }

  const addFeedback = async({ promptAttempt, comments, feedback })=> {
    if(!feedback.id){
      const response = await axios(`/api/promptAttempts/${promptAttempt.id}/feedbacks`, {
        method: 'post',
        withCredentials: true,
        data: { comments }
      });
    }
    else {
      const response = await axios(`/api/promptAttempts/${promptAttempt.id}/feedbacks/${feedback.id}`, {
        method: 'put',
        withCredentials: true,
        data: { comments }
      });
    }
    load();
  };

  const removeFeedback = async({ promptAttempt, feedback })=> {
    const response = await axios(`/api/promptAttempts/${promptAttempt.id}/feedbacks/${feedback.id}`, {
      method: 'delete',
      withCredentials: true
    });
    load();
  };

  return (
    <div>
      <h2>Provide Feedback</h2>
      <h3>{ promptAttempt.codePrompt.title}</h3>
      <h4>Your Submitted Attempt</h4>
      <pre>{promptAttempt.attempt}</pre>
      {
        otherPromptAttempts.map( _promptAttempt => {
          const feedback = _promptAttempt.feedbacks.find( feedback=> feedback.enrollmentId === promptAttempt.enrollmentId) || { comments: ''};
          return (
            <_ProvideFeedback feedback={ feedback } promptAttempt={ _promptAttempt} addFeedback={ addFeedback } removeFeedback={ removeFeedback }/>
          );
        })
      }
    </div>
  );

};

export default ProvideFeedback;
