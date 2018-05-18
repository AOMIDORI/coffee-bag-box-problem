import React from 'react';

class InputArea extends React.Component {
  constructor() {
    super();
    this.state = {
      smallBagNumber: 0,
      mediumBagNumber: 0,
      largeBagNumber: 0,
      boxSize: 30
    }
  }
  setBagSmall = (e) => {
    this.setState({smallBagNumber: e.target.value});
  }
  setBagMedium = (e) => {
    this.setState({mediumBagNumber: e.target.value});
  }
  setBagLarge = (e) => {
    this.setState({largeBagNumber: e.target.value});
  }
  setBoxSize = (e) => {
    this.setState({boxSize: e.target.value});
  }
  submitInput = () => {
    const inputData = this.state;
    this.props.onSubmit(inputData);
  }
  render () {
    return (
      <div className="input-area">
        <h5 className="body-title">How many bags?</h5>
        <div className="container">
          <div className="four columns">
            <label>200g</label>
            <input
              type="number"
              placeholder="number"
              value={this.state.smallBagNumber}
              onChange={this.setBagSmall}
            />
          </div>
          <div className="four columns">
            <label>400g</label>
            <input
              type="number"
              placeholder="number"
              value={this.state.mediumBagNumber}
              onChange={this.setBagMedium}
            />
          </div>
          <div className="four columns">
            <label>1000g</label>
            <input
              type="number"
              placeholder="number"
              value={this.state.largeBagNumber}
              onChange={this.setBagLarge}
            />
          </div>
        </div>
        <h5 className="body-title">Box size?</h5>
        <div className="container">
          <div className="twelve columns">
            <label>Edge length (cm)</label>
            <input
              type="number"
              value={this.state.boxSize}
              onChange={this.setBoxSize}
              placeholder="0 cm"
            />
          </div>
        </div>
        <button
         onClick={this.submitInput}
         >
         Calculate
        </button>
      </div>
    );
  }
}
export default InputArea;
