// src/components/dashboard/LeadSummaryCard.jsx
import React from 'react';
import { Card } from 'react-bootstrap';

const LeadSummaryCard = ({ title, count, icon, percentage }) => {
  return (
    <Card className="lead-summary-card">
      <Card.Body>
        <div className="card-icon-container">{icon && <div className="card-icon">{icon}</div>}</div>
        <div className="card-content">
          <h2 className="card-count">{count}</h2>
          <p className="card-title">{title}</p>
          {percentage && <p className="card-percentage">{percentage}%</p>}
        </div>
      </Card.Body>
    </Card>
  );
};

export default LeadSummaryCard;
