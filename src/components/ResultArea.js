import React from 'react';

const ResultArea = ({totalBoxes, errorMessage}) => {
  if(!errorMessage) {
    return(
      <div
       className="result-area"
       >
       <h5>
        Estimated number of boxes:
       </h5>
       <div className="result-box-number">
         <h3>{totalBoxes}</h3>
       </div>
      </div>
    );
  } else {
    return (
      <div
       className="ui result-area"
       >
       <div className="result-error">
          <p>{errorMessage}</p>
       </div>
      </div>
    );
  }
}

export default ResultArea;
