/**
 * ServiceManagementContent.js - Admin Service Management
 *
 * Trang quản lý dịch vụ y tế cho Admin
 */
import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import useSTIServicesAndPackages from '../../hooks/useSTIServicesAndPackages';
import PackageTable from './PackageTable';
import ServiceTable from './ServiceTable';

const priceRanges = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Dưới 500k', value: 'lt500' },
  { label: '500k - 1 triệu', value: '500to1m' },
  { label: 'Trên 1 triệu', value: 'gt1m' },
];

const ServiceManagementContent = () => {
  const { services, packages, loading, error } = useSTIServicesAndPackages();
  const [tab, setTab] = useState(0);
  const [priceFilter, setPriceFilter] = useState('all');

  // Hàm lọc theo giá
  const filterByPrice = (items) => {
    switch (priceFilter) {
      case 'lt500':
        return items.filter((item) => item.price < 500000);
      case '500to1m':
        return items.filter(
          (item) => item.price >= 500000 && item.price <= 1000000
        );
      case 'gt1m':
        return items.filter((item) => item.price > 1000000);
      default:
        return items;
    }
  };

  const filteredPackages = filterByPrice(packages || []);
  const filteredServices = filterByPrice(services || []);

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          mb: 2,
          fontWeight: 700,
          color: '#2D3748',
          display: 'flex',
          alignItems: 'center',
          fontSize: { xs: '1.5rem', md: '2rem' },
        }}
      >
        Quản lý dịch vụ
      </Typography>
      {/* Bộ lọc mức giá */}
      <FormControl sx={{ minWidth: 180, mb: 2 }} size="small">
        <InputLabel id="price-filter-label">Lọc theo giá</InputLabel>
        <Select
          labelId="price-filter-label"
          value={priceFilter}
          label="Lọc theo giá"
          onChange={(e) => setPriceFilter(e.target.value)}
        >
          {priceRanges.map((range) => (
            <MenuItem key={range.value} value={range.value}>
              {range.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Gói dịch vụ" />
        <Tab label="Dịch vụ lẻ" />
      </Tabs>
      <Box hidden={tab !== 0}>
        <PackageTable
          packages={filteredPackages}
          services={services}
          loading={loading}
          error={error}
        />
      </Box>
      <Box hidden={tab !== 1}>
        <ServiceTable
          services={filteredServices}
          loading={loading}
          error={error}
        />
      </Box>
    </Box>
  );
};

export default ServiceManagementContent;
