/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faSpinner, faCheck, faBan, faClock, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

import LeadSummaryCard from '../../components/dashboard/LeadSummaryCard';
import LeadFunnelChart from '../../components/dashboard/LeadFunnelChart';
import LeadTable from '../../components/dashboard/LeadTable';
import SearchBar from '../../components/dashboard/SearchBar';
import GenerateLeadButton from '../../components/dashboard/GenerateLeadButton';
import GenerateLeadModal from '../../components/dashboard/GenerateLeadModal';
import api from '../../utils/restApi/apis/api';
import { fetchLeadListData } from '../../utils/graphQL/graphQlAPI';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('LAST_30_DAYS');

  const [showModal, setShowModal] = useState(false);

  // time range

  const today = new Date();
  const tillEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
  const startFrom = new Date();
  startFrom.setDate(today.getDate() - 30);
  startFrom.setHours(0, 0, 0, 0);
  const [fromDate, setFromDate] = useState(startFrom);
  const [toDate, setToDate] = useState(tillEnd);

  const [dashBoradData, setDashBoardData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [leadListData, setLeadListData] = useState([]);
  const [pageDetails, setPageDetails] = useState({
    currentPage: 0,
    totalPages: 1,
    totalItems: 0,
  });
  const [searchKey, setSearchKey] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('access_token');

  const handleTimeRangeChange = (event) => {
    const selectedValue = event;
    setTimeRange(selectedValue);

    if (selectedValue !== 'CUSTOM') {
      const { startDate, endDate } = timeRangePeriod(selectedValue);
      setFromDate(startDate);
      setToDate(endDate);
    } else {
      setFromDate('');
      setToDate('');
    }
  };

  const timeRangePeriod = (period) => {
    const endDate = new Date();
    switch (period) {
      case 'LAST_30_DAYS': {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        return { startDate, endDate };
      }

      case 'LAST_7_DAYS': {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        return { startDate, endDate };
      }

      case 'LAST_90_DAYS': {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 90);
        return { startDate, endDate };
      }

      case 'this_month': {
        const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        return { startDate, endDate };
      }

      case 'last_month': {
        const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
        const lastDayOfLastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        return { startDate, endDate: lastDayOfLastMonth };
      }

      default:
        return { startDate: null, endDate: null };
    }
  };
  const getData = async () => {
    try {
      setIsLoading(true);
      const data = await api.fetchDashboardData(fromDate, toDate);
      setDashBoardData(data?.data);
      setChartData(data);
    } catch (error) {
      console.error('Dashboard API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLeadListData = async (page = 0, searchValue = searchKey) => {
    try {
      setIsLoading(true);
      const data = await fetchLeadListData({
        currentPage: page,
        searchKey: searchValue,
        statuses: null,
        fromDate,
        toDate,
      });
      setLeadListData(data.customerLeadData || []);
      setPageDetails(data.pageDetails || { currentPage: 0, totalPages: 1, totalItems: 0 });
    } catch (error) {
      console.error('Error fetching lead list data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
    getLeadListData(currentPage);
  }, [currentPage]);

  const handleSearch = (searchValue) => {
    setSearchKey(searchValue);
    setCurrentPage(0);
    getLeadListData(0, searchValue);
    getData();
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading && !dashBoradData)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  const summaryData = dashBoradData
    ? [
        {
          title: 'Total Leads',
          count: dashBoradData?.totalLeads ?? 0,
          icon: <FontAwesomeIcon icon={faUsers} />,
          percentage: dashBoradData?.totalLeads ? 100 : 0,
        },
        {
          title: 'In Progress',
          count: dashBoradData?.inProgressLeads ?? 0,
          icon: <FontAwesomeIcon icon={faSpinner} />,
          percentage: dashBoradData?.totalLeads ? ((dashBoradData?.inProgressLeads / dashBoradData?.totalLeads) * 100).toFixed(2) : 0,
        },
        {
          title: 'Approved Leads',
          count: dashBoradData?.convertedLeads ?? 0,
          icon: <FontAwesomeIcon icon={faCheck} />,
          percentage: dashBoradData?.totalLeads ? ((dashBoradData?.convertedLeads / dashBoradData?.totalLeads) * 100).toFixed(2) : 0,
        },
        {
          title: 'Rejected Leads',
          count: dashBoradData?.rejectedLeads ?? 0,
          icon: <FontAwesomeIcon icon={faBan} />,
          percentage: dashBoradData?.totalLeads ? ((dashBoradData?.rejectedLeads / dashBoradData?.totalLeads) * 100).toFixed(2) : 0,
        },
        {
          title: 'Pending Leads',
          count: dashBoradData?.pendingLeads ?? 0,
          icon: <FontAwesomeIcon icon={faClock} />,
          percentage: dashBoradData?.totalLeads ? ((dashBoradData?.pendingLeads / dashBoradData?.totalLeads) * 100).toFixed(2) : 0,
        },
        {
          title: 'Disbursed Leads',
          count: dashBoradData?.disburseLeads ?? 0,
          icon: <FontAwesomeIcon icon={faMoneyBillWave} />,
          percentage: dashBoradData?.totalLeads ? ((dashBoradData?.disburseLeads / dashBoradData?.totalLeads) * 100).toFixed(2) : 0,
        },
      ]
    : [];

  const handleEndDateChange = (e) => {
    setToDate(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setFromDate(e.target.value);
  };

  return (
    <Container fluid className="dashboard-container">
      <Row className="dashboard-header my-3">
        <Col md={8}>
          <SearchBar
            handleEndDateChange={handleEndDateChange}
            handleStartDateChange={handleStartDateChange}
            onSearch={handleSearch}
            timeRange={timeRange}
            handleTimeRangeChange={handleTimeRangeChange}
          />
        </Col>
        <Col md={4} className="d-flex justify-content-end">
          <GenerateLeadButton onClick={() => setShowModal(true)} />
        </Col>
      </Row>
      <Row className="summary-cards">
        <Col md={8}>
          <Row>
            {summaryData?.map((item, index) => (
              <Col key={index} md={4} className="mb-3">
                <LeadSummaryCard title={item.title} count={item.count} icon={item.icon} percentage={item.percentage} />
              </Col>
            ))}
          </Row>
        </Col>
        <Col md={4}>
          <LeadFunnelChart data={summaryData} />
        </Col>
      </Row>
      <Row className="my-4">
        <Col>
          <LeadTable data={leadListData} pageDetails={pageDetails} onPageChange={handlePageChange} />
        </Col>
      </Row>
      <GenerateLeadModal show={showModal} onClose={() => setShowModal(false)} />
    </Container>
  );
};

export default Dashboard;
