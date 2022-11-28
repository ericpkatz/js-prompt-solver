import React, { useState, useEffect}  from 'react';
import { useSelector } from 'react-redux';

const FormRow = ({ label, field, state, onChange, disabled=false})=> {
  return (
    <div className="mb-3 mt-3">
      <label htmlFor={ field } className="form-label">{ label }:</label>
      <input onChange={ onChange } className="form-control" name={field} id={field} placeholder={`Enter ${label}`} value={ state[field] || ''} disabled={ disabled }/>
    </div>
  );
}

const Profile = ()=> {
  const { auth } = useSelector(state => state);
  const [_auth, _setAuth] = useState({
    email: '',
    firstName: '',
    lastName: '',
    login: ''
  });

  useEffect(()=> {
    if(auth.id){
      _setAuth({
        firstName: auth.firstName || '',
        lastName: auth.lastName || '',
        email: auth.email || '',
        login: auth.login || ''
      })
    }
  }, [auth]);
  const onChange = ev => {
    _setAuth({...auth, [ev.target.name]: ev.target.value });
  };

  const disabled = !['login', 'email', 'firstName', 'lastName'].find( field => _auth[field] !== auth[field]);
  return (
    <form>
      <FormRow label='Email' field='email' state={ _auth } onChange={ onChange } disabled={ true }/>
      <FormRow label='First Name' field='firstName' state={ _auth} onChange={ onChange } disabled={ true }/>
      <FormRow label='Last Name' field='lastName' state={ _auth } onChange={ onChange } disabled={ true }/>
      <FormRow label='login' field='login' state={ _auth } onChange={ onChange } disabled={ true }/>
      <button disabled={ disabled } type="submit" className="btn btn-primary">Update Profile</button>
    </form>
  );
};

export default Profile;
