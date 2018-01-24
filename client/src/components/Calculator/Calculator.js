import React, { Component } from "react";
import { Col, Row, Container } from "../Grid";
//import { Input } from "../Form";
import { Button } from "react-bootstrap";
import "./Calculator.css";


class Calculator extends Component {
  state = {
    topRowList: ["(", ")", "%", "^"],
    scndTopRowList: ["7", "8", "9", "/"],
    midRowList: ["4", "5", "6", "*"],
    scndBotRowList: ["1", "2", "3", "-"],
    botRowList: ["0", ".", "+"],
    equation: "",

  }

  sendButtonInput = (event) => {
    let userGuess = event.target.value;
    this.props.readButtonInput(userGuess)
    alert("Comm works!")
  }

  readButtonInput = (event) => {
    let userGuess = event.target.value;
    console.log(userGuess);
  }

  // handle form input
  handleInputChange = event => {
    // Destructure the name and value properties off of event.target
    // Update the appropriate state
    const { name, value } = event.target;
    console.log(value)
    this.setState({
      [name]: value,
      equation: value
    });
    console.log("state equation:" + this.state.equation);
  };

  doCalculate = () => {
    console.log("start pluggin away!")
  }

  render() {
    return (
      <Container>
            <Row>
              <h1>Calculator</h1>
            </Row>
            <Row>
              {this.state.topRowList.map(item => (
                <Col size='md-3' key={item}>
                  <Button
                    value={item}
                    className="calcBtn"
                    onClickCapture={this.sendButtonInput}>
                    {item}
                  </Button >
                </Col>
              ))}
            </Row>
            <Row>
              {this.state.scndTopRowList.map(item => (
                <Col size='md-3' key={item}>
                  <Button
                    value={item}
                    className="calcBtn"
                    onClickCapture={this.sendButtonInput}>
                    {item}
                  </Button >
                </Col>
              ))}
            </Row>
            <Row>
              {this.state.midRowList.map(item => (
                <Col size='md-3' key={item}>
                  <Button
                    value={item}
                    className="calcBtn"
                    onClickCapture={this.sendButtonInput}>
                    {item}
                  </Button >
                </Col>
              ))}
            </Row>
            <Row>
              {this.state.scndBotRowList.map(item => (
                <Col size='md-3' key={item}>
                  <Button
                    value={item}
                    className="calcBtn"
                    onClickCapture={this.sendButtonInput}>
                    {item}
                  </Button>
                </Col>
              ))}
            </Row>
            <Row>
              {this.state.botRowList.map(item => (
                <Col size='md-3' key={item}>
                  <Button
                    value={item}
                    className="calcBtn"
                    onClickCapture={this.sendButtonInput}>
                    {item}
                  </Button>
                </Col>
              ))}
              <Col size='md-3'>
                <Button
                  id="calculateEquation"
                  className="calcBtn"
                  onClickCapture={this.doCalculate}>
                  =
                </Button>
              </Col>
            </Row>
      </Container>
    )
  }
}



export default Calculator;
