/* eslint-disable no-unused-vars */
// src/components/dashboard/LeadFunnelChart.jsx
import React from 'react';
import { Card } from 'react-bootstrap';

const LeadFunnelChart = ({ data }) => {
  // This is a placeholder. In a real implementation,
  // you would use a charting library like recharts, Chart.js, or d3.js
  return (
    <Card className="lead-funnel-chart">
      <Card.Body>
        <Card.Title>Lead Funnel</Card.Title>
        <div className="funnel-visualization">
          {/* Placeholder for actual chart */}
          <div className="funnel-chart-placeholder" style={{ height: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4>133</h4>
                <p>Total</p>
                <small>100%</small>
              </div>
              <div>
                <h4>4</h4>
                <p>Pending</p>
                <small>3%</small>
              </div>
              <div>
                <h4>23</h4>
                <p>In Progress</p>
                <small>17.3%</small>
              </div>
              <div>
                <h4>4</h4>
                <p>Approved</p>
                <small>3%</small>
              </div>
              <div>
                <h4>4</h4>
                <p>Disbursed</p>
                <small>3%</small>
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LeadFunnelChart;
