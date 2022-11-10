import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const _ProvideFeedback = ({ promptAttempt, addFeedback })=> {
  const [comments, setComments] = useState('');
  return (
      <div>
        <pre>{promptAttempt.attempt}</pre>
        TODO - show feedback which you can edit.
        <textarea className='form-control' value={ comments } onChange={ ev => setComments(ev.target.value)}></textarea>
        <button className='btn btn-primary btn-sm mt-2' onClick={ ()=> addFeedback({ comments, promptAttempt})} disabled={ !comments }>Provide Feedback</button>
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

  const addFeedback = async({ promptAttempt, comments })=> {
      const response = await axios(`/api/promptAttempts/${promptAttempt.id}/feedbacks`, {
        method: 'post',
        withCredentials: true,
        data: { comments }
      });
  };

  return (
    <div>
      <h2>Provide Feedback</h2>
      <h3>{ promptAttempt.codePrompt.title}</h3>
      <h4>Your Submitted Attempt</h4>
      <pre>{promptAttempt.attempt}</pre>
      <pre>
    { JSON.stringify(otherPromptAttempts, null, 2) }
      </pre>
      {
        otherPromptAttempts.map( promptAttempt => {
          return (
            <_ProvideFeedback promptAttempt={ promptAttempt} addFeedback={ addFeedback }/>
          );
        })
      }
      
    </div>
  );

};

export default ProvideFeedback;
