import { useEffect } from 'react';
import { useRegisteredUsers } from './hooks';
import './RegisteredUsersView.css';

function RegisteredUsersView() {
  const { fetchRegisteredUsers } = useRegisteredUsers("http://127.0.0.1:5000/registered_users");

  useEffect(() => {
    fetchRegisteredUsers();
  }, []);

  return (
    <div className="RegisteredUsersView">
      <section className='RegisteredUsersView__users-list-section'>
          <label>Registered users list</label>
      </section>
      <section className='RegisteredUsersView__user-details-section'>
          <label>User details</label>
      </section>
    </div>
  );
}

export default RegisteredUsersView;