import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { assignTopic } from '../../store';

const AssignTopic = ({ cohort })=> {
  const { admin : { topics } } = useSelector(state => state);
  const dispatch = useDispatch();
  const create = (id)=> {
    dispatch(assignTopic({ topicId: id, cohortId: cohort.id}));
  };
  return (
    <form>
      <select defaultValue={ cohort.topicId || ''} className='form-select' onChange={ (ev)=> create(ev.target.value) }>
        <option>Assign Topic For Cohort</option>
        {
          topics.map( topic => {
            return (
              <option value={ topic.id } key={ topic.id }>{ topic.title }</option>
            );
          })
        }
      </select>
    </form>
  );
};

export default AssignTopic;
