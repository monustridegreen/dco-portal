export const getSearchCustomerLeadsForDashboardQuery = `
  query searchAssetOwnerProspectsApplications($searchKey: String, $page: Int!, $size: Int!, $status: String, $startDate: Date, $endDate: Date) {
    searchAssetOwnerProspectsApplications(searchKey: $searchKey, page: $page, size: $size, status: $status, startDate: $startDate, endDate: $endDate )  {
      data {
        id
        createdAt
        capitalProvider
        firstName
        lastName
        email
        phone
        address
        pinCode
        pan
        dob
        userId
        assetType
        assetCount
        generatedBy
        gender
        leadSource
        maritalStatus
        customerType
        noOfDependents
        assetOem
        assetModel
        status
        positiveFactors
        negativeFactors
        remarks
        creditCheckStatus
        documentStatus
        creditScore
        creditBureau
        documents {
          documentType
          documentUrl
          status
        }
          coApplicants{
          id
          firstName
          lastName
          pan
          phone
            documents {
          documentType
          documentUrl
          status
        }
          }
      }
      pageDetails {
        totalItems
        currentPage
        pageSize
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const getAssetOwnerProspectApplicationByIdQuery = `
  query getAssetOwnerProspectApplicationById($id: Long) {
  getAssetOwnerProspectApplicationById(id: $id) {
   data {
    id
    cibilScore
    userId
    isOrganic    
    generatedBy
    generatedByFirstName
    generatedByLastName
    generatedByPhoneNo
    firstName
    lastName
    phone  
    pan
    dob
    assetOem
    assetModel
    leadSource
    creditScore
    applicantProfile
    loanDownPayment
    loanTenure
    houseType
    customerType
    gender
    assetCount
    positiveFactors
    negativeFactors
    remarks
    documentStatus
    creditCheckStatus
    status
    capitalProvider
    chassisNumbers
    disbursedOn
    generatedBy
    documents {
      documentType
      documentUrl
      status
      }

       coApplicants{
       id
          firstName
          lastName
          pan
          phone
          documents {
          documentType
          documentUrl
          status
        }

          }
   }
  }
  }

`;
export const getPlatformFinanciersQuery = `
      query getAllPlatformFinanciers {
            getAllPlatformFinanciers( page:0, size:2147483647){
              data {
                id
                name
                }
                        pageDetails{
                totalItems
                currentPage
                pageSize
                totalPages
                hasNextPage
                hasPreviousPage
              }
                
              }
            }       
            
`;

export const fetchAccountQuery = `
query searchUsers($roleSubType: String,$roleType: String,$organizationId: Int, $page: Int, $size: Int) {
  searchUsers(roleSubType: $roleSubType, roleType: $roleType, organizationId: $organizationId, page: $page, size: $size) {
    data {
      userId
      name
      roleType
      organisationName
      roleSubType
      email
      phoneNumber
      firstName
      lastName
    }
    pageDetails {
      totalItems
      currentPage
      pageSize
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
}


`;
export const getAssetOwnerProspectApplicationCapitalProviderQuery = `
  query getAssetOwnerProspectCapitalProviders($applicationId: Long) {
  getAssetOwnerProspectCapitalProviders(applicationId: $applicationId) {
    data {
      id
      createdAt
      updatedAt
      status
      note
      capitalProvider {
        id
        name
      }
    }
    pageDetails {
      totalItems
      currentPage
      pageSize
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
}
`;
