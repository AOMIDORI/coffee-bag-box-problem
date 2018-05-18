import React, { Component } from 'react';
import InputArea from './components/InputArea';
import ResultArea from './components/ResultArea';
import logo from './assets/images/logo.jpg';

const Bags = {
  small: { a:23, b:16, c:2, w:200 },
  medium: { a:26, b:22, c:2, w:400 },
  large: { a:26, b:14, c:10, w:1000 }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      containers: [],
      totalBoxes: 0,
      errorMessage: '',
      computing: false,
      resultReady: false
    };
  }

  calculateTotalBox = async (inputData) => {
    // Using the First Fit algorithm
    let invalidInput = false;
    let errorMessage = '';
    let totalBoxes = 0;
    await this.resetData();
    this.setState({computing: true});
    // Verify the input
    if(inputData.boxSize < 30 || inputData.boxSize > 100) {
      invalidInput = true;
      errorMessage = 'Please input a valid box size from 30cm to 100cm. ';
    }
    if(inputData.smallBagNumber < 0 || inputData.mediumBagNumber < 0 || inputData.largeBagNumber < 0) {
      invalidInput = true;
      errorMessage += 'Please input a valid number of bags.';
    }
    this.setState({errorMessage: errorMessage});
    if(!invalidInput) {
      // Start to calculate
      let bagsLeft = {
        small: Number(inputData.smallBagNumber),
        medium: Number(inputData.mediumBagNumber),
        large: Number(inputData.largeBagNumber)
      };
      // Fit all the large bags first
      totalBoxes = await this.packAllBags('large', bagsLeft.large, inputData.boxSize, totalBoxes);
      totalBoxes = await this.packAllBags('medium', bagsLeft.medium, inputData.boxSize, totalBoxes);
      totalBoxes = await this.packAllBags('small', bagsLeft.small, inputData.boxSize, totalBoxes);
    }
    console.log ('total boxes: ', totalBoxes);
    this.setState({
      totalBoxes: totalBoxes,
      computing: false,
      resultReady: true
    });
  }

  packAllBags = async (bagType, bagNumber, boxSize, totalBoxes) => {
    // pack all bags of a type
    console.log("\n\n\n---------Fitting all the", bagType, "bags -----------\n\n");
    let bagsLeft = bagNumber;
    while(bagsLeft > 0) {
      // find spaces in existing boxes to fit bags
      let packedBags = await this.findContainerToFit (bagType, bagsLeft);
      if(packedBags > 0) {
        bagsLeft -= packedBags;
        console.log('fit ', packedBags, ' bag, still left ', bagsLeft);
        console.log('   current containers', this.state.containers);
      } else {
        // if cannot fit in existing boxes, add a new box
        totalBoxes ++;
        console.log('add a new box');
        const newBox = {
          a: Number(boxSize),
          b: Number(boxSize),
          c: Number(boxSize)
        };
        await this.setState({
          containers: [...this.state.containers, newBox],
        });
      }
    }
    return totalBoxes;
  }
  findContainerToFit = async (bagType, bagsLeft) => {
    // In existing containers, find one to fit as much bags as possible
    const bag = Bags[bagType];
    let containers = this.state.containers;
    let packedBags = 0;
    let subContainers = [];
    for(let i = 0; i < containers.length; i++) {
      if(containers[i].a >= bag.a && containers[i].b >= bag.b && containers[i].c >= bag.c) {
        let capacityA = Math.floor(containers[i].a/bag.a);
        let capacityB = Math.floor(containers[i].b/bag.b);
        let capacityC = Math.floor(containers[i].c/bag.c);
        let containerCapacity = capacityA * capacityB * capacityC;
        if(bagsLeft >= containerCapacity) {
          // fit all the possible space and add new sub-containers
          packedBags = containerCapacity;
          let bagSpace = {
            a: bag.a * capacityA,
            b: bag.b * capacityB,
            c: bag.c * capacityC
          };
          subContainers = this.fitBags(containers[i], bagSpace).map( subContainer => {
            return this.rotateContainer(subContainer);
          });
          subContainers = subContainers.filter(subContainer => this.ifContainerEnoughSpace(subContainer));
        } else {
          // According to the container and how many bags left
          // fill one layer first
          let largestCapacity = Math.max(capacityA, capacityB, capacityC);
          let fillDirection = [capacityA, capacityB, capacityC].findIndex((c)=> c === largestCapacity);
          let bagSpace;
          if (fillDirection === 0){
            packedBags = Math.min(capacityA, bagsLeft);
            bagSpace = {
              a: bag.a * packedBags,
              b: bag.b,
              c: bag.c
            };
          } else if (fillDirection === 1) {
            packedBags = Math.min(capacityB, bagsLeft);
            bagSpace = {
              a: bag.a,
              b: bag.b * packedBags,
              c: bag.c
            };
          } else {
            packedBags = Math.min(capacityC, bagsLeft);;
            bagSpace = {
              a: bag.a,
              b: bag.b,
              c: bag.c * packedBags
            };
          }
          subContainers = this.fitBags(containers[i], bagSpace).map( subContainer => {
            return this.rotateContainer(subContainer);
          });
          subContainers = subContainers.filter(subContainer => this.ifContainerEnoughSpace(subContainer));
        }
        containers.splice(i, 1);
        await this.setState({
          containers: [...containers, ...subContainers]
        });
        break;
      }
    }
    return packedBags;
  }

  fitBags = (container, bagSpace) => {
    // fit bags and return new sub containers
    let newContainers =[];
    if(container.a !== bagSpace.a) {
      newContainers.push({
        a: container.a - bagSpace.a,
        b: container.b,
        c: container.c
      });
    }
    if(container.c !== bagSpace.c) {
      newContainers.push({
        a: bagSpace.a,
        b: bagSpace.b,
        c: container.c - bagSpace.c
      });
    }
    if(container.b !== bagSpace.b) {
      newContainers.push({
        a: bagSpace.a,
        b: container.b - bagSpace.b,
        c: container.c
      });
    }
    return newContainers;
  }

  rotateContainer = (container) => {
    // Rotate it so that container.a>b>c
    if(container.a < container.b) {
      let larger = container.b;
      container.b = container.a;
      container.a = larger;
    }
    if(container.a < container.c) {
      let larger = container.c;
      container.c = container.a;
      container.a = larger;
    }
    if(container.b < container.c) {
      let larger = container.c;
      container.c = container.b;
      container.b = larger;
    }
    return container;
  }

  ifContainerEnoughSpace = (sortedContainer) => {
    if(sortedContainer.a < 23 || sortedContainer.b < 16 || sortedContainer.c < 2) {
      return false; // If the space cannot even fit in a smallest bag
    }
    return true;
  }

  resetData = () => {
    this.setState({
      containers: [],
      totalBoxes: 0,
      errorMessage: '',
      resultReady: false
    });
  }

  render() {
    return (
      <div className="App">
        <header>
          <img src={logo} className="App-logo" alt="logo" />
          <h3 className="App-title">Slurp Developer Exercise</h3>
        </header>

        <div className="App-body">
          <InputArea
            onSubmit={this.calculateTotalBox}
          />

          <ResultArea
            totalBoxes={this.state.totalBoxes}
            errorMessage={this.state.errorMessage}
          />
        </div>
      </div>
    );
  }
}

export default App;
