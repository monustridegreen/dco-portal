import React, { useState } from 'react';
import { Card, Row, Col, Container, Button, Modal, ListGroup } from 'react-bootstrap';
import { FaDownload, FaUpload } from 'react-icons/fa';

const LeadProfile = ({ applicantData, filteredDownloadOptions, unfilteredDownloadOptions, handleDownloadClick, handleFileChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState([]);

  const handleShowModal = (title, data) => {
    setModalTitle(title);
    setModalData(data);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalTitle('');
    setModalData([]);
  };

  return (
    <Container fluid className="p-0">
      <Card className="border-0 shadow-sm mb-0">
        <Card.Body className="p-3">
          <Row className="align-items-center mb-4">
            <Col xs="auto">
              <div
                className="bg-light rounded-circle p-3"
                style={{
                  width: '70px',
                  height: '70px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ color: '#3366CC', fontSize: '24px', fontWeight: 'bold' }}>
                  <span>👤</span>
                </div>
              </div>
            </Col>
            <Col>
              <h5 className="mb-0 fw-bold">{`${applicantData?.firstName || ''} ${applicantData?.lastName || ''}`.trim() || 'N/A'}</h5>
              <div className="text-muted small">
                <span>📞 {applicantData?.phone || 'N/A'}</span>
              </div>
              <div className="text-muted small">
                <span>📧 {applicantData?.pan || 'N/A'}</span>
              </div>
            </Col>
            <Col xs="auto">
              <div className="d-flex gap-2">
                {/* Download Button */}
                <Button
                  variant="outline-success"
                  className="rounded-circle"
                  style={{
                    width: '38px',
                    height: '38px',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => handleShowModal('Download Options', filteredDownloadOptions)}
                >
                  <FaDownload />
                </Button>

                {/* Upload Button */}
                <Button
                  variant="outline-success"
                  className="rounded-circle"
                  style={{
                    width: '38px',
                    height: '38px',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => handleShowModal('Upload Options', unfilteredDownloadOptions)}
                >
                  <FaUpload />
                </Button>
              </div>
            </Col>
          </Row>

          <Row className="g-4">
            <Col xs={12} sm={6} md={3}>
              <div className="d-flex align-items-center">
                <div className="me-2">
                  <span className="text-muted">📅</span>
                </div>
                <div>
                  <div className="text-muted small">Date of Birth</div>
                  <div className="fw-bold">{applicantData?.dob || 'N/A'}</div>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <div className="d-flex align-items-center">
                <div className="me-2">
                  <span className="text-muted">📋</span>
                </div>
                <div>
                  <div className="text-muted small">Lead Source</div>
                  <div className="fw-bold">{applicantData?.leadSource || 'N/A'}</div>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <div className="d-flex align-items-center">
                <div className="me-2">
                  <span className="text-muted">🚗</span>
                </div>
                <div>
                  <div className="text-muted small">Vehicle</div>
                  <div className="fw-bold">{`${applicantData?.assetOem || ''} ${applicantData?.assetModel || ''}`.trim() || 'N/A'}</div>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <div className="d-flex align-items-center">
                <div className="me-2">
                  <span className="text-muted">💳</span>
                </div>
                <div>
                  <div className="text-muted small">Credit Score</div>
                  <div className="fw-bold">{applicantData?.creditScore || 'N/A'}</div>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Modal for Download/Upload Options */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {modalData.map((option, index) => (
              <ListGroup.Item
                key={index}
                action={option.isEnabled}
                style={{
                  cursor: option.isEnabled ? 'pointer' : 'not-allowed',
                  color: option.isEnabled ? 'inherit' : 'gray',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>
                  {option.label} ({option.documentType})
                </span>
                {modalTitle === 'Download Options' && (
                  <Button
                    variant="link"
                    onClick={() => option.isEnabled && handleDownloadClick(option.documentType, option.label)}
                    style={{ padding: 0, textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Download
                  </Button>
                )}
                {modalTitle === 'Upload Options' && <input type="file" onChange={(event) => handleFileChange(event, option.documentType, option.label)} style={{ cursor: 'pointer' }} />}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LeadProfile;
