import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

//enrollmentId of loggedin user
const _ProvideFeedback = ({ promptAttempt, feedback, addFeedback })=> {
  const [comments, setComments] = useState(feedback.comments);
  return (
      <div>
        <pre>{promptAttempt.attempt}</pre>
        TODO - show feedback which you can edit.
        <textarea className='form-control' value={ comments } onChange={ ev => setComments(ev.target.value)}></textarea>
        <button className='btn btn-primary btn-sm mt-2' onClick={ ()=> addFeedback({ comments, promptAttempt, feedback})} disabled={ !comments }>{ feedback.id ? 'Update Your' : 'Give' } Feedback</button>
      </div>
  );
};

const ProvideFeedback = ()=> {
  const { id } = useParams();
  const [promptAttempt, setPromptAttempt] = useState({});
  const [otherPromptAttempts, setOtherPromptAttempts] = useState([]);
  useEffect(()=> {
    const load = async()=> {
      const response = await axios(`/api/promptAttempts/${id}/provideFeedback`, {
        method: 'get',
        withCredentials: true
      });
      setPromptAttempt(response.data.promptAttempt);
      setOtherPromptAttempts(response.data.otherPromptAttempts);
    }
    load();
  }, [id]);
  if(!promptAttempt.id){
    return null;
  }

  const addFeedback = async({ promptAttempt, comments, feedback })=> {
    console.log(feedback);
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
            <_ProvideFeedback feedback={ feedback } promptAttempt={ _promptAttempt} addFeedback={ addFeedback }/>
          );
        })
      }
      <pre>
    { JSON.stringify(otherPromptAttempts, null, 2) }
      </pre>
      
    </div>
  );

};

export default ProvideFeedback;
