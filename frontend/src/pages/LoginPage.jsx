import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import '../styles/login/LoginPage.css';

function LoginPage() {
  return (
    <div className='LoginPage'>
        <LoginForm LoginEndpoint='http://127.0.0.1:5000/login' UserDataEndpoint='http://127.0.0.1:5000/user_data'/>
        <div className='sign-up-container'>
          <p>
            Not yet registered?
            &nbsp;
            <Link to='/register' className='sign-up-link'>Sign up now!</Link>
          </p>
        </div>
    </div>
  );
}

export default LoginPage;