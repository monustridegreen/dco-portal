// src/components/dashboard/GenerateLeadModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const GenerateLeadModal = ({ show, onClose }) => {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      // Handle form submission
      onClose();
    }
    setValidated(true);
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Generate Lead</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" required />
                <Form.Control.Feedback type="invalid">Please provide a first name.</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" required />
                <Form.Control.Feedback type="invalid">Please provide a last name.</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control type="tel" pattern="[0-9]{10}" required />
                <Form.Control.Feedback type="invalid">Please provide a valid 10-digit mobile number.</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>PAN Number</Form.Label>
                <Form.Control type="text" pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" required />
                <Form.Control.Feedback type="invalid">Please provide a valid PAN number.</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" required />
                <Form.Control.Feedback type="invalid">Please provide a valid email.</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Lead Type</Form.Label>
                <Form.Select required>
                  <option value="">Select lead type</option>
                  <option value="personal">Personal</option>
                  <option value="business">Business</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">Please select a lead type.</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control as="textarea" rows={2} required />
            <Form.Control.Feedback type="invalid">Please provide an address.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control as="textarea" rows={2} />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default GenerateLeadModal;
