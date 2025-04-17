import React, { useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faUniversity } from '@fortawesome/free-solid-svg-icons';
import { convertTimeToIST, convertIntoDateOnly } from '../../shared/functions';
import { fetchAssetOwnerProspectCapitalProviders } from '../../utils/graphQL/graphQlAPI';

const LeadTable = ({ data = [], pageDetails, onPageChange }) => {
  const [assetOwnerProspectApplicationCapitalProviderData, setAssetOwnerProspectApplicationCapitalProviderData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
    setAssetOwnerProspectApplicationCapitalProviderData([]);
  };

  const getCapitalProviders = async (applicationId) => {
    setIsLoading(true);
    setShowModal(true);

    try {
      const { capitalProviders } = await fetchAssetOwnerProspectCapitalProviders(applicationId);
      setAssetOwnerProspectApplicationCapitalProviderData(capitalProviders);
    } catch (error) {
      console.error('Error fetching asset owner prospect capital providers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPagination = () => {
    if (!pageDetails) return null;

    const currentPage = pageDetails.currentPage || 1;
    const totalPages = (pageDetails.totalPages || 1) - 1; // Adjust totalPages to exclude the empty last page
    const maxVisiblePages = 5; // Maximum number of visible pages

    const pages = [];

    // Add "Previous" button
    pages.push(
      <Button key="prev" variant="light" size="sm" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
        &lt;
      </Button>,
    );

    // Calculate visible page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust startPage if endPage is at the limit
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(
        <Button key={1} variant={currentPage === 1 ? 'primary' : 'light'} size="sm" onClick={() => onPageChange(1)}>
          1
        </Button>,
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="pagination-ellipsis">
            ...
          </span>,
        );
      }
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button key={i} variant={currentPage === i ? 'primary' : 'light'} size="sm" onClick={() => onPageChange(i)}>
          {i}
        </Button>,
      );
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="pagination-ellipsis">
            ...
          </span>,
        );
      }
      pages.push(
        <Button key={totalPages} variant={currentPage === totalPages ? 'primary' : 'light'} size="sm" onClick={() => onPageChange(totalPages)}>
          {totalPages}
        </Button>,
      );
    }

    // Add "Next" button
    pages.push(
      <Button key="next" variant="light" size="sm" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
        &gt;
      </Button>,
    );

    return pages;
  };
  const getStatusBadgeClass = (status) => {
    if (!status) return 'status-unknown';

    const statusLower = status.toLowerCase();
    if (statusLower.includes('reject')) return 'status-rejected';
    if (statusLower.includes('progress')) return 'status-in-progress';
    if (statusLower.includes('pending')) return 'status-pending';
    if (statusLower.includes('approved') || statusLower.includes('convert')) return 'status-approved';
    if (statusLower.includes('dropped')) return 'status-dropped';
    return 'status-unknown';
  };

  const handleViewDetails = (leadId) => {
    sessionStorage.setItem('leadId', leadId);
    window.open('/engage/leadDetails', '_blank');
  };

  return (
    <div className="lead-table-container">
      <Table responsive hover className="lead-table">
        <thead>
          <tr>
            <th>S. No</th>
            <th>Name</th>
            <th>Mobile No</th>
            <th>PAN No</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((lead, index) => (
              <tr key={lead.id}>
                {/* Ensure default values for currentPage and itemsPerPage */}
                <td>{((pageDetails?.currentPage || 1) - 1) * (pageDetails?.itemsPerPage || 10) + index + 1}</td>
                <td>{`${lead.firstName || ''} ${lead.lastName || ''}`}</td>
                <td>{lead.phone}</td>
                <td>{lead.pan}</td>
                <td>{convertIntoDateOnly(lead.createdAt)}</td>
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(lead.status)}`}>
                    {lead.status
                      ? lead.status
                          .split('_')
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                          .join(' ')
                      : 'Unknown'}
                  </span>
                </td>
                <td>
                  <Button variant="light" size="sm" className="action-btn" onClick={() => getCapitalProviders(lead.id)}>
                    <FontAwesomeIcon icon={faUniversity} />
                  </Button>
                  <Button variant="light" size="sm" className="action-btn ms-2" onClick={() => handleViewDetails(lead.id)}>
                    <FontAwesomeIcon icon={faEye} />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No leads found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="pagination-container d-flex justify-content-center gap-1 mt-3">{renderPagination()}</div>

      {/* Modal for Capital Providers */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Capital Providers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <div>Loading...</div>
          ) : assetOwnerProspectApplicationCapitalProviderData?.length > 0 ? (
            <Table responsive bordered hover className="bg-white shadow-sm rounded-lg overflow-hidden my-3">
              <thead className="bg-gray-100 text-left text-xs font-medium text-gray-700">
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {assetOwnerProspectApplicationCapitalProviderData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="text-gray-800 text-sm font-medium">{item.capitalProvider.name}</td>
                    <td className={`text-sm font-medium status-badge ${getStatusBadgeClass(item.status)}`}>
                      {item.status && item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
                    </td>
                    <td className="text-gray-800 text-sm font-medium">{item.note || 'N/A'}</td>
                    <td className="text-gray-800 text-sm font-medium">{convertTimeToIST(item.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No Capital provider has been selected so far.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LeadTable;
