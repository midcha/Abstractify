import React from 'react';
import '../CSS files/Home.css';

const Home = () => {
  return (
    <div className="mainbox">
      <h1>Abstractify</h1>
      <h2>Visualizing your information</h2>
      <div className="contentBox">
        <div id='infoBox' className="about">

        </div>
        <div id='infoBox' className="demos">

        </div>
        <div className="bottom">
          <div id='infoBox' className="contact">

          </div>
          <div className="getStarted">
            <a href="">Get Started</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
