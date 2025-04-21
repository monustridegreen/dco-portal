import { fetchGraphQL, fetchGraphQLAMP } from './graphQlClient';
import {
  getSearchCustomerLeadsForDashboardQuery,
  getAssetOwnerProspectApplicationByIdQuery,
  getPlatformFinanciersQuery,
  fetchAccountQuery,
  getAssetOwnerProspectApplicationCapitalProviderQuery,
} from './query';
import { formatDate } from '../../shared/functions';

export const fetchLeadListData = async ({ currentPage, searchKey, statuses, fromDate, toDate }) => {
  try {
    let variables = {
      page: currentPage,
      size: 10,
    };

    // Add search key if provided
    if (searchKey) variables.searchKey = searchKey;

    // Add statuses if provided and ensure it's an array
    if (statuses) {
      variables.status = statuses;
    }

    // Add date filters if provided
    if (fromDate) variables.startDate = formatDate(fromDate);
    if (toDate) variables.endDate = formatDate(toDate);

    // Fetch data using the GraphQL query
    const { data } = await fetchGraphQL(getSearchCustomerLeadsForDashboardQuery, variables);

    return {
      pageDetails: data?.searchAssetOwnerProspectsApplications?.pageDetails,
      customerLeadData: data?.searchAssetOwnerProspectsApplications?.data,
    };
  } catch (error) {
    console.error('Error fetching lead list data:', error);
    throw error;
  }
};

export const fetchAssetOwnerProspectApplicationById = async (id) => {
  try {
    const variables = { id };

    const { data } = await fetchGraphQL(getAssetOwnerProspectApplicationByIdQuery, variables);

    return data?.getAssetOwnerProspectApplicationById?.data;
  } catch (error) {
    console.error('Error fetching asset owner prospect application by ID:', error);
    throw error;
  }
};

export const fetchPlatformFinanciers = async () => {
  try {
    const variables = {
      page: 0,
      size: 2147483647, // Maximum size to fetch all records
    };

    const { data } = await fetchGraphQLAMP(getPlatformFinanciersQuery, variables);

    return {
      financiers: data?.getAllPlatformFinanciers?.data || [],
      pageDetails: data?.getAllPlatformFinanciers?.pageDetails || {},
    };
  } catch (error) {
    console.error('Error fetching platform financiers:', error);
    throw error;
  }
};

export const fetchAccounts = async ({ roleType = 'DEALER', page = 0, size = 1000 }) => {
  try {
    const variables = {
      roleType,
      page,
      size,
    };

    const { data } = await fetchGraphQLAMP(fetchAccountQuery, variables);

    return {
      accounts: data?.searchUsers?.data || [],
      pageDetails: data?.searchUsers?.pageDetails || {},
    };
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
};

export const fetchAssetOwnerProspectCapitalProviders = async (applicationId) => {
  try {
    const variables = { applicationId };

    const { data } = await fetchGraphQL(getAssetOwnerProspectApplicationCapitalProviderQuery, variables);

    return {
      capitalProviders: data?.getAssetOwnerProspectCapitalProviders?.data || [],
      pageDetails: data?.getAssetOwnerProspectCapitalProviders?.pageDetails || {},
    };
  } catch (error) {
    console.error('Error fetching asset owner prospect capital providers:', error);
    throw error;
  }
};
