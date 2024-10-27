import React from 'react';
import '../CSS files/Home.css';
import geko from '../Images/geko.jpg';
import sample from '../Images/Output.png';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="mainbox">
      <h1><span class="highlight">A</span>bstract<span class="highlight">I</span>fy</h1>
      <h2 id='subhead'>Visualizing your information</h2>
      <div className="contentBox">
        <div id='imgContentBar'>
          <div id='infoBox' className="about">
            <h2>
              About Abstractify
            </h2>
            <p>
              Abstractify is a browser-based tool for generating visual abstracts, built with Gemini. 
              Simply feed it a research paper and it will generate you a visual abstract!
            </p>
            <p>
              We built Abstractify to help <span className="blueBold">summarize</span> long research papers into 
              <span className="blueBold"> digestable</span> chunks of information,
              allowing the user to scan through a paper in a <span className="blueBold">visual</span> way.
            </p>
          </div>
          <img src={geko} alt="girl" />  
        </div>
        <div id='imgContentBar'>
          <div id="imgCaption">
            <img src={sample} alt="sample output" />
            <h4>
              Sample Output
            </h4>
          </div>
          <div id='infoBox' className="demos">
            <h2>
              How to Use
            </h2>
            <ol type="1">
              <li>
                Navigate to the <span className="blueBold">Upload PDF</span> tab up top or click on the 
                <span className="blueBold"> Get Started</span> button in the bottom right
              </li>
              <li>
                Upload the pdf file of the research paper you want to generate a visual abstract of
              </li>
              <li>
                Wait for the output to generate and <span className="blueBold">voila</span>! You're done! Past uploads and outputs may be view in the past uploads tab.
              </li>
            </ol>
          </div>
        </div>
        <div className="bottom">
          <div className="getStarted">
            <Link to="/Upload">Get Started</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
