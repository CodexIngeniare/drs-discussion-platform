import RegisterForm from '../components/RegisterForm';
import '../styles/register/RegisterPage.css';

function RegisterPage() {
  return (
    <div className='RegisterPage'>
        <RegisterForm apiRegisterEndpoint='http://127.0.0.1:5000/register'/>
    </div>
  );
}

export default RegisterPage;