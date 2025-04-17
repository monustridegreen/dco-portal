/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { fetchAssetOwnerProspectApplicationById, fetchPlatformFinanciers, fetchAccounts, fetchAssetOwnerProspectCapitalProviders } from '../../utils/graphQL/graphQlAPI';
import {
  capitalProviderStat,
  assetOwnerType,
  DocumentStatus,
  finalApplicationStatmus,
  HouseType,
  documentCheckStatus,
  genderOptions,
  formatDate,
  formatDateCreditReport,
  convertTimeToIST,
  Dealerships,
} from '../../shared/enum';
import LeadProfile from './LeadProfile';
import { Container, Form, Row, Col, Button, Table, Modal } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import api from '../../utils/restApi/apis/api';
import { getAccessToken } from '../../utils/auth';

const Index = () => {
  const roleType = localStorage.getItem('roleType');
  //   Separate useState for customer details
  const [customerType, setCustomerType] = useState('');
  const [platformFinancierOptions, setPlatformFinancierOptions] = useState([]);
  const [gender, setGender] = useState('');
  const [assetCount, setAssetCount] = useState('');
  const [creditScore, setCreditScore] = useState('');
  const [cibilScore, setCibilScore] = useState('');
  const [applicantProfile, setApplicantProfile] = useState('');
  const [reason, setReason] = useState('');

  const [houseType, setHouseType] = useState('');
  const [loanTenure, setLoanTenure] = useState();
  const [loanDownPayment, setLoanDownPayment] = useState();

  const [positives, setPositives] = useState('');
  const [negatives, setNegatives] = useState('');
  const [remarks, setRemarks] = useState('');
  const [documentStatus, setDocumentStatus] = useState('');
  const [creditReportStatus, setCreditReportStatus] = useState('');
  const [finalApplicationStatus, setFinalApplicationStatus] = useState('');
  const [leadsSource, setLeadsSource] = useState('');

  const [accountId, setAccountId] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [applicantData, setApplicantData] = useState({});
  const [creditCheckStatus, setCreditCheckStatus] = useState('');
  const [documentsData, setDocumentsData] = useState([]);
  const [coApplicantDocmentsData, setCoApplicantDocmentsData] = useState([]);
  const [filteredDownloadOptions, setFilteredDownloadOptions] = useState([]);
  const [unfilteredDownloadOptions, setUnfilteredDownloadOptions] = useState([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCapitalProvider, setSelectedCapitalProvider] = useState('');
  const [selectedCapitalProviderLabel, setSelectedCapitalProviderLabel] = useState('');
  const [downloadLoading, setDownloadLoading] = useState(false);

  const [assetOwnerProspectApplicationCapitalProviderData, setAssetOwnerProspectApplicationCapitalProviderData] = useState([]);
  const [isAdd, setIsAdd] = useState(false);
  const [capitalProviderStatus, setCapitalProviderStatus] = useState('PENDING');

  const [capitalProviders, setCapitalProviders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Co - Borrower
  const [coFirstName, setCoFirstName] = useState('');
  const [coLastName, setCoLastName] = useState('');
  const [coPhoneNo, setCoPhoneNo] = useState('');
  const [coPanNo, setCoPanNo] = useState('');
  const [coApplicantId, setCoApplicantId] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [selectedCapitalProviderItemId, setSelectedCapitalProviderItemId] = useState(null);
  const [selectedCapitalProviderId, setSelectedCapitalProviderId] = useState(null);
  const [tempCaptialProviderStatus, setTempCapitalProviderStatus] = useState('PENDING');

  const [reportData, setReportData] = useState([]);
  const [showReport, setShowReport] = useState(true);
  const [userAccountData, setUserAccountData] = useState([]);
  const [selectedDealerUserId, setSelectedDealerUserId] = useState('');

  const [evalutedData, setEvalutedData] = useState([]);
  const [enabledSelect, setEnabledSelect] = useState({});

  const [tempCaptialProviderStatustoShow, setTempCapitalProviderStatusToShow] = useState({});

  const [showModal, setShowModal] = useState(false);

  const [isOrganicLead, setIsOrganicLead] = useState();
  const [generatedBy, setGeneratedBy] = useState({
    generatedBy: null,
    generatedByFirstName: null,
    generatedByLastName: null,
    generatedByPhoneNo: null,
  });

  //
  const [dealer, setDealer] = useState('');
  const [chassisNumbers, setChassisNumbers] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [disbursedDate, setDisbursedDate] = useState('');

  const [tempCustomerDetails, setTempCustomerDetails] = useState({});

  const leadAccountId = sessionStorage.getItem('leadId');
  const BASE_URL = 'https://odyssey.stridegreen.in/spacedock/';

  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [showSlow, setShowSlow] = useState(false);
  const [fileUrls, setFileUrls] = useState({});
  const [errors, setErrors] = useState({});
  const [isDownloadDocument, setIsDownloadDocument] = useState(false);
  const downloadOptions = [
    { label: 'Aadhar Card Front', documentType: 'AADHAAR_CARD_FRONT', isEnabled: true },
    { label: 'Aadhar Card Back', documentType: 'AADHAAR_CARD_BACK', isEnabled: true },
    { label: 'Driving Licence', documentType: 'DRIVING_LICENSE', isEnabled: true },
    { label: 'Bank Statement', documentType: 'BANK_ACCOUNT_STATEMENT', isEnabled: true },
    { label: 'PAN Card', documentType: 'PAN_CARD', isEnabled: true },
    // { label: "Credit Report", documentType: "CREDIT_REPORT", isEnabled: finalApplicationStatus === "APPROVED" },
    { label: 'Credit Report', documentType: 'CREDIT_REPORT', isEnabled: true },
    { label: 'GST Certificate', documentType: 'GST_CERTIFICATE', isEnabled: true },
    { label: 'MSME Certificate', documentType: 'MSME_CERTIFICATE', isEnabled: true },
    { label: 'Electricity Bill', documentType: 'ELECTRICITY_BILL', isEnabled: true },
    { label: 'Rent Agreement', documentType: 'RENT_AGREEMENT', isEnabled: true },
    { label: 'Statement of Account', documentType: 'STATEMENT_OF_ACCOUNT', isEnabled: true },
    { label: 'Income Tax Return', documentType: 'INCOME_TAX_RETURN', isEnabled: true },
    { label: 'Computation of ITR', documentType: 'COMPUTATION_OF_ITR', isEnabled: true },
    { label: 'Performa Invoice', documentType: 'PERFORMA_INVOICE', isEnabled: true },
    { label: 'Audited Financials', documentType: 'AUDITED_FINANCIALS', isEnabled: true },
  ];

  const coApplicantDownloadOptions = [
    { label: 'Co-Applicant Aadhar Card Front', documentType: 'AADHAAR_CARD_FRONT', isEnabled: true },
    { label: 'Co-Applicant Aadhar Card Back', documentType: 'AADHAAR_CARD_BACK', isEnabled: true },
    { label: 'Co-Applicant PAN Card', documentType: 'PAN_CARD', isEnabled: true },
  ];

  const approvedData = assetOwnerProspectApplicationCapitalProviderData?.filter((item) => item?.status === 'APPROVED');

  useEffect(() => {
    const filtered = downloadOptions?.filter((option) => documentsData?.some((doc) => doc?.documentType === option?.documentType));
    const CoApplicantfiltered = coApplicantDownloadOptions?.filter((option) => coApplicantDocmentsData?.some((doc) => doc?.documentType === option?.documentType));
    let combinedFiltered = [...filtered, ...CoApplicantfiltered];

    if (!combinedFiltered.some((option) => option.documentType === 'CREDIT_REPORT')) {
      const creditReportOption = downloadOptions.find((option) => option.documentType === 'CREDIT_REPORT');

      // Check if creditReportOption exists and if applicantData?.creditScore has data
      if (creditReportOption && applicantData?.creditScore) {
        combinedFiltered.push(creditReportOption);
      }
    }

    const unfiltered = downloadOptions?.filter((option) => !documentsData?.some((doc) => doc?.documentType === option?.documentType));
    const coUnfiltered = coApplicantDownloadOptions?.filter((option) => !coApplicantDocmentsData?.some((doc) => doc?.documentType === option?.documentType));
    const combinedUnfiltered = [...unfiltered, ...coUnfiltered];

    setFilteredDownloadOptions(combinedFiltered);
    setUnfilteredDownloadOptions(combinedUnfiltered);
  }, [documentsData, coApplicantDocmentsData]);

  const validateApplicationStatus = () => {
    const newErrors = {};

    const isAnyApproved = approvedData.length > 0;

    if (finalApplicationStatus === 'DISBURSED' && !isAnyApproved) {
      newErrors.CapitalProviderSelected = 'Disbursed status requires one approved capital provider';
    }

    if (finalApplicationStatus === 'DISBURSED' && (!inputValue || inputValue?.length === 0 || (Array.isArray(inputValue) && inputValue[0] === ''))) {
      newErrors.inputValue = 'Chassis numbers are required';
    }

    if (finalApplicationStatus === 'DISBURSED' && !disbursedDate) {
      newErrors.DisbursedDate = 'Disbursed date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchApplicantData = async (id) => {
    try {
      const data = await fetchAssetOwnerProspectApplicationById(id);
      const fetchedData = data || {};

      if (fetchedData) {
        setCustomerType(fetchedData.customerType || '');
        const capitalProviderLabel = fetchedData.capitalProvider || '';
        const selectedCapitalProviderOption = platformFinancierOptions.find((option) => {
          return option.label === capitalProviderLabel;
        });
        if (selectedCapitalProviderOption) {
          setSelectedCapitalProvider(selectedCapitalProviderOption.value);
        } else {
          setSelectedCapitalProvider('');
        }

        const dealerValue = fetchedData.generatedBy;

        setIsOrganicLead(fetchedData?.isOrganic || false);
        setGeneratedBy({
          generatedBy: fetchedData?.generatedBy || null,
          generatedByFirstName: fetchedData?.generatedByFirstName || null,
          generatedByLastName: fetchedData?.generatedByLastName || null,
          generatedByPhoneNo: fetchedData?.generatedByPhoneNo || null,
        });

        if (dealerValue) {
          if (dealerValue === fetchedData.userId) {
            setDealer('Self Generated');
          } else {
            const dealerLabel = Object?.values(Dealerships)?.find((dealership) => dealership?.value === dealerValue)?.label || '';
            setDealer(dealerLabel);
          }
        } else {
          setDealer('');
        }

        setGender(fetchedData.gender || '');
        setAssetCount(fetchedData.assetCount || '');
        setCreditScore(fetchedData.creditScore || '');
        setCibilScore(fetchedData.cibilScore || '');
        setApplicantProfile(fetchedData.applicantProfile || '');
        setLoanDownPayment(fetchedData.loanDownPayment);
        setLoanTenure(fetchedData.loanTenure);
        setHouseType(fetchedData.houseType);
        setInputValue(fetchedData.chassisNumbers || '');
        setDisbursedDate(fetchedData.disbursedOn);
        setPositives(fetchedData.positiveFactors?.join(', ') || '');
        setNegatives(fetchedData.negativeFactors?.join(', ') || '');
        setRemarks(fetchedData.remarks || '');
        setDocumentStatus(fetchedData.documentStatus || '');
        setCreditReportStatus(fetchedData.creditCheckStatus || '');
        setFinalApplicationStatus(fetchedData.status || '');
        setDocumentsData(fetchedData.documents || '');
        if (fetchedData.coApplicants && fetchedData.coApplicants.length > 0) {
          const coApplicant = fetchedData.coApplicants[0];
          setCoFirstName(coApplicant.firstName || '');
          setCoLastName(coApplicant.lastName || '');
          setCoPhoneNo(coApplicant.phone || '');
          setCoPanNo(coApplicant.pan || '');
          setCoApplicantId(coApplicant.id);
          setCoApplicantDocmentsData(coApplicant.documents);
        } else {
          setCoFirstName('');
          setCoLastName('');
          setCoPhoneNo('');
          setCoPanNo('');
          setCoApplicantId('');
          setCoApplicantDocmentsData([]);
        }
      }

      setApplicantData(fetchedData);
    } catch (error) {
      console.error('Error fetching applicant data:', error);
    }
  };

  const getPlatformFinancier = async () => {
    try {
      const { financiers } = await fetchPlatformFinanciers();
      const transformedData = financiers?.map((org) => ({
        value: org.id,
        label: org.name,
      }));
      setPlatformFinancierOptions(transformedData);
    } catch (error) {
      console.error('Error fetching platform financiers:', error);
    }
  };

  const getUserAccounts = async () => {
    try {
      const { accounts } = await fetchAccounts({ roleType: 'DEALER', page: 0, size: 1000 });
      setUserAccountData(accounts);
    } catch (error) {
      console.error('Error fetching user accounts:', error);
    }
  };

  const getCapitalProviders = async (applicationId) => {
    try {
      const { capitalProviders } = await fetchAssetOwnerProspectCapitalProviders(applicationId);
      setAssetOwnerProspectApplicationCapitalProviderData(capitalProviders);
    } catch (error) {
      console.error('Error fetching asset owner prospect capital providers:', error);
    }
  };

  useEffect(() => {
    getPlatformFinancier();
    getUserAccounts();

    if (leadAccountId) {
      fetchApplicantData(leadAccountId);
      getCapitalProviders(leadAccountId);
      evaluateCapitalProvider(leadAccountId);
    }
  }, [leadAccountId]);
  // Add this reusable handler function
  const handleInputChange = (field, value) => {
    switch (field) {
      case 'customerType':
        setCustomerType(value);
        break;
      case 'gender':
        setGender(value);
        break;
      case 'assetCount':
        setAssetCount(value);
        break;
      case 'positives':
        setPositives(value);
        break;
      case 'negatives':
        setNegatives(value);
        break;
      case 'remarks':
        setRemarks(value);
        break;
      case 'creditScore':
        setCreditScore(value);
        break;
      case 'cibilScore':
        setCibilScore(value);
        break;
      case 'applicantProfile':
        setApplicantProfile(value);
        break;
      case 'loanTenure':
        setLoanTenure(value);
        break;
      case 'loanDownPayment':
        setLoanDownPayment(value);
        break;
      case 'houseType':
        setHouseType(value);
        break;
      case 'documentStatus':
        setDocumentStatus(value);
        break;
      case 'creditReportStatus':
        setCreditReportStatus(value);
        break;
      case 'finalApplicationStatus':
        setFinalApplicationStatus(value);
        break;
      case 'coFirstName':
        setCoFirstName(value);
        break;
      case 'coLastName':
        setCoLastName(value);
        break;
      case 'coPhoneNo':
        setCoPhoneNo(value);
        break;
      case 'coPanNo':
        setCoPanNo(value);
        break;
      case 'selectedDealerUserId':
        setSelectedDealerUserId(value);
        break;
      default:
        console.warn(`Unhandled field: ${field}`);
    }
  };
  const evaluateCapitalProvider = async (applicantId) => {
    const accessToken = getAccessToken();
    try {
      const response = await fetch(`${BASE_URL}onboarding/prospect/asset-owner/capital-provider/evaluate/${applicantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setEvalutedData(data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleClose = () => {
    setShowModal(false);
  };
  const toggleEdit = () => {
    setIsEditable((prevState) => !prevState);
  };

  const handleUpdate = () => {
    handleUpdateStatus();
  };
  const handleUpdateStatus = async () => {
    if (!validateApplicationStatus()) return;
    const accessToken = getAccessToken();
    const endpoint = `onboarding/prospect/asset-owner/${leadAccountId}`;
    const url = `${BASE_URL}${endpoint}`;
    const capitalProviderValue = selectedCapitalProvider ? Number(selectedCapitalProvider) : null;

    try {
      const payload = {
        ...(chassisNumbers && { chassisNumbers: chassisNumbers }),
        ...(disbursedDate && { disbursedOn: disbursedDate }),

        ...(customerType && { customerType: customerType }),
        ...(gender && { gender: gender }),
        ...(assetCount && { assetCount: parseInt(assetCount, 10) }),
        ...(creditScore && { creditScore: parseInt(creditScore, 10) }),
        ...(cibilScore && { cibilScore: parseInt(cibilScore, 10) }),
        ...(documentStatus && { documentStatus: documentStatus }),
        ...(finalApplicationStatus && { status: finalApplicationStatus }),
        capitalProvider: selectedCapitalProviderLabel,
        ...(creditReportStatus && { creditCheckStatus: creditReportStatus }),
        ...(leadsSource && { leadSource: leadsSource }),
        remarks: remarks,
        ...(applicantProfile && { applicantProfile: applicantProfile }),
        ...(loanTenure && { loanTenure: loanTenure }),
        ...(loanDownPayment && { loanDownPayment: loanDownPayment }),
        ...(houseType && { houseType: houseType }),
        ...(selectedDealerUserId && { generatedBy: selectedDealerUserId }),
        positiveFactors: [positives],
        negativeFactors: [negatives],
        coApplicants: [
          {
            ...(coApplicantId && { coApplicantId: coApplicantId }),
            ...(coFirstName && { firstName: coFirstName }),
            ...(coLastName && { lastName: coLastName }),
            ...(coPhoneNo && { phone: coPhoneNo }),
            ...(coPanNo && { pan: coPanNo }),
          },
        ],
      };

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          toast.success('Document status updated successfully!', { autoClose: 1500 });
          fetchApplicantData();
          setIsEditable(false);
        }
      } else {
        console.error('Update failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCreditReportDownload = async () => {
    const accessToken = getAccessToken();
    const endpoint = `finance/credibility/credit-report/${leadAccountId}/file`;
    const url = `${BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        const downloadUrl = data?.data?.url;
        if (downloadUrl) {
          // Create a temporary link element to trigger the download
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.target = '_blank'; // Open in a new tab or window
          link.download = downloadUrl.split('/').pop(); // Optionally, use the filename from the URL

          // Append the link to the DOM, trigger the click, and then remove the link
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          console.error('No URL available for download.');
        }
      } else {
        console.error('Failed to fetch credit report:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching credit report:', error);
    }
  };

  const handleDownload = async (documentUrl) => {
    const accessToken = getAccessToken();
    setDownloadLoading(true);

    try {
      const endpoint = `common/storage/signed-url`;
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ key: documentUrl }),
      };

      const response = await fetch(BASE_URL + endpoint, requestOptions);
      const data = await response.json();

      if (data.success) {
        const downloadUrl = data.data.url;
        const fileResponse = await fetch(downloadUrl);
        const blob = await fileResponse.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = documentUrl.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
        setDownloadLoading(false);
      } else {
        console.error('Failed to fetch signed URL');
        setDownloadLoading(false);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      setDownloadLoading(false);
    }
  };
  const handleDownloadClick = (documentType, label) => {
    if (documentType === 'CREDIT_REPORT') {
      handleCreditReportDownload();
    } else {
      const coApplicantLabels = ['Co-Applicant Aadhar Card Front', 'Co-Applicant Aadhar Card Back', 'Co-Applicant PAN Card'];
      if (coApplicantLabels.includes(label)) {
        const coApplicant = applicantData.coApplicants.find((coApp) => {
          return coApp.documents.some((doc) => doc.documentType === documentType);
        });

        if (coApplicant) {
          const document = coApplicant.documents.find((doc) => doc.documentType === documentType);

          if (document) {
            handleDownload(document.documentUrl);
          } else {
            console.error('Co-Applicant Document not found');
          }
        } else {
          console.error('Co-Applicant not found for label:', label);
        }
      } else {
        // If it's a regular documentType, search in the applicant's documents

        const document = applicantData.documents.find((doc) => doc.documentType === documentType);

        if (document) {
          handleDownload(document.documentUrl);
        } else {
          console.error('Document not found for applicant');
        }
      }
    }
  };
  const handleFileChange = async (event, fileType, label) => {
    setDownloadLoading(true);
    const file = event.target.files[0];

    if (!file) {
      console.error('No file selected');
      return;
    }

    const accessToken = getAccessToken();
    const uploadEndpoint = 'common/storage/upload';
    const uploadUrl = `${BASE_URL}${uploadEndpoint}`;

    const formData = new FormData();
    formData.append('file', file);

    try {
      // First API call to upload the file
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        const fileUrl = uploadData?.data?.url;

        // Update the corresponding file URL in the state
        setFileUrls((prev) => ({ ...prev, [fileType]: fileUrl }));

        // Check if label matches any of the co-applicant document labels
        const coApplicantLabels = ['Co-Applicant Aadhar Card Front', 'Co-Applicant Aadhar Card Back', 'Co-Applicant PAN Card'];

        let payload;

        // If the label matches a co-applicant document type, update the payload
        if (coApplicantLabels.includes(label)) {
          const endpoint = `onboarding/prospect/asset-owner/${leadAccountId}`;
          const urldd = `${BASE_URL}${endpoint}`;

          payload = {
            prospectApplicationId: leadAccountId,
            coApplicants: [
              {
                ...(coApplicantId && { coApplicantId: coApplicantId }),
                documents: [
                  {
                    documentType: fileType,
                    documentUrl: fileUrl,
                  },
                ],
              },
            ],
          };

          const response = await fetch(urldd, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
          });
        } else {
          // Otherwise, keep the payload structure as it was for the main applicant
          payload = {
            prospectApplicationId: leadAccountId,
            documents: [
              {
                documentType: fileType,
                documentUrl: fileUrl,
              },
            ],
          };

          // Second API call to onboarding/prospect/asset-owner/upload-document
          const uploadDocumentEndpoint = 'onboarding/prospect/asset-owner/upload-document';
          const uploadDocumentUrl = `${BASE_URL}${uploadDocumentEndpoint}`;

          const documentResponse = await fetch(uploadDocumentUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
          });

          if (documentResponse.ok) {
            setIsUploadOpen(false);
            toast.success('Document uploaded successfully!', { autoClose: 1500 });
            setDownloadLoading(false);
          } else {
            console.error('Failed to upload document to asset-owner:', documentResponse.statusText);
            setDownloadLoading(false);
          }
        }
      } else {
        console.error('Failed to upload file');
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fileType]: 'Failed to upload file',
        }));
        setDownloadLoading(false);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fileType]: 'Error uploading file',
      }));
      setDownloadLoading(false);
    }
  };

  const handleCheckboxChange = (index) => {
    setEnabledSelect((prevState) => {
      const newState = { ...prevState, [index]: !prevState[index] };
      if (newState[index]) {
        setSelectedCapitalProviderItemId(evalutedData[index]?.capitalProviderId);
        setSelectedCapitalProviderId(evalutedData[index]?.capitalProviderId);
      } else {
        setSelectedCapitalProviderItemId(null);
        setSelectedCapitalProviderId(null);
      }

      return newState;
    });
  };

  const handleUpdateCapitalProvider = async (updatedStatus, itemId, capitalProviderId) => {
    const accessToken = getAccessToken();
    const endpoint = `onboarding/prospect/asset-owner/${leadAccountId}/capital-providers`;
    const url = `${BASE_URL}${endpoint}`;
    const newCapitalProvider = [
      {
        capitalProviderId: parseInt(capitalProviderId),
        id: parseInt(itemId),
        status: updatedStatus,
      },
    ];

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newCapitalProvider),
      });

      if (response.status == 200) {
        getCapitalProviders(leadAccountId);
        setIsEditing(null);
        setEnabledSelect({});

        evaluateCapitalProvider(leadAccountId);

        toast.success('Capital Provider status updated successfully!', { autoClose: 1500 });
      }
    } catch (error) {
      console.error('Error creating capital provider:', error);
    } finally {
      // handleClose();
    }
  };
  const handleUpdateCapitalProviderStatus = (event, index, item) => {
    const updatedStatus = event.target.value;

    // Update the temporary status for UI feedback
    setTempCapitalProviderStatus(updatedStatus);
    setTempCapitalProviderStatusToShow((prevStatus) => ({
      ...prevStatus,
      [index]: updatedStatus, // Update the status for the specific row
    }));

    // If item.status exists or the checkbox is selected, trigger the API call
    if (item.status || enabledSelect[index]) {
      let itemId = item?.id;
      let capitalProviderId = item?.capitalProviderId;
      setSelectedCapitalProviderItemId(item?.id);
      setSelectedCapitalProviderId(item?.capitalProviderId);
      handleUpdateCapitalProvider(updatedStatus, itemId, capitalProviderId); // Trigger the API call
      setIsEditing(null);
    }
  };
  return (
    <>
      <ToastContainer />
      <div>
        <LeadProfile
          applicantData={applicantData}
          setIsDownloadDocument={setIsDownloadDocument}
          isDownloadDocument={isDownloadDocument}
          filteredDownloadOptions={filteredDownloadOptions}
          unfilteredDownloadOptions={unfilteredDownloadOptions}
          handleDownloadClick={handleDownloadClick}
          handleFileChange={handleFileChange}
        />
        <>
          <Container>
            <div className="mb-4">
              {/* Customer Details Section */}
              <div className="d-flex align-items-center mb-2">
                <span className="fw-bold fs-4">Customer Details</span>
                {roleType !== 'DEALER' && (
                  <button className="button1 flex items-center" onClick={toggleEdit}>
                    {isEditable ? 'Cancel' : 'Edit'} <FaEdit className="ml-2 cursor-pointer" />
                  </button>
                )}
              </div>

              <Form>
                <Row className="g-3 mb-4">
                  {/* First Row */}
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Customer Type</Form.Label>
                      <Form.Select
                        required
                        value={customerType}
                        onChange={(e) => handleInputChange('customerType', e.target.value)}
                        disabled={!isEditable} // Disable the dropdown when not editable
                      >
                        <option value="">Select Customer Type</option>
                        {assetOwnerType?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Gender</Form.Label>
                      <Form.Select required value={gender} onChange={(e) => handleInputChange('gender', e.target.value)} disabled={!isEditable}>
                        <option value="">Select Gender</option>
                        {genderOptions?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">No. of Assets</Form.Label>
                      <Form.Control type="number" min="0" required value={assetCount} onChange={(e) => handleInputChange('assetCount', e.target.value)} disabled={!isEditable} />
                    </Form.Group>
                  </Col>

                  {/* Second Row */}
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Positives</Form.Label>
                      <Form.Control as="textarea" value={positives} onChange={(e) => handleInputChange('positives', e.target.value)} disabled={!isEditable} />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Negatives</Form.Label>
                      <Form.Control as="textarea" value={negatives} onChange={(e) => handleInputChange('negatives', e.target.value)} disabled={!isEditable} />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Remarks</Form.Label>
                      <Form.Control as="textarea" value={remarks} onChange={(e) => handleInputChange('remarks', e.target.value)} disabled={!isEditable} />
                    </Form.Group>
                  </Col>

                  {/* Third Row */}
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Credit Score</Form.Label>
                      <Form.Control type="number" maxLength={3} required value={creditScore} onChange={(e) => handleInputChange('creditScore', e.target.value)} disabled={!isEditable} />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">CIBIL Score</Form.Label>
                      <Form.Control type="number" maxLength={3} required value={cibilScore} onChange={(e) => handleInputChange('cibilScore', e.target.value)} disabled={!isEditable} />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Applicant Profile</Form.Label>
                      <Form.Control as="textarea" rows={1} required value={applicantProfile} onChange={(e) => handleInputChange('applicantProfile', e.target.value)} disabled={!isEditable} />
                    </Form.Group>
                  </Col>

                  {/* Fourth Row */}
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Loan Tenure</Form.Label>
                      <Form.Control type="text" required value={loanTenure} onChange={(e) => handleInputChange('loanTenure', e.target.value)} disabled={!isEditable} />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Loan Down Payment</Form.Label>
                      <Form.Control type="text" required value={loanDownPayment} onChange={(e) => handleInputChange('loanDownPayment', e.target.value)} disabled={!isEditable} />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">House Type</Form.Label>
                      <Form.Select required value={houseType} onChange={(e) => handleInputChange('houseType', e.target.value)} disabled={!isEditable}>
                        <option value="">Select House Type</option>
                        {HouseType?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Fifth Row */}
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Document Check Status</Form.Label>
                      <Form.Select required value={documentStatus} onChange={(e) => handleInputChange('documentStatus', e.target.value)} disabled={!isEditable}>
                        <option value="">Select Status</option>
                        {documentCheckStatus?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Credit & Other Report Status</Form.Label>
                      <Form.Select required value={creditReportStatus} onChange={(e) => handleInputChange('creditReportStatus', e.target.value)} disabled={!isEditable}>
                        <option value="">Select Status</option>
                        {documentCheckStatus?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Final Application Status</Form.Label>
                      <Form.Select required value={finalApplicationStatus} onChange={(e) => handleInputChange('finalApplicationStatus', e.target.value)} disabled={!isEditable}>
                        <option value="">Select Status</option>
                        {finalApplicationStatmus?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Capital Provider</Form.Label>
                      <div className="flex flex-col relative">
                        <span className="border border-gray-300 rounded p-2" style={{ cursor: 'pointer' }} onClick={() => setShowModal(true)}>
                          {assetOwnerProspectApplicationCapitalProviderData.length > 0 ? 'See Capital Providers' : 'Select Capital Provider'}
                        </span>
                      </div>
                    </Form.Group>
                  </Col>

                  {/* Co-Applicant Details */}
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Co-Applicant First Name</Form.Label>
                      <Form.Control
                        name="coFirstName"
                        type="text"
                        disabled={!isEditable}
                        value={coFirstName}
                        onChange={(e) => handleInputChange('coFirstName', e.target.value)}
                        className="border border-gray-300 rounded p-2"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Co-Applicant Last Name</Form.Label>
                      <Form.Control
                        name="coLastName"
                        type="text"
                        disabled={!isEditable}
                        value={coLastName}
                        onChange={(e) => handleInputChange('coLastName', e.target.value)}
                        className="border border-gray-300 rounded p-2"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Co-Applicant Phone Number</Form.Label>
                      <Form.Control
                        name="coPhoneNo"
                        type="text"
                        disabled={!isEditable}
                        value={coPhoneNo}
                        onChange={(e) => handleInputChange('coPhoneNo', e.target.value)}
                        className="border border-gray-300 rounded p-2"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Co-Applicant PAN No</Form.Label>
                      <Form.Control
                        name="coPanNo"
                        type="text"
                        disabled={!isEditable}
                        value={coPanNo}
                        onChange={(e) => handleInputChange('coPanNo', e.target.value)}
                        className="border border-gray-300 rounded p-2"
                        required
                      />
                    </Form.Group>
                  </Col>

                  {/* Dealership Details */}
                  {isOrganicLead ? (
                    <>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fw-bold">Select Dealer</Form.Label>
                          <Form.Select
                            name="user"
                            value={selectedDealerUserId}
                            onChange={(e) => handleInputChange('selectedDealerUserId', e.target.value)}
                            className="border border-gray-300 rounded p-2"
                            disabled={!isEditable}
                            required
                          >
                            <option value="">Select Dealer</option>
                            {userAccountData.map((user) => (
                              <option key={user.userId} value={user.userId}>
                                {user.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </>
                  ) : (
                    <>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fw-bold">Dealer Name</Form.Label>
                          <Form.Control
                            name="dealerName"
                            type="text"
                            disabled
                            value={`${generatedBy?.generatedByFirstName || ''} ${generatedBy?.generatedByLastName || ''}`}
                            className="border border-gray-300 rounded p-2"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fw-bold">Dealer Phone No.</Form.Label>
                          <Form.Control name="dealerPhoneNo" type="text" disabled value={generatedBy?.generatedByPhoneNo || ''} className="border border-gray-300 rounded p-2" required />
                        </Form.Group>
                      </Col>
                    </>
                  )}
                </Row>
              </Form>
              {isEditable && (
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleUpdate}>
                  Save
                </button>
              )}
            </div>

            {/* Modal for Capital Provider */}
            {/* {isOpen && (
              <div className="fixed inset-0 z-10 cus_modal">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
                  <div className="model_dialog1 inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform">
                    <div>
                      <div className="flex items-center justify-between b_b_1 mb-3">
                        <h3 className="text-xl leading-5 font-medium text-gray-900">Capital Provider</h3>
                      </div>
                      <div className="close_icon">
                        <svg onClick={handleClose} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                          <path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"></path>
                        </svg>
                      </div>
                      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 cus_table1">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th style={{ textTransform: 'none' }}>S.No.</th>
                            <th style={{ textTransform: 'none' }}>Lender</th>
                            <th style={{ textTransform: 'none' }}>CIC Drool</th>
                            <th style={{ textTransform: 'none' }}>FI Drool</th>
                            <th style={{ textTransform: 'none' }}>Eligibility</th>
                            <th style={{ textTransform: 'none' }}>Assign</th>
                            <th style={{ textTransform: 'none' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {evalutedData?.map((item, index) => (
                            <tr key={item?.capitalProviderId} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                              <td>{index + 1}</td>
                              <td>{item?.name}</td>
                              <td>
                                {item?.cicCheck ? (
                                  <svg
                                    stroke="currentColor"
                                    style={{ color: 'green' }}
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 1024 1024"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512 282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0zm0 961.008c-247.024 0-448-201.984-448-449.01 0-247.024 200.976-448 448-448s448 200.977 448 448-200.976 449.01-448 449.01zm204.336-636.352L415.935 626.944l-135.28-135.28c-12.496-12.496-32.752-12.496-45.264 0-12.496 12.496-12.496 32.752 0 45.248l158.384 158.4c12.496 12.48 32.752 12.48 45.264 0 1.44-1.44 2.673-3.009 3.793-4.64l318.784-320.753c12.48-12.496 12.48-32.752 0-45.263-12.512-12.496-32.768-12.496-45.28 0z"></path>
                                  </svg>
                                ) : (
                                  <svg
                                    style={{ color: 'red' }}
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 1024 1024"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512 282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0zm0 961.008c-247.024 0-448-201.984-448-449.01 0-247.024 200.976-448 448-448s448 200.977 448 448-200.976 449.01-448 449.01zm181.008-630.016c-12.496-12.496-32.752-12.496-45.248 0L512 466.752l-135.76-135.76c-12.496-12.496-32.752-12.496-45.264 0-12.496 12.496-12.496 32.752 0 45.248L466.736 512l-135.76 135.76c-12.496 12.48-12.496 32.769 0 45.249 12.496 12.496 32.752 12.496 45.264 0L512 557.249l135.76 135.76c12.496 12.496 32.752 12.496 45.248 0 12.496-12.48 12.496-32.769 0-45.249L557.248 512l135.76-135.76c12.512-12.512 12.512-32.768 0-45.248z"></path>
                                  </svg>
                                )}
                              </td>
                              <td>{item?.eligibility ? 'Yes' : 'No'}</td>
                              <td>
                                <label className="inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={enabledSelect[index] || false}
                                    // onChange={() => handleCheckboxChange(index)}
                                    className="sr-only peer"
                                  />
                                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600"></div>
                                </label>
                              </td>
                              <td>
                                <select
                                  name="capitalProvider"
                                  className="w-full border border-gray-300 rounded-md p-1 text-xs"
                                  required
                                  disabled={!enabledSelect[index]}
                                  value={tempCaptialProviderStatustoShow[index] || ''}
                                  //   onChange={(event) => handleUpdateCapitalProviderStatus(event, index, item)}
                                >
                                  <option value="">Select Status</option>
                                  {capitalProviderStat?.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="mt-5 sm:flex sm:flex-row-reverse">
                        <button
                          //   onClick={handleCreateCapitalProvider}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pri text-base font-medium text-white focus:outline-none"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )} */}

            <Modal show={showModal} onHide={handleClose} size="lg" centered>
              <Modal.Header closeButton>
                <Modal.Title>Capital Provider</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {' '}
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 cus_table1">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th style={{ textTransform: 'none' }}>S.No.</th>
                      <th style={{ textTransform: 'none' }}>Lender</th>
                      <th style={{ textTransform: 'none' }}>CIC Drool</th>
                      <th style={{ textTransform: 'none' }}>FI Drool</th>
                      <th style={{ textTransform: 'none' }}>Eligibility</th>
                      <th style={{ textTransform: 'none' }}>Assign</th>
                      <th style={{ textTransform: 'none' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evalutedData?.map((item, index) => (
                      <tr
                        key={item?.capitalProviderId} // or use index as key if capitalProviderId is not guaranteed unique
                        className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                      >
                        <td>{index + 1}</td>
                        <td>{item?.name}</td>
                        <td>
                          {item?.cicCheck === true ? (
                            <svg
                              stroke="currentColor"
                              style={{ color: 'green' }}
                              fill="currentColor"
                              strokeWidth="0"
                              viewBox="0 0 1024 1024"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512 282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0zm0 961.008c-247.024 0-448-201.984-448-449.01 0-247.024 200.976-448 448-448s448 200.977 448 448-200.976 449.01-448 449.01zm204.336-636.352L415.935 626.944l-135.28-135.28c-12.496-12.496-32.752-12.496-45.264 0-12.496 12.496-12.496 32.752 0 45.248l158.384 158.4c12.496 12.48 32.752 12.48 45.264 0 1.44-1.44 2.673-3.009 3.793-4.64l318.784-320.753c12.48-12.496 12.48-32.752 0-45.263-12.512-12.496-32.768-12.496-45.28 0z"></path>
                            </svg>
                          ) : item?.cicCheck === false ? (
                            <svg style={{ color: 'red' }} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                              <path d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512 282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0zm0 961.008c-247.024 0-448-201.984-448-449.01 0-247.024 200.976-448 448-448s448 200.977 448 448-200.976 449.01-448 449.01zm181.008-630.016c-12.496-12.496-32.752-12.496-45.248 0L512 466.752l-135.76-135.76c-12.496-12.496-32.752-12.496-45.264 0-12.496 12.496-12.496 32.752 0 45.248L466.736 512l-135.76 135.76c-12.496 12.48-12.496 32.769 0 45.249 12.496 12.496 32.752 12.496 45.264 0L512 557.249l135.76 135.76c12.496 12.496 32.752 12.496 45.248 0 12.496-12.48 12.496-32.769 0-45.249L557.248 512l135.76-135.76c12.512-12.512 12.512-32.768 0-45.248z"></path>
                            </svg>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td>
                          {/* FI Check */}
                          {item?.fiCheck === true ? (
                            <svg
                              stroke="currentColor"
                              style={{ color: 'green' }}
                              fill="currentColor"
                              strokeWidth="0"
                              viewBox="0 0 1024 1024"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512 282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0zm0 961.008c-247.024 0-448-201.984-448-449.01 0-247.024 200.976-448 448-448s448 200.977 448 448-200.976 449.01-448 449.01zm204.336-636.352L415.935 626.944l-135.28-135.28c-12.496-12.496-32.752-12.496-45.264 0-12.496 12.496-12.496 32.752 0 45.248l158.384 158.4c12.496 12.48 32.752 12.48 45.264 0 1.44-1.44 2.673-3.009 3.793-4.64l318.784-320.753c12.48-12.496 12.48-32.752 0-45.263-12.512-12.496-32.768-12.496-45.28 0z"></path>
                            </svg>
                          ) : item?.fiCheck === false ? (
                            <svg stroke="currentColor" style={{ color: 'red' }} fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                              <path d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512 282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0zm0 961.008c-247.024 0-448-201.984-448-449.01 0-247.024 200.976-448 448-448s448 200.977 448 448-200.976 449.01-448 449.01zm181.008-630.016c-12.496-12.496-32.752-12.496-45.248 0L512 466.752l-135.76-135.76c-12.496-12.496-32.752-12.496-45.264 0-12.496 12.496-12.496 32.752 0 45.248L466.736 512l-135.76 135.76c-12.496 12.48-12.496 32.769 0 45.249 12.496 12.496 32.752 12.496 45.264 0L512 557.249l135.76 135.76c12.496 12.496 32.752 12.496 45.248 0 12.496-12.48 12.496-32.769 0-45.249L557.248 512l135.76-135.76c12.512-12.512 12.512-32.768 0-45.248z"></path>
                            </svg>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td>{item?.eligibility === null ? 'N/A' : item?.eligibility ? 'Yes' : 'No'}</td>
                        <td>
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.status ? true : enabledSelect[index] || false} // Check if item.status has a value
                              onChange={() => handleCheckboxChange(index)}
                              className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                          </label>
                        </td>
                        <td>
                          <select
                            name="capitalProvider"
                            className="w-full border border-gray-300 rounded-md p-1 text-xs focus:ring-2 focus:ring-blue-0"
                            required
                            disabled={!item.status && !enabledSelect[index]} // Enable if item.status has a value or if the checkbox is selected
                            value={tempCaptialProviderStatustoShow[index] || item.status || ''} // Use tempCaptialProviderStatus for the specific row, fallback to item.status
                            onChange={(event) => handleUpdateCapitalProviderStatus(event, index, item)} // Pass the index to the handler
                          >
                            <option value="">Select Status</option>
                            {capitalProviderStat?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-3 flex justify-around">
                  <p style={{ fontSize: '12px' }} className="flex items-center gap-1">
                    {' '}
                    <svg stroke="currentColor" style={{ color: 'green' }} fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512 282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0zm0 961.008c-247.024 0-448-201.984-448-449.01 0-247.024 200.976-448 448-448s448 200.977 448 448-200.976 449.01-448 449.01zm204.336-636.352L415.935 626.944l-135.28-135.28c-12.496-12.496-32.752-12.496-45.264 0-12.496 12.496-12.496 32.752 0 45.248l158.384 158.4c12.496 12.48 32.752 12.48 45.264 0 1.44-1.44 2.673-3.009 3.793-4.64l318.784-320.753c12.48-12.496 12.48-32.752 0-45.263-12.512-12.496-32.768-12.496-45.28 0z"></path>
                    </svg>
                    Lead qualifies as per Lender's Policy.
                  </p>
                  <p style={{ fontSize: '12px' }} className="flex items-center gap-1 my-1">
                    {' '}
                    <svg style={{ color: 'red' }} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512 282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0zm0 961.008c-247.024 0-448-201.984-448-449.01 0-247.024 200.976-448 448-448s448 200.977 448 448-200.976 449.01-448 449.01zm181.008-630.016c-12.496-12.496-32.752-12.496-45.248 0L512 466.752l-135.76-135.76c-12.496-12.496-32.752-12.496-45.264 0-12.496 12.496-12.496 32.752 0 45.248L466.736 512l-135.76 135.76c-12.496 12.48-12.496 32.769 0 45.249 12.496 12.496 32.752 12.496 45.264 0L512 557.249l135.76 135.76c12.496 12.496 32.752 12.496 45.248 0 12.496-12.48 12.496-32.769 0-45.249L557.248 512l135.76-135.76c12.512-12.512 12.512-32.768 0-45.248z"></path>
                    </svg>
                    Lead does not qualify as per Lender's Policy.
                  </p>
                  <p className="my-1" style={{ fontSize: '12px' }}>
                    {' '}
                    N/A: Data is not sufficient as per Lender's Policy.
                  </p>
                </div>
              </Modal.Body>
            </Modal>

            {/* Modal component for Capital Provider could be added here if needed */}
          </Container>
        </>
      </div>
    </>
  );
};

export default Index;
