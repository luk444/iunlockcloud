import React from 'react';
import HomePage from '../components/home/HomePage';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-28">
        <HomePage />
      </div>
    </div>
  );
};

export default Home;