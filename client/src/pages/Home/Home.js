import React, { Component } from 'react';
import {Glyphicon} from "react-bootstrap";
import firebase from '../../firebase.js';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      currentEq: '',
      username: '',
      items: [],
      lastEq: "",
      lastEqs: [],
      numSet: [
        '1', '2', '3', '4','5','6','7','8','9','0'
      ],
      operatorSet: [
        'x','*','%','^','/','+','-', " ", "(", ")", "."
      ],
      characterSet: [
        '1', '2', '3', '4','5','6','7','8','9','0', 'x','*','%','^','/','+','-', " ", "(", ")", "."
      ]
      
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  checkEquation = (eqInput) => {
    let userInput = eqInput.toLowerCase();
    let splitEq = eqInput.split("");
    for (var i=0; i<this.state.characterSet.length; i++){
      if (eqInput.indexOf(this.state.characterSet[i])){
        console.log("Error! Please check that your entry contains only operators and numbers!")
      }
    }
    console.log("checking splitEq: " + userInput)
  }

  solveEq = (splitInput) => {

  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    const equation = {
      expression: this.state.currentEq,
      user: this.state.username
    }
    this.checkEquation(equation.expression)
    event.preventDefault();
    const equationList = firebase.database().ref('equations');

    equationList.push(equation);
    this.setState({
      currentEq: '',
      username: ''
    });
  }
  componentDidMount() {
    const equationList = firebase.database().ref('equations');
    equationList.on('value', (snapshot) => {
      let equations = snapshot.val();
      let newState = [];
      for (let equation in equations) {
        newState.unshift({
          id: equation,
          equation: equations[equation].expression,
          user: equations[equation].user
        });
      }
      this.setState({
        lastEqs: newState
      });
    });
  }
  removeItem(itemId) {
    const equationRef = firebase.database().ref(`/equations/${itemId}`);
    equationRef.remove();
  }
  render() {
    return (
      <div className='app'>
        <header>
            <div className="wrapper">
              <h1>Group Accessible Calculator</h1>
                             
            </div>
        </header>
        <div className='container'>
          <section className='add-item'>
                <form onSubmit={this.handleSubmit}>
                  <input type="text" name="username" placeholder="Intials (optional)" onChange={this.handleChange} value={this.state.username} />
                  <br/>
                  <input type="text" name="currentEq" placeholder="Equation input" onChange={this.handleChange} value={this.state.currentEq} />
                  <br/>
                  <button>Calculate</button>
                </form>
          </section>
          <section className='display-item'>
              <div className="wrapper">
                <ul>
                  {this.state.lastEqs.map((equation) => {
                    return (
                      <li key={equation.id}>
                        <h3>{equation.equation}</h3>
                        <p>brought by: {equation.user}
                          <button onClick={() => this.removeItem(equation.id)}>{<Glyphicon glyph = "remove"/>}</button>
                        </p>
                      </li>
                    )
                  })}
                </ul>
              </div>
          </section>
        </div>
      </div>
    );
  }
}
export default Home;