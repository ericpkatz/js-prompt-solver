import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { assignTopic } from '../../store';

const AssignTopic = ({ topic, cohorts })=> {
  const { admin : { courses, users, promptAttempts } } = useSelector(state => state);
  const dispatch = useDispatch();
  const create = (id)=> {
    dispatch(assignTopic({ cohortId: id, topicId: topic.id}));
  };
  return (
    <form>
      <select className='form-select' onChange={ (ev)=> create(ev.target.value) }>
        <option>Assign Topic</option>
        {
          cohorts.map( cohort => {
            return (
              <option value={ cohort.id } key={ cohort.id }>{ cohort.name }</option>
            );
          })
        }
      </select>
    </form>
  );
};

export default AssignTopic;
