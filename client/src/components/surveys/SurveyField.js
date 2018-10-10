//SurveyField contains logic to render a single 
//label and text input
import React from 'react';

//because we used Field to call whatever we're add below, we have access to an enormous number of properties/props—a lot of which are event handlers. Let's see what we can pass into export default (props). What it console logs is all kinds of event handlers we can call for the input. 
//now we'll ES6 destructure this export default (props). To change it to just ({input}) to just pull of the input property and assigns it to a variable called input.
//Note <input {...input} /> is the same thing as onBlur={input.onBlur} or onChange= {input.onChange}

export default ({input, label, meta: {error, touched} }) => {
  return <div>
      <label>{label}</label>
      <input {...input} style={{marginBottom: '5px'}}/>
      <div className="red-text" style={{marginBottom: '20px'}}>{touched && error}</div>
    </div>;
}