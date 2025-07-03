import { useEffect, useState } from 'react';
import stiService from '../services/stiService';

/**
 * Custom hook: useSTIServicesAndPackages
 * - Fetch danh sách dịch vụ lẻ (STI Services) và gói dịch vụ (STI Packages)
 * - Chuẩn hóa dữ liệu trả về
 * - Trả về: { services, packages, loading, error, reload }
 */
export default function useSTIServicesAndPackages() {
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch services
      const serviceList = await stiService.getAllSTIServices();
      const normalizedServices = (
        Array.isArray(serviceList) ? serviceList : serviceList.data || []
      ).map((s) => ({
        id: s.id,
        name: s.name || s.serviceName,
        description: s.description || '',
        price: s.price || 0,
        isActive:
          s.isActive !== undefined
            ? s.isActive
            : s.active !== undefined
              ? s.active
              : true,
        duration: s.duration,
        ...s,
      }));
      setServices(normalizedServices);

      // Fetch packages
      const packageList = await stiService.getAllSTIPackages();
      const normalizedPackages = (
        Array.isArray(packageList) ? packageList : packageList.data || []
      ).map((p) => ({
        id: p.id || p.packageId,
        name: p.name || p.packageName,
        description: p.description || '',
        price: p.price || 0,
        isActive:
          p.isActive !== undefined
            ? p.isActive
            : p.active !== undefined
              ? p.active
              : true,
        duration: p.duration,
        stiService: p.stiService, // Có thể là mảng id hoặc object
        ...p,
      }));
      setPackages(normalizedPackages);
    } catch (err) {
      setError('Lỗi khi tải dữ liệu dịch vụ: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  return {
    services,
    packages,
    loading,
    error,
    reload: fetchData,
  };
}
