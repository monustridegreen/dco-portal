import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import Select from 'react-select';
import { timeRangeOptions } from '../../shared/enum';

const SearchBar = ({ onSearch, handleEndDateChange, handleStartDateChange, timeRange, handleTimeRangeChange }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchValue);
  };

  const handleSelectChange = (selectedOption) => {
    handleTimeRangeChange(selectedOption.value);
  };

  const selectOptions = timeRangeOptions.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  const todayDate = new Date().toISOString().split('T')[0];

  return (
    <InputGroup className="search-bar">
      <Form.Control type="text" placeholder="Search mobile/PAN no" aria-label="Search" value={searchValue} onChange={handleInputChange} />
      <Select
        options={selectOptions}
        value={selectOptions.find((option) => option.value === timeRange)}
        onChange={handleSelectChange}
        className="react-select-container"
        classNamePrefix="react-select"
      />
      {timeRange === 'CUSTOM' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
            <div>
              <span style={{ marginLeft: '10px' }}>From</span>
              <input style={{ marginLeft: '10px', marginRight: '10px' }} type="date" onChange={handleStartDateChange} max={todayDate} />
            </div>
            <div>
              <span style={{ marginRight: '10px' }}>To</span>
              <input type="date" onChange={handleEndDateChange} max={todayDate} />
            </div>
          </div>
        </>
      )}
      <Button variant="primary" onClick={handleSearchClick}>
        Search
      </Button>
    </InputGroup>
  );
};

export default SearchBar;
