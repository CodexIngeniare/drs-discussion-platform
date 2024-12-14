import RegisterForm from '../components/RegisterForm';
import '../styles/register/RegisterPage.css';
import PosterImage from '../images/IWantYouForDiscussion.png';

function RegisterPage() {
  return (
    <div className='RegisterPage'>
        <RegisterForm apiRegisterEndpoint='http://127.0.0.1:5000/register'/>
        <div className='register-poster-container'>
          <img className='fade-in ' src={PosterImage} alt='I want you for discussion img'/>
          <h1>I want <strong className='you'>YOU</strong> for discussion!</h1>
        </div>
    </div>
  );
}

export default RegisterPage;