import './styles/App.css';
import LoginForm from './components/LoginForm';
//import EndpointDataViewer from './components/EndpointDataViewer';

function App() {
  return (
    <div className="App">
      <h1>Forum Ingeniorum</h1>
      <LoginForm />
      {/* <EndpointDataViewer baseURL="http://127.0.0.1:5000"/> */}
    </div>
  );
}

export default App;
