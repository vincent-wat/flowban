import React from 'react';
import './Stage.css';

const Stage = ({ title, cases }) => {
  return (
    <div className="stage">
      <h2>{title}</h2> 
      <div className="case-list">
        {cases.map((caseItem, index) => (
          <div key={index} className="case">
            {caseItem} 
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stage;
