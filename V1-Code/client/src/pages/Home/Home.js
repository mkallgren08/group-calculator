import React, { Component } from 'react';
import { Glyphicon } from "react-bootstrap";
import Calculator from "../../components/Calculator"
import { Col, Container, Row } from "../../components/Grid"
import Jumbotron from "../../components/Jumbotron"
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

  getAllIndeces = (arr, val, equation) => {
    console.log("arr: " + arr + ', val: ' + val)
    let indeces = [], i;
    for (i = 0; i < arr.length; i++)
      if (arr[i] === val) {
        indeces.push(i);
      }
    if (indeces.length !== 1) {
      console.log("operand triggered false")
      this.setState({ eqOkay: false }, function () {
        this.parseEqCheck(equation)
      })
    }
  }

  checkDecimalPlacement = (arr, val) => {
    let indeces = [], i;
    let okay = true
    for (i = 0; i < arr.length; i++)
      if (arr[i] === val) {
        indeces.push(i);
      }
    if (indeces.length >> 1) {
      for (let j = 0; j < indeces.length; j++) {
        if (indeces[j + 1] - 1 === indeces[j]) {
          console.log("decimal triggered false")
          okay = false

        }
      }
    }

    return okay
  }

  checkDecimalPlacementTwo = (equation) => {
    if (equation.expression.indexOf("..") !== -1) {
      console.log("decimal triggered false")
      this.setState({ eqOkay: false }, function () {
        this.parseEqCheck(equation)
      })
    }
  }

  // Starting code for a future implementation of a touchscreen calculator

  // readButtonInput = (btnValuefromCalc) => {
  //   this.setState({
  //     btnValue: btnValuefromCalc,
  //     currentEq: this.state.currentEq + btnValuefromCalc
  //   })

  // }

  checkEquation = (equation) => {
    //let userInput = equation.expression.toLowerCase();
    let operators = this.state.operatorSet;
    let index;
    let counter = 0;
    let checkEq = equation.expression;
    let okay = true;
    let splitByOp = []
    let splitEq = equation.expression.split("")

    for (var i = 0; i < operators.length; i++) {
      if (checkEq.indexOf(operators[i]) > 0) {
        okay = this.getAllIndeces(checkEq.split(""), operators[i], equation)
        index = checkEq.indexOf(operators[i]);
        splitByOp = checkEq.split(operators[i])
        counter = counter + 1;
        if (counter === 0 || counter >> 1) {
          console.log("counter triggered false")
          this.setState({ eqOkay: false }, function () {
            this.parseEqCheck(equation)
          })
        }
        console.log(splitEq);
      }
    };

    if (checkEq.indexOf(".") >> -1) {
      this.checkDecimalPlacementTwo(equation)
    }

    for (var j = 0; j < splitEq; j++) {
      let charSet = this.state.characterSet
      if (charSet.indexOf(splitEq[j]) === -1) {
        console.log("Invalid character trigger")
        this.setState({ eqOkay: false }, function () {
          this.parseEqCheck(equation)
        })
      }
    }

    //console.log("Index of: " + index + ", counter: " + counter + ", split equation: " + splitEq)

    //this.parseEqCheck(equation)




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
    } else if (exp.indexOf("..")>0){
      alert("I think you've doubled your decimal points! Please make sure to use only one in any given number.")
      return;
    }else {
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

  parseEqCheck = (equation) => {
    let okay = this.state.eqOkay
    console.log("okay? " + okay)
    //console.log(typeof equation.expression)
    if (okay === false) {
      alert("You may only use one operator per submission in beta!\n\t\tOR\nPlease make sure that you have used only one decimal point per number!")
      return
    } else {
      // const equationList = firebase.database().ref('equations');

      // equationList.push(equation);
      // this.setState({
      //   currentEq: '',
      //   username: '',
      //   eqOkay: true
      // });

      alert("Eq okay")
    }
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
      let counter = 0;
      for (let equation in equations) {
        counter++;
        newState.unshift({
          id: equation,
          equation: equations[equation].expression,
          user: equations[equation].user
        });
      }

      if (newState.length > 10) {
        // let wholeLength = newState.length
        equationsArray = newState.slice(-10, -1)
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
      <Container fluid>
        <Row>
          {/* <Jumbotron> */}
          <h1>Group Accessible Calculator</h1>
          {/* </Jumbotron> */}
        </Row>
        <Row>
          <Col size="md-6">
            <Row>
              <Col size='md-2' />
              <Col size='md-8'>
                <form onSubmit={this.handleSubmit}>
                  <input type="text" name="username" placeholder="Intials (optional)" onChange={this.handleChange} value={this.state.username} />
                  <br />
                  <input type="text" name="currentEq" placeholder="Equation input" onChange={this.handleChange} value={this.state.currentEq} />
                  <br />
                  <button>Calculate</button>
                </form>
              </Col>
              <Col size='md-2' />
            </Row>
          </Col>
          <Col size="md-6">
            {/* <Calculator sendButtonInput = {this.readButtonInput}/> */}
            <div className="panel-wrapper">
              <div className="panel-header">
                <p>
                  Hello there! A few ground rules for use of this calculator in beta:
            </p>
              </div>
              <div className="panel-body">

              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <section className='display-item'>
            <div className="wrapper">
              <ul>
                {this.state.lastEqs.map((equation) => {
                  return (
                    <li key={equation.id}>
                      <h3>{equation.equation}</h3>
                      <p>Entered by: {equation.user}
                        <button onClick={() => this.removeItem(equation.id)}>{<Glyphicon glyph="remove" />}</button>
                      </p>
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>
        </Row>
      </Container>
    );
  }
}
export default Home;