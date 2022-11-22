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
                enrollment.promptAttempts.filter(promptAttempt => promptAttempt.submitted).map( promptAttempt => {
                  const feedbackYouGave = enrollment.feedbacks.filter(feedback => feedback.promptAttempt.codePromptId === promptAttempt.codePromptId)
                  return (
                    <div key={ promptAttempt.id } className='card mb-2'>
                      <div className='card-body'>
                      <h3 className='card-title'>{ promptAttempt.codePrompt.title }</h3>
                      <h6 className='card-subtitle text-muted mb-2'>from { promptAttempt.codePrompt.topic.title }</h6>
                      <h4 className='card-subtitle text-muted'>Your Submission</h4>
                      <pre className='mt-2 mb-5' style={{ border: 'solid 1px black'}}>
                        { promptAttempt.attempt }
                      </pre>
                    {
                      !!promptAttempt.promptAttemptTests.length && (
                        <>
                        <h4 className='card-subtitle text-muted mb-2'>Your Tests</h4>
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Input</th>
            <th>Operation</th>
            <th>Output</th>
            <th>Output Data Type</th>
          </tr>
        </thead>
        <tbody>
      {
        promptAttempt.promptAttemptTests.map( (promptAttemptTest, idx) => {
          const { test } = promptAttemptTest;
          return (
            <tr key={ test.id }>
              <td>
                Student Test { idx + 1 }
              </td>
              <td>
                { test.input }
              </td>
              <td>
                { test.operator }
              </td>
              <td>
                { test.output }
              </td>
              <td>
                { test.outputDataType }
              </td>
            </tr>
          );
        })
      }
      </tbody>
      </table>

                        </>
                      )
                    }
                    {
                      !!promptAttempt.feedbacks.length &&
                      <h4 className='card-subtitle text-muted mb-2'>Feedback for you</h4>
                    }
                      {
                        promptAttempt.feedbacks.map( feedback => {
                          return (
                            <div key={ feedback.id }>
                              <h6 className='card-subtitle text-muted'>from { feedback.enrollment.user.login }</h6>
                              <pre>
                              { feedback.comments }
                              </pre>
                            </div>
                          );
                        })
                      }
                    {!!feedbackYouGave.length && <h4 className='card-subtitle text-muted mb-2 mt-5'>Feedback you gave</h4>}
                      {
                        feedbackYouGave.map( feedback => {
                          return (
                            <div key={ feedback.id }>
                            <h6 className='card-subtitle text-muted'>to { feedback.promptAttempt.enrollment.user.login }</h6>
                            <pre>
                            { feedback.promptAttempt.attempt }
                            </pre>
                            <pre>
                            { feedback.comments }
                            </pre>
                            </div>
                          );
                        })
                      }
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
