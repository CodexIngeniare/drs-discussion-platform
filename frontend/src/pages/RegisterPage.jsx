import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import PosterImage from '../images/IWYFDORG.png';
import '../styles/register/RegisterPage.css';

function RegisterPage() {
  return (
    <div className='RegisterPage'>
        <section className='registration-section'>
          <RegisterForm apiRegisterEndpoint='http://127.0.0.1:5000/register'/>
          <div className='sign-in-link-container'>
            <p>
              Already have an account?
              &nbsp;
              <Link to='/login' className='sign-in-link'>Sign in</Link>
            </p>
          </div>  
        </section>
        <section className='register-poster-container'>
          <img className='fade-in' src={PosterImage} alt='I want you for discussion poster'/>
          <h1>I want <strong className='you'>YOU</strong> for a discussion!</h1>
        </section>
    </div>
  );
}

export default RegisterPage;