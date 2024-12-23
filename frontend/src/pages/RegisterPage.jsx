import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../features/register/RegisterForm.jsx';
import PosterImage from '../assets/images/IWYFDORG.png';
import './RegisterPage.css';

function RegisterPage() {
  const [isRegistered, setIsRegistered] = useState(false);

  return (
    <div className='RegisterPage'>
        { isRegistered ?
          ( <section className='successful-registration'>
              <div className='registration-header'>
                <h1>Account Registration Submited Successfully</h1>
                <hr />
                <p>Your account registration request has been submited.</p>
                <p>You will be able to sign into your account once admin has approved your request.</p>
                <p>You will recieve notification about your submition via email that you provided.</p>
                <hr />
                <p>
                  Return to
                  &nbsp;
                  <Link to='/login' className='sign-in-link'>Sign in</Link>
                </p>
              </div>
          </section>)
        :
          (<section className='registration-section'>
            <div className='registration-header'>
              <h1>Create Your Account</h1>
              <hr />
            </div>
            <RegisterForm apiRegisterEndpoint='http://127.0.0.1:5000/register' setIsRegistered={setIsRegistered}/>
            <div className='sign-in-link-container'>
              <p>
                Already have an account?
                &nbsp;
                <Link to='/login' className='sign-in-link'>Sign in</Link>
              </p>
            </div>  
          </section>)
        }
        <section className='register-poster-container'>
          <img className='fade-in' src={PosterImage} alt='I want you for discussion poster'/>
          <h1>I want <strong className='you'>YOU</strong> for a discussion!</h1>
        </section>
    </div>
  );
}

export default RegisterPage;