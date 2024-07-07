import React from 'react';
import './VisitorLog.css';

interface Visitor {
  name: string;
  contact: string;
  purpose: string;
  host: string;
  arrival: string;
  image: string; // New field for image data
}

interface VisitorLogProps {
  visitors: Visitor[];
}

const VisitorLog: React.FC<VisitorLogProps> = ({ visitors }) => {
  return (
    <div className="visitor-log">
      {visitors.map((visitor, index) => (
        <div key={index} className="visitor-entry">
          <p>Name: {visitor.name}</p>
          <p>Contact: {visitor.contact}</p>
          <p>Purpose: {visitor.purpose}</p>
          <p>Host: {visitor.host}</p>
          <p>Arrival: {visitor.arrival}</p>
          {visitor.image && (
            <img src={`data:image/jpeg;base64,${visitor.image}`} alt={`${visitor.name}'s avatar`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default VisitorLog;
