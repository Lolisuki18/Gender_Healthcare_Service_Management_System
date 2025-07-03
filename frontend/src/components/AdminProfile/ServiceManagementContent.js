/**
 * ServiceManagementContent.js - Admin Service Management
 *
 * Trang quản lý dịch vụ y tế cho Admin
 */
import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import useSTIServicesAndPackages from '../../hooks/useSTIServicesAndPackages';
import PackageTable from './PackageTable';
import ServiceTable from './ServiceTable';

const ServiceManagementContent = () => {
  const { services, packages, loading, error } = useSTIServicesAndPackages();
  const [tab, setTab] = useState(0);

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
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Gói dịch vụ" />
        <Tab label="Dịch vụ lẻ" />
      </Tabs>
      <Box hidden={tab !== 0}>
        <PackageTable
          packages={packages}
          services={services}
          loading={loading}
          error={error}
        />
      </Box>
      <Box hidden={tab !== 1}>
        <ServiceTable services={services} loading={loading} error={error} />
      </Box>
    </Box>
  );
};

export default ServiceManagementContent;
