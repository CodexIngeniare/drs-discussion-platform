import './RegisteredUsersView.css';

function RegisteredUsersView() {
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