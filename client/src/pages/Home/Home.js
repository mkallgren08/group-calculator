import React, { Component } from 'react';
import { Glyphicon } from "react-bootstrap";
import { Col, Container, Row } from "../../components/Grid"
import firebase from '../../firebase.js';
import "./Home.css"

// import Calculator from "../../components/Calculator"
// import Jumbotron from "../../components/Jumbotron"

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
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
      ],
      operatorSet: [
        'x', '*', '%', '^', '/', '+', '-', " "
      ],
      characterSet: [
        '1234567890x*%^/+- .'
      ],
      btnValue: null,
      eqOkay: true,

    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  solveEq = (equation) => {
    let exp = equation.expression;
    let operators = this.state.operatorSet;
    let splitExp = [];
    let result;

    console.log(exp)
    console.log(exp.length)

    if (exp.length < 3) {
      alert("I think you hit 'calculate' by mistake - please make sure you have entered enough data!")
      return;
    } else if (exp.indexOf("..") > 0) {
      alert("I think you've doubled your decimal points! Please make sure to use only one in any given number.")
      return;
    } else {
      for (let i = 0; i < operators.length; i++) {
        if (exp.indexOf(operators[i]) !== -1) {
          console.log(operators[i])
          splitExp = exp.split(operators[i])
          if (splitExp.length === 2) {
            console.log("split expression: " + splitExp)
            result = this.performOperations(splitExp[0], operators[i], splitExp[1])
          } else if (splitExp.length === 3) {
            console.log("split expression: " + splitExp)
            result = this.performOperations(splitExp[0], splitExp[1], splitExp[2])
          }

        }
      }




      equation.expression = exp + " = " + result

      const equationList = firebase.database().ref('equations');

      equationList.push(equation);
      this.setState({
        currentEq: '',
        username: '',
        eqOkay: true
      });
    }

  }

  performOperations = (op1, oper, op2) => {
    let opr1 = parseFloat(op1);
    console.log("operand1:" + opr1);
    let opr2 = parseFloat(op2);
    console.log("operand2:" + opr2);
    console.log('operator: ' + oper + ", typeof operator: " + typeof oper)
    let result;

    if (!opr1 || !opr2) {
      alert("Please check your syntax and make sure you're using only real numbers and operators");
      return;
    }

    switch (oper) {
      case "+":
        result = opr1 + opr2;
        break;
      case "-":
        result = opr1 - opr2;
        break;
      case "/":
        result = opr1 / opr2;
        break;
      case "%":
        result = opr1 % opr2;
        break;
      case "*":
        result = opr1 * opr2;
        break;
      case "x":
        result = opr1 * opr2;
        break;
      case "^":
        result = Math.pow(opr1, opr2);
        break;
      default:
        alert("I'm sorry, could you check to make sure you've used one of the following operators?" +
          "\n")
        result = "Undefined"
    }

    return result
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let userHandle = "";
    if (this.state.username.length < 1) {
      userHandle = "Anon"
    } else {
      userHandle = this.state.username;
    }

    let equation = {
      expression: this.state.currentEq,
      user: userHandle
    }
    //this.checkEquation(equation)
    this.solveEq(equation)


  }
  componentDidMount() {
    const equationList = firebase.database().ref('equations');
    equationList.on('value', (snapshot) => {
      let equations = snapshot.val();
      // creates an empty array for the equations' newState objects to be pushed to to go into.
      let equationsArray = [];
      let newState = [];
      for (let equation in equations) {
        newState.unshift({
          id: equation,
          equation: equations[equation].expression,
          user: equations[equation].user
        });
      }

      if (newState.length > 10) {
        // let wholeLength = newState.length
        equationsArray = newState.slice(0, 10);
        this.setState({
          lastEqs: equationsArray
        });
      } else {
        this.setState({
          lastEqs: newState
        });
      }


    });
  }
  removeItem(itemId) {
    const equationRef = firebase.database().ref(`/equations/${itemId}`);
    equationRef.remove();
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-6">
            <Row>
              <Col size='md-2' />
              <Col size='md-8'>
                <h1 id="calc-title">Group Accessible Calculator</h1>
              </Col>
              <Col size='md-2' />
            </Row>
          </Col>
          <Col size='md-6' />
        </Row>
        <Row>
          <Col size="md-6">
            <Row>
              <Col size='md-2' />
              <Col size='md-8' id="calc-wrapper">
                <form onSubmit={this.handleSubmit} id="calc-input">
                  <input type="text" name="username" placeholder="Intials (optional)" onChange={this.handleChange} value={this.state.username} />
                  <br />
                  <input type="text" name="currentEq" placeholder="Equation input" onChange={this.handleChange} value={this.state.currentEq} />
                  <br />
                  <button id="calculate-btn">Calculate</button>
                </form>
              </Col>
              <Col size='md-2' />
            </Row>
            <Row>
              <Col size='md-2' />
              <Col size='md-8'>
                <section className='display-item'>
                  <div className="wrapper">
                    <ol>
                      {this.state.lastEqs.map((equation) => {
                        return (
                          <li key={equation.id}>
                            <h4>{equation.equation}</h4>
                            <p>Entered by: {equation.user}
                              <button onClick={() => this.removeItem(equation.id)}>{<Glyphicon glyph="remove" />}</button>
                            </p>
                          </li>
                        )
                      })}
                    </ol>
                  </div>
                </section>
              </Col>
              <Col size='md-2' />
            </Row>
          </Col>
          <Col size="md-6">
            <div className="panel-wrapper">
              <div className="panel-header">
                <p>
                  Hello there! A few ground rules for use of this calculator in beta:
                </p>
              </div>
              <div className="panel-body">
                <ol>
                  <li>
                    <strong>
                      <h4>The only operators allowed are: {this.state.operatorSet.map(operator => {
                        return (
                          <span key={operator}> {operator} </span>
                        )
                      })}</h4>
                    </strong>
                  </li>
                  <br />
                  <li>
                    <h4> Fractions must be expressed as a decimal - you may include as many significant figures as you like in the conversion (though 2 sig-figs are recommended). </h4>
                    <ol>
                      <p> Ex: </p>
                      <li>1/4 = .25</li>
                      <li>1/3 = .33 or .3333333333333</li>
                      <li>1/7 = .14 or .1428571....</li>
                    </ol>
                  </li>
                  <br />
                  <li>
                    <h4> Input is limited to a binary operation, i.e. "2+3" or "1.7*2.8". Any additional operators will cause the calculator to return an undefined (or "Not a Number" - NaN) result. </h4>
                  </li>
                </ol>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col size="md-6">

          </Col>
          <Col size='md-6' />

        </Row>
      </Container>
    );
  }
}
export default Home;