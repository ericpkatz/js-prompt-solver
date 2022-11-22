import React from 'react';
import { useSelector } from 'react-redux';

const History = ()=> {
  const { enrollments } = useSelector(state => state);
  return (
    <div>
      {
        enrollments.map( enrollment => {
          return (
            <div key={ enrollment.id }>
              <h2>{ enrollment.cohort.course.title } { enrollment.cohort.name }</h2>
              {
                enrollment.promptAttempts.map( promptAttempt => {
                  //const feedbackYouGave = enrollment.feedbacks.filter(feedback => feedback.promptAttempt.codePromptId === promptAttempt.codePromptId)
                  return (
                    <div key={ promptAttempt.id } className='card mb-2'>
                      <div className='card-body'>
                      <h3 className='card-title'>{ promptAttempt.codePrompt.title }</h3>
                      <pre>
                        { promptAttempt.attempt }
                      </pre>
                    {
                      !!promptAttempt.feedbacks.length &&
                      <h4 className='card-subtitle text-muted'>Feedback for you</h4>
                    }
                      {
                        promptAttempt.feedbacks.map( feedback => {
                          return (
                            <pre>
                            { feedback.comments }
                            </pre>
                          );
                        })
                      }
                      <h4 className='card-subtitle text-muted'>Feedback you gave</h4>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          );
        })
      }
    </div>
  );
};

export default History;
