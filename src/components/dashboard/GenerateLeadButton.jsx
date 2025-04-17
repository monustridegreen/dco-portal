// src/components/dashboard/GenerateLeadButton.jsx
import React from 'react';
import { Button } from 'react-bootstrap';

const GenerateLeadButton = ({ onClick }) => {
  return (
    <Button className="generate-lead-btn" variant="primary" size="lg" onClick={onClick}>
      Generate Lead
    </Button>
  );
};

export default GenerateLeadButton;
