/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
'use client';
import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaDownload, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import { getAssetOwnerProspectApplicationByIdQuery, getPlatformFinanciersQuery, getAssetOwnerProspectApplicationCapitalProviderQuery, fetchAccountQuery } from '../services/graphql/query';
import { fetchGraphQL, fetchGraphQLAMP } from '../services/graphql/graphqlClient';
import Header from '../component/header';
import './style.css';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import Upload from '../../../public/img/dashboard/upload.png';
import Download from '../../../public/img/dashboard/download.png';
import html2pdf from 'html2pdf.js';

import CreditReportPreview from './creditReport';

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
} from '../services/enum';

export default function CustomerDetails() {
  const router = useRouter();
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
  const searchParams = useSearchParams();
  const kk = sessionStorage.getItem('leadId');
  const BASE_URL = 'https://odyssey.stridegreen.in/spacedock/';

  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [showSlow, setShowSlow] = useState(false);
  const [fileUrls, setFileUrls] = useState({});
  const [errors, setErrors] = useState({});
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

  const handleSelectCapitalProviderStatus = (event) => {
    setCapitalProviderStatus(event.target.value);
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

  const getPlatformFinancier = async () => {
    try {
      const { data } = await fetchGraphQLAMP(getPlatformFinanciersQuery);
      const transformedData = data?.getAllPlatformFinanciers.data?.map((org) => ({
        value: org.id,
        label: org.name,
      }));
      setPlatformFinancierOptions(transformedData);
    } catch (error) {
      console.error('Error  data:', error);
    }
  };

  useEffect(() => {
    getPlatformFinancier();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowSlow(true);
    }, 1500);
  }, []);

  const toggleDropdown = () => {
    setIsDownloadOpen(!isDownloadOpen);
    setIsUploadOpen(false);
  };
  const toggleUpload = () => {
    setIsUploadOpen(!isUploadOpen);
    setIsDownloadOpen(false);
  };
  function getAccessToken() {
    return localStorage.getItem('access_token');
  }

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

  // const toggleDropdown = () => {
  //   setIsDropdownOpen(!isDropdownOpen);
  // };
  const generatePDF = (reportData) => {
    // Create the content for the report (dynamically created JSX inside a string)
    const reportHTML = `
      <div id="credit-report" class="p-6 bg-gray-50 rounded-lg">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Credit Report Overview</h1>
          <p class="text-gray-500">Report Date: ${formatDateCreditReport(reportData?.header?.reportDate)}</p>
        </div>
  
        <!-- Credit Score -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-lg font-semibold mb-4">Credit Score</h2>
          <div class="flex flex-col items-center">
            <div class="text-4xl font-bold text-blue-600">${reportData.score.bureauScore}</div>
            <div class="text-gray-500">out of 900</div>
          </div>
        </div>
  
        <!-- Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-lg shadow p-4">
            <div class="flex items-center">
              <div class="bg-blue-100 p-3 rounded-full mr-4">
                <div class="w-6 h-6 text-blue-600">📊</div>
              </div>
              <div>
                <p class="text-sm text-gray-500">Total Accounts</p>
                <p class="text-xl font-bold">${reportData.caisAccount.caisSummary.creditAccount.creditAccountTotal}</p>
              </div>
            </div>
          </div>
  
          <div class="bg-white rounded-lg shadow p-4">
            <div class="flex items-center">
              <div class="bg-green-100 p-3 rounded-full mr-4">
                <div class="w-6 h-6 text-green-600">✅</div>
              </div>
              <div>
                <p class="text-sm text-gray-500">Active Accounts</p>
                <p class="text-xl font-bold">${reportData.caisAccount.caisSummary.creditAccount.creditAccountActive}</p>
              </div>
            </div>
          </div>
  
          <div class="bg-white rounded-lg shadow p-4">
            <div class="flex items-center">
              <div class="bg-gray-100 p-3 rounded-full mr-4">
                <div class="w-6 h-6 text-gray-600">🔒</div>
              </div>
              <div>
                <p class="text-sm text-gray-500">Closed Accounts</p>
                <p class="text-xl font-bold">${reportData.caisAccount.caisSummary.creditAccount.creditAccountClosed}</p>
              </div>
            </div>
          </div>
  
          <div class="bg-white rounded-lg shadow p-4">
            <div class="flex items-center">
              <div class="bg-red-100 p-3 rounded-full mr-4">
                <div class="w-6 h-6 text-red-600">💰</div>
              </div>
              <div>
                <p class="text-sm text-gray-500">Outstanding Balance</p>
                <p class="text-xl font-bold">₹${reportData.caisAccount.caisSummary.totalOutstandingBalance.outstandingBalanceUnSecured}</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Applicant's Personal Information -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-lg font-semibold mb-4">Applicant Information</h2>
          <div class="space-y-4">
            <div>
              <p class="font-medium text-gray-700">
                Name: ${reportData.currentApplication.currentApplicationDetails.currentApplicantDetails.firstName} ${
      reportData.currentApplication.currentApplicationDetails.currentApplicantDetails.lastName
    }
              </p>
              <p class="text-gray-500">Mobile: ${reportData.currentApplication.currentApplicationDetails.currentApplicantDetails.mobilePhoneNumber}</p>
            </div>
  
            <div>
              <p class="font-medium text-gray-700">Date of Birth: ${formatDateCreditReport(reportData.caisAccount.caisAccountDetailsList[0].caisHolderDetails.dateOfBirth)}</p>
              <p class="text-gray-500">PAN Number: ${reportData.currentApplication.currentApplicationDetails.currentApplicantDetails.incomeTaxPan}</p>
            </div>
  
            <div>
              <p class="font-medium text-gray-700">Address: ${reportData.caisAccount.caisAccountDetailsList[0].caisHolderAddressDetails.firstLineOfAddressNonNormalized}</p>
              <p class="text-gray-500">${reportData.caisAccount.caisAccountDetailsList[0].caisHolderAddressDetails.secondLineOfAddressNonNormalized}</p>
              <p class="text-gray-500">${reportData.caisAccount.caisAccountDetailsList[0].caisHolderAddressDetails.thirdLineOfAddressNonNormalized}</p>
              <p class="text-gray-500">City: ${reportData.caisAccount.caisAccountDetailsList[0].caisHolderAddressDetails.cityNonNormalized}</p>
              <p class="text-gray-500">State: ${reportData.caisAccount.caisAccountDetailsList[0].caisHolderAddressDetails.stateNonNormalized}</p>
              <p class="text-gray-500">ZIP Code: ${reportData.caisAccount.caisAccountDetailsList[0].caisHolderAddressDetails.zipPostalCodeNonNormalized}</p>
              <p class="text-gray-500">Country: ${reportData.caisAccount.caisAccountDetailsList[0].caisHolderAddressDetails.countryCodeNonNormalized}</p>
            </div>
          </div>
        </div>
  
        <!-- Current Application Details -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-lg font-semibold mb-4">Current Application Details</h2>
          <div class="flex flex-col space-y-4">
            <div>
              <p class="font-medium text-gray-700">Enquiry Reason: ${reportData.currentApplication.currentApplicationDetails.enquiryReason}</p>
              <p class="text-gray-500">Amount Financed: ₹${reportData.currentApplication.currentApplicationDetails.amountFinanced}</p>
              <p class="text-gray-500">Duration of Agreement: ${reportData.currentApplication.currentApplicationDetails.durationOfAgreement} months</p>
            </div>
          </div>
        </div>
  
        <!-- Account Details -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-4">Account Details</h2>
          <div class="overflow-x-auto">
            <table class="w-full min-w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left p-2">Lender</th>
                  <th class="text-right p-2">Credit / Loan Amount </th>
                  <th class="text-right p-2">Open Date </th>
                  <th class="text-right p-2">Last Payment Date </th>
                  <th class="text-right p-2">Rate Of Interest</th>
                  <th class="text-right p-2">Repayment Tenure</th>
                  <th class="text-right p-2">Current Balance</th>
                  <th class="text-right p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.caisAccount.caisAccountDetailsList
                  .map(
                    (account, index) => `
                    <tr key="${index}" class="border-b">
                      <td class="p-2">${account.subscriberName}</td>
                      <td class="p-2 text-right">₹${account.highestCreditOrOriginalLoanAmount}</td>
                      <td class="p-2 text-right">${formatDateCreditReport(account.openDate)}</td>
                      <td class="p-2 text-right">${formatDateCreditReport(account.dateOfLastPayment)}</td>
                      <td class="p-2 text-right">${account.rateOfInterest}</td>
                      <td class="p-2 text-right">${account.repaymentTenure}</td>
                      <td class="p-2 text-right">${account.currentBalance}</td>
                      <td class="p-2 text-right">
                        <span class="inline-block px-2 py-1 rounded-full text-sm ${
                          account.accountStatus === '11' ? 'bg-green-100 text-green-800' : account.accountStatus === '13' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                        }">
                          ${account.accountStatus === '11' ? 'Active' : account.accountStatus === '13' ? 'Closed' : 'Other'}
                        </span>
                      </td>
                    </tr>`,
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Create a temporary div to insert the generated HTML content
    const element = document.createElement('div');
    element.innerHTML = reportHTML;

    // Add Tailwind CSS (external link or inline the styles)
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
    `;
    document.head.appendChild(style);

    // Now generate the PDF using html2pdf
    const options = {
      margin: 0.5,
      filename: 'credit-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }, // Optional: avoid page breaks inside the element
    };

    html2pdf()
      .from(element)
      .set(options)
      .save()
      .then(() => {
        console.log('');
      });
  };

  useEffect(() => {
    if (!isEmpty(reportData)) {
      generatePDF(reportData);
    }
  }, [reportData]);

  const handleCreditReportDownload = async () => {
    const accessToken = getAccessToken();
    const endpoint = `finance/credibility/credit-report/${accountId}/file`;
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

  const handleCreateCapitalProvider = async () => {
    const accessToken = getAccessToken();
    const endpoint = `onboarding/prospect/asset-owner/${accountId}/capital-providers`;
    const url = `${BASE_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(capitalProviders),
      });

      if (response.status == 200) {
        fetchApplicantCapitalProviderData();
        setIsEditing(false);
        handleClose();
      }
    } catch (error) {
      console.error('Error creating capital provider:', error);
    } finally {
      // handleClose();
    }
  };

  const handleUpdateCapitalProvider = async (updatedStatus, itemId, capitalProviderId) => {
    const accessToken = getAccessToken();
    const endpoint = `onboarding/prospect/asset-owner/${accountId}/capital-providers`;
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
        fetchApplicantCapitalProviderData();
        setIsEditing(null);
        setEnabledSelect({});

        evaluateCapitalProvider(accountId);

        toast.success('Capital Provider status updated successfully!', { autoClose: 1500 });
      }
    } catch (error) {
      console.error('Error creating capital provider:', error);
    } finally {
      // handleClose();
    }
  };

  const handleUpdateStatus = async () => {
    if (!validateApplicationStatus()) return;
    const accessToken = getAccessToken();
    const endpoint = `onboarding/prospect/asset-owner/${accountId}`;
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
  useEffect(() => {
    if (kk) setAccountId(kk);
  }, [kk]);
  useEffect(() => {
    if ((accountId, platformFinancierOptions)) fetchApplicantData();
  }, [accountId, platformFinancierOptions]);

  const fetchApplicantData = async () => {
    try {
      const variables = { id: parseInt(accountId) };
      const { data } = await fetchGraphQL(getAssetOwnerProspectApplicationByIdQuery, variables);
      const fetchedData = data.getAssetOwnerProspectApplicationById?.data || {};
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
        setPositives(fetchedData.positiveFactors.join(', ') || '');
        setNegatives(fetchedData.negativeFactors.join(', ') || '');
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

  const fetchApplicantCapitalProviderData = async () => {
    try {
      const variables = { applicationId: parseInt(accountId) };
      const { data } = await fetchGraphQL(getAssetOwnerProspectApplicationCapitalProviderQuery, variables);
      setAssetOwnerProspectApplicationCapitalProviderData(data?.getAssetOwnerProspectCapitalProviders?.data);
    } catch (error) {
      console.error('Error fetching applicant data:', error);
    }
  };

  const fetchAccountData = async () => {
    try {
      const variables = {
        roleType: 'DEALER',
        page: 0,
        size: 1000,
      };
      const { data } = await fetchGraphQLAMP(fetchAccountQuery, variables);
      setUserAccountData(data?.searchUsers?.data);
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  useEffect(() => {
    if (accountId) fetchApplicantCapitalProviderData();
  }, [accountId]);

  const isFinalApplicationApproved = (finalApplicationStatus) => {
    return finalApplicationStatus === 'DISBURSED' || finalApplicationStatus === 'APPROVED';
  };

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

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const handleUpdate = () => {
    handleUpdateStatus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      customerType,
      gender,
      assetCount,
      creditScore,
      cibilScore,
      loanTenure,
      loanDownPayment,
      houseType,
      applicantProfile,

      positives: positives.split(',').map((p) => p.trim()),
      negatives: negatives.split(',').map((n) => n.trim()),
      remarks,
      status,
      creditReportStatus,
      finalApplicationStatus,
      selectedCapitalProvider,
    };
  };

  const handleReason = (e) => {
    setReason(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
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

      case 'loanDownPayment':
        setLoanDownPayment(value);
        break;

      case 'customerType':
        setCustomerType(value);
        break;

      case 'loanTenure':
        setLoanTenure(value);
        break;

      case 'houseType':
        setHouseType(value);
        break;

      case 'gender':
        setGender(value);
        break;

      case 'assetCount':
        setAssetCount(value);
        break;

      case 'creditScore':
        setCreditScore(value);
        break;

      case 'cibilScore':
        setCibilScore(value);
        break;

      case 'applicant_profile':
        setApplicantProfile(value);
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

      case 'documentStatus':
        setDocumentStatus(value);
        break;

      case 'creditReportStatus':
        setCreditReportStatus(value);
        break;

      case 'finalApplicationStatus':
        setFinalApplicationStatus(value);
        if (!(value === 'DISBURSED' || value === 'APPROVED')) {
          setSelectedCapitalProvider('');
        }
        break;
      default:
        break;
    }
  };

  const handleLeadSource = (e) => {
    let lead = e.target.value;
    setLeadsSource(lead);
  };

  useEffect(() => {
    const filtered = downloadOptions?.filter((option) => documentsData?.some((doc) => doc?.documentType === option?.documentType));
    const CoApplicantfiltered = coApplicantDownloadOptions?.filter((option) => coApplicantDocmentsData?.some((doc) => doc?.documentType === option?.documentType));
    let combinedFiltered = [...filtered, ...CoApplicantfiltered];
    {
    }
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
          const endpoint = `onboarding/prospect/asset-owner/${accountId}`;
          const urldd = `${BASE_URL}${endpoint}`;

          payload = {
            prospectApplicationId: accountId,
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
            prospectApplicationId: accountId,
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

  const handleClose = () => {
    setIsOpen(false);
    setIsAdd(false);
    setCapitalProviders([]);
    setIsEditing(false);
    setEnabledSelect({});
  };

  const addCapitalProvider = () => {
    setIsAdd(true);
  };

  const addMoreCapitalProviderWithStatus = () => {
    if (!selectedCapitalProvider || !capitalProviderStatus) {
      return;
    }
    const newCapitalProvider = {
      capitalProviderId: parseInt(selectedCapitalProvider),
      status: capitalProviderStatus,
      note: reason,
    };
    setCapitalProviders([...capitalProviders, newCapitalProvider]);
    setSelectedCapitalProvider('');
    setCapitalProviderStatus('');
    setReason('');
  };

  const getLabelById = (id) => {
    const option = platformFinancierOptions.find((option) => option.value === id);
    return option ? option.label : 'Unknown';
  };
  const handleEditClick = (index) => {
    if (isEditing === index) {
      setIsEditing(null);
      setCapitalProviderStatus('');
      setSelectedCapitalProviderItemId(null);
    } else {
      setIsEditing(index);
      setSelectedCapitalProviderItemId(assetOwnerProspectApplicationCapitalProviderData[index].id);
      setSelectedCapitalProviderId(assetOwnerProspectApplicationCapitalProviderData[index].capitalProvider.id);
    }
  };
  const isEmpty = (value) => {
    // Check if the value is an object
    if (typeof value === 'object' && value !== null) {
      return Object.keys(value).length === 0;
    }
    // Check if the value is an array
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    // For other types of values, return false
    return false;
  };

  const handleChassisNumbers = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const updatedChassisNumbers = value
      .split(',')
      .map((chassis) => chassis.trim())
      .filter((chassis) => chassis !== '');

    setChassisNumbers(updatedChassisNumbers);
  };
  // Add this function to your component

  // Add this function to your component
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

  // Call the function dynamically with the applicantId
  useEffect(() => {
    if (accountId) {
      evaluateCapitalProvider(accountId);
    }
  }, [accountId]);

  // console.log("<<== Evaluted Data=>>", evalutedData);

  return (
    <>
      {downloadLoading && (
        <div className="flex justify-center items-center min-h-screen_cus">
          <div className="spinner"></div>
        </div>
      )}
      <Header />
      <ToastContainer />

      <div className="mx-auto bg-white p-6 rounded-lg shadow-md cus_profile_box">
        <div className="flex items-center mb-6 top_heads">
          <div className="md:container md:mx-auto">
            <div className="flex items-center items-between">
              <div className="flex items-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg stroke="currentColor" fill="url(#grad1)" stroke-width="0" viewBox="0 0 32 32" height="4em" width="4em" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="grad1" x1="0%" x2="0%" y1="100%" y2="0%">
                        <stop offset="0%" stop-color="#278F56"></stop>
                        <stop offset="100%" stop-color="#272C98"></stop>
                      </linearGradient>
                    </defs>
                    <path d="M 16 4 C 12.144531 4 9 7.144531 9 11 C 9 13.378906 10.210938 15.484375 12.03125 16.75 C 7.925781 18.351563 5 22.351563 5 27 L 7 27 C 7 22.601563 10.191406 18.925781 14.375 18.15625 L 15 20 L 17 20 L 17.625 18.15625 C 21.808594 18.925781 25 22.601563 25 27 L 27 27 C 27 22.351563 24.074219 18.351563 19.96875 16.75 C 21.789063 15.484375 23 13.378906 23 11 C 23 7.144531 19.855469 4 16 4 Z M 16 6 C 18.773438 6 21 8.226563 21 11 C 21 13.773438 18.773438 16 16 16 C 13.226563 16 11 13.773438 11 11 C 11 8.226563 13.226563 6 16 6 Z M 15 21 L 14 27 L 18 27 L 17 21 Z"></path>
                  </svg>
                </div>

                <div className="ml-4">
                  <h4>
                    {applicantData?.firstName || ''} {applicantData?.lastName || ''}
                  </h4>
                  <p className="flex items-center">
                    <svg className="mr-1" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                      <g id="Phone">
                        <path d="M14.436,20.938A11.384,11.384,0,0,1,4.572,3.9a1.668,1.668,0,0,1,1.241-.822,1.716,1.716,0,0,1,1.454.492l3.139,3.14a1.715,1.715,0,0,1,0,2.427l-.295.3a1.937,1.937,0,0,0,0,2.736l1.72,1.721a1.983,1.983,0,0,0,2.736,0l.29-.29a1.719,1.719,0,0,1,2.428,0l3.139,3.139a1.724,1.724,0,0,1,.492,1.455,1.669,1.669,0,0,1-.822,1.239A11.327,11.327,0,0,1,14.436,20.938ZM6.042,4.063a.793.793,0,0,0-.1.006.673.673,0,0,0-.5.331A10.375,10.375,0,0,0,19.594,18.567a.674.674,0,0,0,.331-.5.734.734,0,0,0-.208-.618l-3.139-3.139a.717.717,0,0,0-1.014,0l-.29.29a3.006,3.006,0,0,1-4.15,0L9.4,12.876a2.939,2.939,0,0,1,0-4.149l.3-.3a.717.717,0,0,0,0-1.014L6.56,4.277A.729.729,0,0,0,6.042,4.063Z"></path>
                      </g>
                    </svg>
                    {applicantData?.phone || '+91 9876543210'}
                  </p>
                  <p className="flex items-center">
                    <svg className="mr-1" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                      <g id="Credit_Card_2">
                        <g>
                          <path d="M19.437,18.859H4.563a2.5,2.5,0,0,1-2.5-2.5V7.641a2.5,2.5,0,0,1,2.5-2.5H19.437a2.5,2.5,0,0,1,2.5,2.5v8.718A2.5,2.5,0,0,1,19.437,18.859ZM4.563,6.141a1.5,1.5,0,0,0-1.5,1.5v8.718a1.5,1.5,0,0,0,1.5,1.5H19.437a1.5,1.5,0,0,0,1.5-1.5V7.641a1.5,1.5,0,0,0-1.5-1.5Z"></path>
                          <path d="M8.063,14.247h-3a.5.5,0,1,1,0-1h3a.5.5,0,1,1,0,1Z"></path>
                          <path d="M18.934,14.249h-6.5a.5.5,0,0,1,0-1h6.5a.5.5,0,0,1,0,1Z"></path>
                          <rect x="16.434" y="7.14" width="2" height="4" rx="0.5" transform="translate(8.293 26.574) rotate(-90)"></rect>
                        </g>
                      </g>
                    </svg>{' '}
                    {applicantData?.pan || ''}
                  </p>
                </div>
              </div>

              <div className="pos-relative ">
                <div className="flex">
                  {' '}
                  {showSlow && (
                    <>
                      {' '}
                      {unfilteredDownloadOptions && unfilteredDownloadOptions.length > 0 ? (
                        <>
                          <button
                            type="button"
                            onClick={toggleUpload}
                            className="flex  gap-1 items-center justify-center px-2 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                            id="menu-button"
                            aria-expanded="true"
                            aria-haspopup="true"
                          >
                            <Image src={Upload} alt="upload" width={40} height={40} />
                          </button>
                        </>
                      ) : null}
                    </>
                  )}
                  {/* Download Menu Button */}
                  <button
                    type="button"
                    onClick={toggleDropdown}
                    className="flex  gap-1 items-center justify-center  px-2 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 "
                    id="menu-button"
                    aria-expanded="true"
                    aria-haspopup="true"
                  >
                    <Image
                      src={Download} // Path relative to the `public` folder
                      alt="upload"
                      width={40} // Set the desired width
                      height={40} // Set the desired height
                    />
                  </button>
                </div>
                {/* Download Dropdown Menu */}

                {isDownloadOpen && (
                  <div className="absolute right-0 z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg" style={{ width: 'max-content' }}>
                    {filteredDownloadOptions.length > 0 ? (
                      filteredDownloadOptions.map((option, index) => (
                        <>
                          <button
                            key={index}
                            onClick={() => option.isEnabled && handleDownloadClick(option.documentType, option.label)}
                            className={`w-full block px-4 py-2 text-gray-700 hover:bg-gray-100 ${option.isEnabled ? '' : 'opacity-50 cursor-not-allowed'}`}
                            disabled={!option.isEnabled} // Disable button if not enabled
                          >
                            {option.label}
                          </button>
                        </>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-700">No Documents to Download</div>
                    )}
                  </div>
                )}

                {/* Upload Items */}
                {unfilteredDownloadOptions?.length > 0 && (
                  <>
                    {isUploadOpen && (
                      <div className="absolute right-0 z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg" style={{ width: 'max-content' }}>
                        {unfilteredDownloadOptions.length > 0 ? (
                          unfilteredDownloadOptions.map((option, index) => (
                            <button
                              key={index}
                              // onClick={() => option.isEnabled && handleDownloadClick(option.documentType)}
                              className={`w-full block px-4 py-0 text-gray-700 hover:bg-gray-100`}
                              disabled={!option.isEnabled}
                            >
                              <input
                                className="hidden" // Hide input
                                id={`file_input_${index}`}
                                type="file"
                                onChange={(event) => handleFileChange(event, option.documentType, option.label)}
                              />
                              {/* Use label to trigger file input */}
                              <label htmlFor={`file_input_${index}`} className="cursor-pointer block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                {option.label}
                              </label>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-700">No upload options available</div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4">
              <div>
                <p className="flex items-center">
                  <svg className="mr-1" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.445 12.688V7.354h-.633A13 13 0 0 0 4.5 8.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23"></path>
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"></path>
                    <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5z"></path>
                  </svg>
                  Date of Birth
                </p>
                <h5>{applicantData?.dob ? formatDate(applicantData?.dob) : ''}</h5>
              </div>

              <div>
                <p className="flex items-center">
                  <svg className="mr-1" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 16.3996 19.1598 20.1355 15.2122 21.4732L14.9859 21.5469L12.082 13.997C13.151 13.95 14.001 13.0544 14.001 12C14.001 10.8954 13.1055 10 12.001 10C10.8964 10 10.001 10.8954 10.001 12C10.001 13.0768 10.8519 13.9548 11.918 13.9983L9.01501 21.5466L8.78975 21.4732C4.84212 20.1355 2.00098 16.3996 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2ZM12.001 4C7.5827 4 4.00098 7.58172 4.00098 12C4.00098 14.9201 5.56547 17.4747 7.90198 18.8715L9.38145 15.023C8.5358 14.2896 8.00098 13.2073 8.00098 12C8.00098 9.79086 9.79184 8 12.001 8C14.2101 8 16.001 9.79086 16.001 12C16.001 13.2075 15.466 14.29 14.62 15.0234C15.1861 16.4969 15.6797 17.7803 16.0998 18.8729C18.4362 17.4751 20.001 14.9203 20.001 12C20.001 7.58172 16.4193 4 12.001 4Z"></path>
                  </svg>
                  Lead Source
                </p>
                <h5>{applicantData?.leadSource || 'Referral'}</h5>
              </div>

              <div>
                <p className="flex items-center">
                  <svg className="mr-1" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1.6em" width="1.6em" xmlns="http://www.w3.org/2000/svg">
                    <g id="Delivery_Truck">
                      <g>
                        <path d="M21.47,11.185l-1.03-1.43a2.5,2.5,0,0,0-2.03-1.05H14.03V6.565a2.5,2.5,0,0,0-2.5-2.5H4.56a2.507,2.507,0,0,0-2.5,2.5v9.94a1.5,1.5,0,0,0,1.5,1.5H4.78a2.242,2.242,0,0,0,4.44,0h5.56a2.242,2.242,0,0,0,4.44,0h1.22a1.5,1.5,0,0,0,1.5-1.5v-3.87A2.508,2.508,0,0,0,21.47,11.185ZM7,18.935a1.25,1.25,0,1,1,1.25-1.25A1.25,1.25,0,0,1,7,18.935Zm6.03-1.93H9.15a2.257,2.257,0,0,0-4.3,0H3.56a.5.5,0,0,1-.5-.5V6.565a1.5,1.5,0,0,1,1.5-1.5h6.97a1.5,1.5,0,0,1,1.5,1.5ZM17,18.935a1.25,1.25,0,1,1,1.25-1.25A1.25,1.25,0,0,1,17,18.935Zm3.94-2.43a.5.5,0,0,1-.5.5H19.15a2.257,2.257,0,0,0-4.3,0h-.82v-7.3h4.38a1.516,1.516,0,0,1,1.22.63l1.03,1.43a1.527,1.527,0,0,1,.28.87Z"></path>
                        <path d="M18.029,12.205h-2a.5.5,0,0,1,0-1h2a.5.5,0,0,1,0,1Z"></path>
                      </g>
                    </g>
                  </svg>
                  Vehicle
                </p>
                <h5>
                  {applicantData?.assetOem || ''} {applicantData?.assetModel || ''}
                </h5>
              </div>
              <div>
                <p className="flex items-center">
                  <svg className="mr-1" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M114.34,154.34l96-96a8,8,0,0,1,11.32,11.32l-96,96a8,8,0,0,1-11.32-11.32ZM128,88a63.9,63.9,0,0,1,20.44,3.33,8,8,0,1,0,5.11-15.16A80,80,0,0,0,48.49,160.88,8,8,0,0,0,56.43,168c.29,0,.59,0,.89-.05a8,8,0,0,0,7.07-8.83A64.92,64.92,0,0,1,64,152,64.07,64.07,0,0,1,128,88Zm99.74,13a8,8,0,0,0-14.24,7.3,96.27,96.27,0,0,1,5,75.71l-181.1-.07A96.24,96.24,0,0,1,128,56h.88a95,95,0,0,1,42.82,10.5A8,8,0,1,0,179,52.27a112,112,0,0,0-156.66,137A16.07,16.07,0,0,0,37.46,200H218.53a16,16,0,0,0,15.11-10.71,112.35,112.35,0,0,0-5.9-88.3Z"></path>
                  </svg>
                  Credit Score
                </p>
                <h5>{applicantData?.creditScore || ''}</h5>
              </div>
            </div>
          </div>
        </div>
        <div className="md:container md:mx-auto">
          <hr className="border-t-2 border-black mb-6" />
        </div>

        <div className="md:container md:mx-auto">
          <div className="mb-4 cust_details">
            {/* Customer Details */}

            <div className="flex items-center mb-2">
              <span className="font-bold text-lg">Customer Details</span>
              {roleType !== 'DEALER' && (
                <button className="button1 flex items-center" onClick={toggleEdit}>
                  Edit <FaEdit className="ml-2 cursor-pointer" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-3 gap-4 p-1 items-center">
                <div className="flex flex-col">
                  <label className="font-bold">Customer Type</label>
                  <select name="customerType" value={customerType} onChange={handleChange} className="border border-gray-300 rounded p-2" disabled={!isEditable} required>
                    <option value="">Select Customer Type</option>
                    {assetOwnerType.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="font-bold">Gender</label>
                  <select name="gender" value={gender} onChange={handleChange} className="border border-gray-300 rounded p-2" disabled={!isEditable} required>
                    <option value="">Select Gender</option>
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="font-bold">No. of Assets</label>
                  <input name="assetCount" min="0" disabled={!isEditable} type="number" value={assetCount} onChange={handleChange} className="border border-gray-300 rounded p-2" required />
                </div>

                {/* <div className="flex flex-col">
              <label className="font-bold">Lead Source</label>
              <input name="leadsSource" disabled={!isEditable} type="text" value={leadsSource} onChange={handleLeadSource} className="border border-gray-300 rounded p-2" required />
            </div> */}

                <div className="flex flex-col">
                  <label className="font-bold">Positives</label>
                  <textarea name="positives" disabled={!isEditable} value={positives} onChange={handleChange} className="border border-gray-300 rounded p-2" />
                </div>

                <div className="flex flex-col">
                  <label className="font-bold">Negatives</label>
                  <textarea name="negatives" disabled={!isEditable} value={negatives} onChange={handleChange} className="border border-gray-300 rounded p-2" />
                </div>

                <div className="flex flex-col">
                  <label className="font-bold">Remarks</label>
                  <textarea name="remarks" disabled={!isEditable} value={remarks} onChange={handleChange} className="border border-gray-300 rounded p-2" />
                </div>

                <div className="flex flex-col">
                  <label className="font-bold">Credit Score</label>
                  <input
                    name="creditScore"
                    disabled={!isEditable}
                    type="number"
                    value={creditScore}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2"
                    required
                    maxLength={3} // Restricts to 3 characters
                    onInput={(e) => {
                      // Limit input to 3 digits
                      if (e.target.value.length > 3) {
                        e.target.value = e.target.value.slice(0, 3);
                      }
                    }}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-bold">CIBIL Score</label>
                  <input
                    name="cibilScore"
                    disabled={!isEditable}
                    type="number"
                    value={cibilScore}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2"
                    required
                    maxLength={3} // Restricts to 3 characters
                    onInput={(e) => {
                      // Limit input to 3 digits
                      if (e.target.value.length > 3) {
                        e.target.value = e.target.value.slice(0, 3);
                      }
                    }}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-bold">Applicant Profile</label>
                  <textarea
                    name="applicant_profile"
                    disabled={!isEditable}
                    rows={1}
                    type="text"
                    value={applicantProfile}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2"
                    required
                  >
                    {' '}
                  </textarea>
                </div>

                <div className="flex flex-col">
                  <label className="font-bold">Loan Tenure</label>
                  <input name="loanTenure" disabled={!isEditable} type="text" value={loanTenure} onChange={handleChange} className="border border-gray-300 rounded p-2" required />
                </div>

                <div className="flex flex-col">
                  <label className="font-bold">Loan Down Payment</label>
                  <input name="loanDownPayment" disabled={!isEditable} type="text" value={loanDownPayment} onChange={handleChange} className="border border-gray-300 rounded p-2" required />
                </div>

                <div className="flex flex-col">
                  <label className="font-bold">House Type</label>
                  <select name="houseType" value={houseType} onChange={handleChange} className="border border-gray-300 rounded p-2" disabled={!isEditable} required>
                    <option value="">Select House Type</option>
                    {HouseType.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="font-bold">Document Check Status</label>
                  <select name="documentStatus" value={documentStatus} onChange={handleChange} className="border border-gray-300 rounded p-2" disabled={!isEditable} required>
                    <option value="">Select Status</option>
                    {documentCheckStatus.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="font-bold">Credit & Other Report Status</label>
                  <select name="creditReportStatus" value={creditReportStatus} onChange={handleChange} className="border border-gray-300 rounded p-2" disabled={!isEditable} required>
                    <option value="">Select Status</option>
                    {documentCheckStatus.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="font-bold">Final Application Status</label>
                  <select name="finalApplicationStatus" value={finalApplicationStatus} onChange={handleChange} className="border border-gray-300 rounded p-2" disabled={!isEditable} required>
                    <option value="">Select Status</option>
                    {finalApplicationStatmus?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.CapitalProviderSelected && (
                    <span style={{ zIndex: 1 }} className="error">
                      {errors.CapitalProviderSelected}
                    </span>
                  )}
                </div>
                {finalApplicationStatus === 'DISBURSED' && (
                  <>
                    <div className="flex flex-col">
                      <label className="font-bold ">Chassis Numbers (Separate by commas)*</label>
                      <input
                        name="chassisNumbers"
                        disabled={!isEditable}
                        value={inputValue}
                        onChange={handleChassisNumbers}
                        className="border border-gray-300 rounded p-2"
                        placeholder="Enter chassis numbers (e.g., ABC123, XYZ456, LMN789)"
                      />
                      {errors.inputValue && <p className="text-red-500 text-sm">{errors.inputValue}</p>}
                    </div>

                    <div className="flex flex-col">
                      <label className="font-bold ">Disbursed Date*</label>
                      <input
                        type="date"
                        name="disbursedDate"
                        disabled={!isEditable}
                        value={disbursedDate}
                        onChange={(e) => setDisbursedDate(e.target.value)}
                        className="border border-gray-300 rounded p-2"
                      />
                      {errors.DisbursedDate && <p className="text-red-500 text-sm">{errors.DisbursedDate}</p>}
                    </div>
                  </>
                )}
                {/* Capital Provider */}
                <div className="flex flex-col relative">
                  <label className="font-bold">Capital Provider{isFinalApplicationApproved(finalApplicationStatus) ? '*' : ''}</label>
                  <span className="border border-gray-300 rounded p-2" style={{ cursor: 'pointer' }} onClick={() => setIsOpen(true)}>
                    {assetOwnerProspectApplicationCapitalProviderData.length > 0 ? 'See Capital Providers' : 'Select Capital Provider'}
                  </span>
                  {isOpen && (
                    <div className="fixed inset-0 z-10  cus_modal">
                      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
                        <div className="model_dialog1 inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left  shadow-xl transform">
                          <div className="">
                            <div className="flex items-center justify-between b_b_1 mb-3">
                              <h3 className="text-xl leading-5 font-medium text-gray-900  ">Capital Provider</h3>
                            </div>
                            <div className="close_icon">
                              <svg onClick={handleClose} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
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
                                        <svg
                                          stroke="currentColor"
                                          style={{ color: 'red' }}
                                          fill="currentColor"
                                          strokeWidth="0"
                                          viewBox="0 0 1024 1024"
                                          height="1em"
                                          width="1em"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
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
                                <svg
                                  stroke="currentColor"
                                  style={{ color: 'green' }}
                                  fill="currentColor"
                                  strokeWidth="0"
                                  viewBox="0 0 1024 1024"
                                  height="1.2em"
                                  width="1.2em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512 282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0zm0 961.008c-247.024 0-448-201.984-448-449.01 0-247.024 200.976-448 448-448s448 200.977 448 448-200.976 449.01-448 449.01zm204.336-636.352L415.935 626.944l-135.28-135.28c-12.496-12.496-32.752-12.496-45.264 0-12.496 12.496-12.496 32.752 0 45.248l158.384 158.4c12.496 12.48 32.752 12.48 45.264 0 1.44-1.44 2.673-3.009 3.793-4.64l318.784-320.753c12.48-12.496 12.48-32.752 0-45.263-12.512-12.496-32.768-12.496-45.28 0z"></path>
                                </svg>
                                Lead qualifies as per Lender's Policy.
                              </p>
                              <p style={{ fontSize: '12px' }} className="flex items-center gap-1 my-1">
                                {' '}
                                <svg
                                  style={{ color: 'red' }}
                                  stroke="currentColor"
                                  fill="currentColor"
                                  strokeWidth="0"
                                  viewBox="0 0 1024 1024"
                                  height="1.2em"
                                  width="1.2em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512 282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0zm0 961.008c-247.024 0-448-201.984-448-449.01 0-247.024 200.976-448 448-448s448 200.977 448 448-200.976 449.01-448 449.01zm181.008-630.016c-12.496-12.496-32.752-12.496-45.248 0L512 466.752l-135.76-135.76c-12.496-12.496-32.752-12.496-45.264 0-12.496 12.496-12.496 32.752 0 45.248L466.736 512l-135.76 135.76c-12.496 12.48-12.496 32.769 0 45.249 12.496 12.496 32.752 12.496 45.264 0L512 557.249l135.76 135.76c12.496 12.496 32.752 12.496 45.248 0 12.496-12.48 12.496-32.769 0-45.249L557.248 512l135.76-135.76c12.512-12.512 12.512-32.768 0-45.248z"></path>
                                </svg>
                                Lead does not qualify as per Lender's Policy.
                              </p>
                              <p className="my-1" style={{ fontSize: '12px' }}>
                                {' '}
                                N/A: Data is not sufficient as per Lender's Policy.
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 sm:flex sm:flex-row-reverse">
                            {capitalProviders?.length > 0 && (
                              <>
                                {isAdd && (
                                  <button
                                    onClick={handleCreateCapitalProvider}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pri text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto"
                                  >
                                    Submit
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Co-Applicant Details
               */}
              <div className="mt-3 mb-2 mt-6" style={{ font: 'bold', fontWeight: '700' }}>
                <h1>Co-Applicant Details</h1>
                <hr />
              </div>
              <div className="grid grid-cols-3 gap-4 p-1 items-center">
                <div className="flex flex-col">
                  <label className="font-bold">Co-Applicant First Name</label>
                  <input name="coFirstName" disabled={!isEditable} type="text" value={coFirstName} onChange={handleChange} className="border border-gray-300 rounded p-2" required />
                </div>

                <div className="flex flex-col">
                  <label className="font-bold">Co-Applicant Last Name</label>
                  <input name="coLastName" disabled={!isEditable} type="text" value={coLastName} onChange={handleChange} className="border border-gray-300 rounded p-2" required />
                </div>

                <div className="flex flex-col">
                  <label className="font-bold">Co-Applicant Phone Number</label>
                  <input name="coPhoneNo" disabled={!isEditable} type="text" value={coPhoneNo} onChange={handleChange} className="border border-gray-300 rounded p-2" required />
                </div>

                <div className="flex flex-col">
                  <label className="font-bold">Co-Applicant PAN No</label>
                  <input name="coPanNo" disabled={!isEditable} type="text" value={coPanNo} onChange={handleChange} className="border border-gray-300 rounded p-2" required />
                </div>
              </div>

              {/* Dealership Details */}

              <div className="mt-3 mb-2 mt-6" style={{ font: 'bold', fontWeight: '700' }}>
                <h1>Dealership Details</h1>
                <hr />
              </div>
              <div className="grid grid-cols-3 gap-4 p-1 items-center">
                {isOrganicLead ? (
                  <>
                    <div className="flex flex-col">
                      <label className="font-bold">Select Dealer</label>
                      <select
                        name="user"
                        value={selectedDealerUserId}
                        onChange={(e) => setSelectedDealerUserId(e.target.value)}
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
                      </select>
                    </div>{' '}
                  </>
                ) : (
                  <>
                    <div className="flex flex-col">
                      <label className="font-bold">Dealer Name</label>
                      <input
                        name="dealerName"
                        type="text"
                        disabled
                        value={generatedBy?.generatedByFirstName + ' ' + generatedBy?.generatedByLastName}
                        className="border border-gray-300 rounded p-2"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-bold">Dealer Phone No.</label>
                      <input name="dealerPhoneNo" type="text" disabled value={generatedBy?.generatedByPhoneNo} className="border border-gray-300 rounded p-2" required />
                    </div>
                  </>
                )}
              </div>
            </form>

            {isEditable && (
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleUpdate}>
                Save
              </button>
            )}

            {/* Co -Applicant Details */}
          </div>
        </div>
      </div>

      {/* Conditional rendering of the report */}
      {/* {!isEmpty(reportData) && (
        <div id="credit-report">
          <CreditReportPreview reportData={reportData} />
        </div>
      )} */}
    </>
  );
}
