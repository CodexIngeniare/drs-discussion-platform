import LoginForm from '../components/LoginForm';
import '../styles/login/LoginPage.css';

function LoginPage() {
  return (
    <div className='LoginPage'>
        <LoginForm apiLoginEndpoint='http://127.0.0.1:5000/login'/>
    </div>
  );
}

export default LoginPage;