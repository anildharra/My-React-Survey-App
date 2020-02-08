import React, { Component } from 'react';
import firebaseConfig from './config';
var firebase = require('firebase');
var uuid = require('uuid');


/*
var config = {
    apiKey: "enter-your-app-key",
    authDomain: "somethingCool.firebaseapp.com",
    databaseURL: "https://somefirebaseurl.com",
    storageBucket: "something.appspot.com",
    messagingSenderId: "yourid-here"
  };
  firebase.initializeApp(config);
*/


 

  firebase.initializeApp(firebaseConfig);

class Usurvey extends Component {
  nameSubmit(event){
    var studentName = this.refs.name.value;
    this.setState({studentName: studentName}, function(){
      console.log(this.state);
    });
  }
  answerSelected(event){
    var answers = this.state.answers;
    if(event.target.name === 'answer1'){
      answers.answer1 = event.target.value;
    } else if(event.target.name === 'answer2'){
      answers.answer2 = event.target.value;
    } else if(event.target.name === 'answer3'){
      answers.answer3 = event.target.value;
    }

    this.setState({answers: answers}, function(){
      console.log(this.state);
    });
  }

  questionSubmit(){
    firebase.database().ref('uSurvey/'+this.state.uid).set({
      studentName: this.state.studentName,
      answers: this.state.answers
    });
    this.setState({isSubmitted: true});
  }

  componentDidMount() {
    console.log("componentDidMount() BEGIN");
    const itemsRef = firebase.database().ref('uSurvey');
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
       /* console.log("item:: " + item);
        console.log("item.studentName:: " + items[item].studentName);
        console.log("item.answers:: " + items[item].answers.answer1);
        console.log("item.answers:: " + items[item].answers.answer2);
        console.log("item.answers:: " + items[item].answers.answer3);
        */

        newState.push({
          id: item,
          studentName: items[item].studentName,
          answer1: items[item].answers.answer1,
          answer2: items[item].answers.answer2,
          answer3: items[item].answers.answer3,
        });
      }
      this.setState({
        items: newState
      });
      console.log("items:: " + this.state.items);

    });
    console.log("componentDidMount() END");
  }

  recomendationMethod(item)
  {
    let recomend ='';

    if(item.answer2 ==="Student"){
      recomend ="You need to first finish your study then apply your knowledge with your interested technology/Design/Marketing";
    } else if(item.answer2 ==="in-job"){
      recomend ="While your are in job, you need to get opportunities with number of training and skill update.";
      if(item.answer1==="Technology") {
        recomend +=" Your are in technology field, so you need to graspe latest technology skill like: React, Angular, Nodejs, Cloud Computing, Solution Architect, Adminstrator. Network Engineer.";
      } else if(item.answer1==="Design") {
        recomend +=" Your are in Designing field, so you need to graspe skill like: Digital Graphy, Media design, Art softwares (Photoshop, Illustrator, Adobe Design Suite).";
       
     } else if(item.answer1==="Marketing") {
      recomend +=" Of course, marketing skills are applied to traditional marketing functions like advertising, sales, promotion, public relations, marketing research and brand management. However, marketing skills are also highly valued by employers in almost all sectors of the economy and job market.";
       
     }
    
    } else if(item.answer2 ==="looking-job"){
      if(item.answer1==="Technology") {
        recomend ="Your are in technology field, so you need to graspe latest technology skill like: React, Angular, Nodejs, Cloud Computing, Solution Architect, Adminstrator. Network Engineer.";
      } else if(item.answer1==="Design") {
        recomend ="Your are in Designing field, so you need to graspe skill like: Digital Graphy, Media design, Art softwares (Photoshop, Illustrator, Adobe Design Suite).";
       
     } else if(item.answer1==="Marketing") {
      recomend =" Of course, marketing skills are applied to traditional marketing functions like advertising, sales, promotion, public relations, marketing research and brand management. However, marketing skills are also highly valued by employers in almost all sectors of the economy and job market.";
       
     }
      
    }
    return recomend;

  }
   


  constructor(props){
    console.log("constructor() BEGIN");
    super(props);

    this.state = {
      uid: uuid.v1(),
      studentName: '',
      answers: {
        answer1: '',
        answer2: '',
        answer3: ''
      },
      isSubmitted: false,
      items:[]
    };
    this.nameSubmit = this.nameSubmit.bind(this);
    this.answerSelected = this.answerSelected.bind(this);
    this.questionSubmit = this.questionSubmit.bind(this);
    console.log("constructor() END");
  }

  render(){
    console.log("render() BEGIN");
    var studentName;
    var questions;

    if(this.state.studentName === '' && this.state.isSubmitted === false){
      studentName = <div>
        <h3>Hey Student, please let us know your name and press ENTER KEY: </h3>
        <form onSubmit={this.nameSubmit}>
          <input className="namy" type="text" placeholder="Enter your name" ref="name" />
        </form>
      </div>;
      questions = ''
    } else if (this.state.studentName !== '' && this.state.isSubmitted === false){
      studentName = <h1>Welcome to U-Survey, {this.state.studentName}</h1>;
        questions = <div>
          <h2>Here are some questions: </h2>
          <form onSubmit={this.questionSubmit}>
            <div className="card"> 
              <label>What kind of courses you like the most: </label> <br />
              <input type="radio" name="answer1" value="Technology" onChange={this.answerSelected} />Technology
              <input type="radio" name="answer1" value="Design" onChange={this.answerSelected} />Design
              <input type="radio" name="answer1" value="Marketing" onChange={this.answerSelected} />Marketing
            </div>
            <div className="card">
              <label>You are : </label> <br />
              <input type="radio" name="answer2" value="Student" onChange={this.answerSelected} />Student
              <input type="radio" name="answer2" value="in-job" onChange={this.answerSelected} />in-job
              <input type="radio" name="answer2" value="looking-job" onChange={this.answerSelected} />looking-job
            </div>
            <div className="card">
              <label>Is online learning helpful:  </label> <br />
              <input type="radio" name="answer3" value="yes" onChange={this.answerSelected} />yes
              <input type="radio" name="answer3" value="no" onChange={this.answerSelected} />no
              <input type="radio" name="answer3" value="maybe" onChange={this.answerSelected} />maybe
            </div>
            <input className="feedback-button" type="submit" value="submit" />
          </form>
        </div>
    } else if(this.state.isSubmitted === true){
      studentName = <div>
        <h1>Thanks, {this.state.studentName}<br /> 
       
      </h1>
      
    </div>
    }

    return(
      <div>
        {studentName}
        --------------------------------
        {questions}
      <div className="clearMe">
        </div>  
      <section className='display-item usurveyData'>
      <h4>Survey Report Data</h4>
      <div className="wrapper">
      
        <ul>
        
          {this.state.items.map((item) => {
            return (
              <li key={item.id}>
                <div className="header"></div>
                <div className="header-body">
                    <div>
                      <span>Student Name: <span className="boldclass" >
                        {item.studentName}</span></span>  
                    </div>
                    <div>
                      <span>What kind of courses you like the most: <span className="boldclass" >
                        {item.answer1}</span></span>  
                    </div>

                    <div>
                      <span>you are : <span className="boldclass" >
                        {item.answer2}</span></span>  
                    </div>
                    <div>
                      <span>Is online learning helpful: <span className="boldclass" >
                        {item.answer3}</span></span>  
                    </div>
                    <div>
                      <span>Recomendation: <span className="boldclass" >
                        {this.recomendationMethod(item)}</span></span>  
                    </div>
                </div>
                     
              </li>
              
            )
          })}
          
        </ul>
        
      </div>
    </section>
      </div>
    );
     
  }
}

export default Usurvey;
