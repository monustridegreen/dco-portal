import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const GenerateLeadModal = ({ show, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [validated, setValidated] = useState(false);
  const totalSteps = 5;

  const steps = ['Personal Details', 'Demographic Details', 'Vehicle & Loan Details', 'Upload Documents', 'Co-Applicant Details'];

  const handleNext = () => {
    const form = document.getElementById(`step-${currentStep}-form`);
    let isValid = true;

    if (form) {
      isValid = form.checkValidity();
      if (!isValid) {
        setValidated(true);
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setValidated(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setValidated(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      // Handle form submission
      onClose();
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="step-indicator d-flex mb-4 position-relative">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className={`step-item ${index + 1 <= currentStep ? 'active' : ''}`}>
              <div
                className="py-2 px-3 rounded"
                style={{
                  backgroundColor: index + 1 <= currentStep ? 'linear-gradient(to right, #19388A, #22996D)' : '#f0f0f0',
                  color: index + 1 <= currentStep ? '#fff' : '#333',
                  background: index + 1 <= currentStep ? 'linear-gradient(to right, #19388A, #22996D)' : '#f0f0f0',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                }}
              >
                {step}
              </div>
            </div>
            {index < steps.length - 1 && <div className="connector flex-grow-1 align-self-center mx-2" style={{ height: '1px', backgroundColor: '#ddd' }}></div>}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderPersonalDetailsStep = () => {
    return (
      <Form id="step-1-form" noValidate validated={validated}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>First Name*</Form.Label>
              <Form.Control type="text" required />
              <Form.Control.Feedback type="invalid">Please provide a first name.</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Last Name" />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number*</Form.Label>
              <Form.Control type="tel" pattern="[0-9]{10}" required placeholder="9876543456" />
              <Form.Control.Feedback type="invalid">Please provide a valid 10-digit mobile number.</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>PAN No*</Form.Label>
              <Form.Control type="text" pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" required placeholder="AQWES0908L" />
              <Form.Control.Feedback type="invalid">Please provide a valid PAN number.</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth*</Form.Label>
              <Form.Control type="date" required />
              <Form.Control.Feedback type="invalid">Please provide a date of birth.</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Select Gender*</Form.Label>
              <div>
                <Form.Check inline type="radio" name="gender" id="male" label="Male" defaultChecked required />
                <Form.Check inline type="radio" name="gender" id="female" label="Female" />
                <Form.Check inline type="radio" name="gender" id="other" label="Other" />
              </div>
              <Form.Control.Feedback type="invalid">Please select a gender.</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    );
  };

  const renderDemographicDetailsStep = () => {
    return (
      <Form id="step-2-form" noValidate validated={validated}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control as="textarea" rows={2} placeholder="Address" />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Enter Pincode*</Form.Label>
              <Form.Control type="text" pattern="[0-9]{6}" required placeholder="121212" />
              <Form.Control.Feedback type="invalid">Please provide a valid 6-digit pincode.</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Select Customer Type*</Form.Label>
              <Form.Select required>
                <option value="">Select Customer Type</option>
                <option value="MEDIUM ASSET OWNER">MEDIUM ASSET OWNER</option>
                <option value="LOW ASSET OWNER">LOW ASSET OWNER</option>
                <option value="HIGH ASSET OWNER">HIGH ASSET OWNER</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">Please select a customer type.</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Enter Applicant Profile</Form.Label>
              <Form.Control type="text" placeholder="Applicant Profile" />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>House Type</Form.Label>
              <Form.Select>
                <option value="">Select House Type</option>
                <option value="owned">Owned</option>
                <option value="rented">Rented</option>
                <option value="leased">Leased</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Select Employment Type</Form.Label>
              <Form.Select>
                <option value="">Select Employment Type</option>
                <option value="salaried">Salaried</option>
                <option value="self-employed">Self-Employed</option>
                <option value="business">Business</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Monthly Rent</Form.Label>
              <Form.Control type="number" placeholder="Enter Monthly Rent" />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Monthly Income</Form.Label>
              <Form.Control type="number" placeholder="Enter Monthly Income" />
            </Form.Group>
          </Col>
        </Row>
      </Form>
    );
  };

  const renderVehicleLoanDetailsStep = () => {
    return (
      <Form id="step-3-form" noValidate validated={validated}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle OEM*</Form.Label>
              <Form.Select required>
                <option value="">Select Vehicle OEM</option>
                <option value="Motovolt">Motovolt</option>
                <option value="Honda">Honda</option>
                <option value="Toyota">Toyota</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">Please select a vehicle OEM.</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Model*</Form.Label>
              <Form.Select required>
                <option value="">Select Vehicle Model</option>
                <option value="M7">M7</option>
                <option value="M5">M5</option>
                <option value="M3">M3</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">Please select a vehicle model.</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>No. Of Vehicles</Form.Label>
              <Form.Control type="number" placeholder="Enter No. Of Vehicles" />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Loan Down Payment</Form.Label>
              <Form.Control type="number" placeholder="Loan Down Payment" />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Loan Tenure (Months)</Form.Label>
              <Form.Control type="number" placeholder="Loan Tenure" />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Source Of Lead*</Form.Label>
              <Form.Control type="text" required placeholder="Source Of Lead" />
              <Form.Control.Feedback type="invalid">Please provide a source of lead.</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    );
  };

  const renderUploadDocumentsStep = () => {
    return (
      <Form id="step-4-form" noValidate validated={validated}>
        <Row>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Upload Bank Statement (6 Months)</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Upload Aadhar Front*</Form.Label>
              <Form.Control type="file" required />
              <Form.Control.Feedback type="invalid">Please upload Aadhar front.</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Upload Aadhar Back*</Form.Label>
              <Form.Control type="file" required />
              <Form.Control.Feedback type="invalid">Please upload Aadhar back.</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Upload PAN*</Form.Label>
              <Form.Control type="file" required />
              <Form.Control.Feedback type="invalid">Please upload PAN.</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Upload DL</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Upload GST Certificate</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Upload MSME Certificate</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Upload Electricity Bill</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Upload Rent Agreement</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Upload Statement of Account</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Upload Income Tax Return</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Upload Computation of ITR</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Upload Performa Invoice</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Upload Audited Financials</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
          </Col>
        </Row>
      </Form>
    );
  };

  const renderCoApplicantDetailsStep = () => {
    return (
      <Form id="step-5-form" noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Co-Applicant First Name</Form.Label>
              <Form.Control type="text" placeholder="Enter First Name" />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Co-Applicant Last Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Last Name" />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Co-Applicant Phone Number</Form.Label>
              <Form.Control type="tel" placeholder="Enter Phone No" />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Co-Applicant PAN No</Form.Label>
              <Form.Control type="text" placeholder="Enter PAN No" />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Co-Applicant Upload Aadhar Front</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Co-Applicant Upload Aadhar Back</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Co-Applicant Upload PAN</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
          </Col>
        </Row>
      </Form>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalDetailsStep();
      case 2:
        return renderDemographicDetailsStep();
      case 3:
        return renderVehicleLoanDetailsStep();
      case 4:
        return renderUploadDocumentsStep();
      case 5:
        return renderCoApplicantDetailsStep();
      default:
        return null;
    }
  };

  const renderFooterButtons = () => {
    return (
      <div className="d-flex justify-content-between mt-4">
        {currentStep > 1 ? (
          <Button variant="outline-primary" onClick={handlePrev} style={{ borderRadius: '20px', width: '100px' }}>
            Prev
          </Button>
        ) : (
          <div></div> // Empty div to maintain alignment
        )}

        {currentStep < totalSteps ? (
          <Button
            variant="primary"
            onClick={handleNext}
            style={{
              borderRadius: '20px',
              width: '100px',
              background: 'linear-gradient(to right, #19388A, #22996D)',
              border: 'none',
            }}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={handleSubmit}
            style={{
              borderRadius: '20px',
              width: '160px',
              background: 'linear-gradient(to right, #19388A, #22996D)',
              border: 'none',
            }}
          >
            Generate OTP
          </Button>
        )}
      </div>
    );
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Got any new lead?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {renderStepIndicator()}
        <div className="step-content">{renderStepContent()}</div>
        {renderFooterButtons()}
      </Modal.Body>
    </Modal>
  );
};

export default GenerateLeadModal;
