import React, { Component } from 'react';
import './App.css';
import Usurvey from './Usurvey';
import Header from './Header';
import Footer from './Footer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
         <Header />
        </div>
        <Usurvey />
        <div className="clearMe">
        </div> 
        <div className="App-footer">
         <Footer />
        </div>

      </div>
    );
  }
}

export default App;
