import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Importation du Navbar
//import { DotLottieReact } from '@lottiefiles/dotlottie-react'; // Importation de DotLottieReact
import './Home.css';

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-title">Welcome to GarageManager</h1>
          <p className="home-description">
            The ultimate solution to manage your vehicles and fleet efficiently!
          </p>
        </div>
        <div className="home-animation">
          {/* Lottie Animation */}
          {/* <DotLottieReact
            src="https://lottie.host/2296db07-6f17-4df1-b26f-57c0282033f5/O6cs5DcEUh.lottie"
            loop
            autoplay
            style={{ width: '300px', height: '300px' }} // Optionnel : Ajustez la taille selon vos besoins
          /> */}
        </div>
      </div>
    </>
  );
};

export default Home;
