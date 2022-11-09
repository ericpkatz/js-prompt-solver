import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProvideFeedback = ()=> {
  const { id } = useParams();
  const [promptAttempt, setPromptAttempt] = useState({});
  const [otherPromptAttempts, setOtherPromptAttempts] = useState([]);
  useEffect(()=> {
    console.log(id);
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

  return (
    <div>
      <h2>Your Attempt</h2>
      <pre>{promptAttempt.attempt}</pre>
      <pre>
    { JSON.stringify(otherPromptAttempts, null, 2) }
      </pre>
      
    </div>
  );

};

export default ProvideFeedback;
