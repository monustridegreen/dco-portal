export const statuses = [
  {
    value: 'DOCUMENT_UPLOAD_PENDING',
    label: 'Document Upload Pending',
  },
  {
    value: 'DOCUMENT_VERIFICATION_PENDING',
    label: 'Document Verification Pending',
  },
  {
    value: 'DOCUMENT_VERIFICATION_FAILED',
    label: 'Document Verification Failed',
  },
  {
    value: 'ELIGIBILITY_CHECK_PENDING',
    label: 'Eligibility Check Pending',
  },
  {
    value: 'ELIGIBILITY_CHECK_FAILED',
    label: 'Eligibility Check Failed',
  },
  {
    value: 'LOAN_SANCTION_PENDING',
    label: 'Loan Sanction Pending',
  },
  {
    value: 'LOAN_SANCTION_FAILED',
    label: 'Loan Sanction Failed',
  },
  {
    value: 'LOAN_SANCTIONED',
    label: 'Loan Sanctioned',
  },
];

export const statusArray = [
  { value: 'UNKNOWN', label: 'Unknown' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'UNAVAILABLE', label: 'Unavailable' },
  { value: 'IN_USE', label: 'In Use' },
  { value: 'GRID_FAILURE', label: 'Grid Failure' },
  { value: 'DATA_NOT_RECEIVED', label: 'Data Not Received' },
];

export const customerType = [
  { value: 'LARGE_ASSET_OWNER', label: 'LARGE ASSET OWNER' },
  { value: 'SMALL_ASSET_OWNER', label: 'SMALL ASSET OWNER' },
  { value: 'CAPTIVE', label: 'CAPTIVE' },
  { value: 'DCO', label: 'DCO' },
  { value: 'MEDIUM_ASSET_OWNER', label: 'MEDIUM ASSET OWNER' },
];

export const employmentType = [
  { value: 'SALARIED', label: 'Salaried' },
  { value: 'SELF_EMPLOYED', label: 'Self Employed' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'OTHER', label: 'Other' },
];

export const assetOwnerType = [
  { value: 'LARGE_ASSET_OWNER', label: 'Large Asset Owner' },
  { value: 'MEDIUM_ASSET_OWNER', label: 'Medium Asset Owner' },
  { value: 'SMALL_ASSET_OWNER', label: 'Small Asset Owner' },
  { value: 'CAPTIVE', label: 'Captive' },
  { value: 'DCO', label: 'DCO' },
];

export const DocumentStatus = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DEACTIVATE', label: 'Deactivate' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'SUCCESSFUL', label: 'Successful' },
  { value: 'NA', label: 'Not Applicable' },
];

export const finalApplicationStatmus = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'DROPPED', label: 'Dropped' },
  { value: 'DISBURSED', label: 'Disbursed' },
];

export const HouseType = [
  { value: 'RENTED', label: 'Rented' },
  { value: 'OWNED', label: 'Owned' },
];

export const documentCheckStatus = [
  { value: 'SUCCESSFUL', label: 'Successful' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SUBMITTED', label: 'Submitted' },
];

export const genderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

export const timeRangeOptions = [
  { value: 'LAST_7_DAYS', label: 'Last 7 Days' },
  { value: 'LAST_30_DAYS', label: 'Last 30 Days' },
  { value: 'LAST_90_DAYS', label: 'Last 90 Days' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'CUSTOM', label: 'Custom' },
];

export function formatDate(dateString) {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const date = new Date(dateString);
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0'); // Pad day with leading zero if necessary
  const year = date.getFullYear();

  return `${month} ${day} ${year}`;
}

export function convertTimeToIST(gpsTime) {
  const utcDate = new Date(gpsTime);

  // Get year, month, and day separately
  const year = utcDate.getFullYear();
  const month = utcDate.toLocaleString('en-US', { month: 'short' });
  const day = utcDate.getDate();

  // Get hours and minutes with leading zeros if necessary
  const hours = utcDate.getHours();
  const minutes = utcDate.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour = hours % 12 || 12; // Convert 24-hour to 12-hour format
  const minute = minutes < 10 ? '0' + minutes : minutes;

  // Return the formatted date with comma after the day but not after the year
  return `${month} ${day}, ${year} ${hour}:${minute} ${ampm}`;
}

export function formatDateCreatedAt(inputDate) {
  const date = new Date(inputDate);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month} ${day} ${year}`;
}

export const capitalProviderStat = [
  { value: 'PENDING', label: 'In Progress' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];

export const formatDateCreditReport = (dateString) => {
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  const date = new Date(year, month - 1, day);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const formattedDate = `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')} ${year}`;

  return formattedDate;
};

export const Dealerships = {
  GENERATED_BY: { value: 'GENERATED_BY', label: 'generatedBy Value' },
  DEALER_NAME: { value: 'DEALER_NAME', label: 'Dealer Name' },
  D_55: { value: 55, label: 'Kiran Sharma (Internal)' },
  D_76: { value: 76, label: 'Test Case' },
  D_734: { value: 734, label: 'Ansh Maheshwari' },
  D_753: { value: 753, label: 'Surryaanh Organization LLP' },
  D_754: { value: 754, label: 'Techup Consulting Pvt. Ltd.' },
  D_757: { value: 757, label: 'Ecoedge Enterprises Pvt. Ltd.' },
  D_758: { value: 758, label: 'Smart Solution' },
  D_759: { value: 759, label: 'RN Sports' },
  D_775: { value: 775, label: 'Eminent Spares' },
  D_789: { value: 789, label: 'Mehar Mobility' },
  D_799: { value: 799, label: 'Goenka Green Pvt. Ltd.' },
};
