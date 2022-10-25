import React, { useState } from 'react';

const PromptAttempt = ({ promptAttempt })=> {
  const [attempt, setAttempt] = useState(promptAttempt.attempt || '');
  const save = ev => {
    ev.preventDefault();
    console.log('we have the prompt? Can we assume the enrollment? Prompt, to topic. Is the topic currently assigned to an enrollment the cohort is in?');
  }
  return (
    <div>
      <form onSubmit={ save }>
        <textarea value={ attempt } onChange={ ev => setAttempt(ev.target.value)}>
          {
            attempt
          }
        </textarea>
        <button>Save</button>
      </form>
    </div>
  );
};

export default PromptAttempt;
