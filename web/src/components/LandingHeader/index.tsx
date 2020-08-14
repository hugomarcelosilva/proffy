import React from 'react';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../../contexts/auth';

import { PowerOff } from '@styled-icons/boxicons-regular';
import { User } from '@styled-icons/fa-solid';

import './styles.css';

const LandingHeader: React.FC = () => {
  const { user, signOut } = useAuth();

  const history = useHistory();

  const handleProfile = () => {
    history.push('/profile', {
      user,
    });
  };

  return (
    <div className="header-container">
      <div className="information-container">
        {user.subject && (
          <main onClick={handleProfile} className="profile">
            <section className="image">
              {user && user.avatar ? (
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${user.avatar}`}
                  alt="Avatar"
                />
              ) : (
                <div className="default-image">
                  <User className="user-icon" />
                </div>
              )}
            </section>
            <p>{user ? user.name : 'Nome do usuário'}</p>
          </main>
        )}

        <div className="options">
          <div onClick={signOut}>
            <PowerOff className="logout-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHeader;
