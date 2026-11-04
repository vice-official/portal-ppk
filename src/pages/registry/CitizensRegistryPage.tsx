import type { FC } from 'react';
import { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCitizens } from '../../features/registry/model/useCitizens';
import { RegistryFilters } from '../../features/registry/ui/RegistryFilters';
import { RegistryTable } from '../../features/registry/ui/RegistryTable';
import { useDebounce } from '../../shared/lib/useDebounce';
import type { CitizenStatus } from '../../entities/citizen/types';

const VALID_STATUSES: CitizenStatus[] = [
  'active',
  'beneficiary',
  'pensioner',
  'underReview',
  'archived',
];

export const CitizensRegistryPage: FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Статус фильтра берём непосредственно из URL
  const urlStatus = searchParams.get('status');

  const status: CitizenStatus | 'all' =
    urlStatus && VALID_STATUSES.includes(urlStatus as CitizenStatus)
      ? (urlStatus as CitizenStatus)
      : 'all';

  // Храним страницу вместе со статусом, для которого она была выбрана.
  // При переходе по истории браузера на другой статус страница автоматически станет первой.
  const [pagination, setPagination] = useState({
    status,
    page: 1,
  });

  const page = pagination.status === status ? pagination.page : 1;

  const setPage = (newPage: number) => {
    setPagination({ status, page: newPage });
  };

  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female' | 'all'>('all');
  const [sortBy, setSortBy] = useState<'surname' | 'dateOfBirth'>('surname');
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending');

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useCitizens({
    page,
    pageSize,
    search: debouncedSearch || undefined,
    status,
    gender,
    sortBy,
    sortOrder,
  });

  const handleStatusChange = (newStatus: CitizenStatus | 'all') => {
    setPage(1);

    if (newStatus !== 'all') {
      setSearchParams({ status: newStatus });
    } else {
      setSearchParams({});
    }
  };

  const handleSortChange = (field: 'surname' | 'dateOfBirth') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending');
    } else {
      setSortBy(field);
      setSortOrder('ascending');
    }

    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setGender('all');
    setSortBy('surname');
    setSortOrder('ascending');
    setPage(1);
    setSearchParams({});
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          Картотека граждан
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Централизованный учёт и фильтрация профилей граждан
        </Typography>
      </Box>

      <RegistryFilters
        search={search}
        status={status}
        gender={gender}
        filteredCount={data?.filteredCount ?? 0}
        totalCount={data?.totalCount ?? 0}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        onStatusChange={handleStatusChange}
        onGenderChange={(val) => {
          setGender(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      <RegistryTable
        citizens={data?.items ?? []}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        totalFilteredCount={data?.filteredCount ?? 0}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        onSortChange={handleSortChange}
        onSelectCitizen={(id) => navigate(`/registry/${id}`)}
      />
    </Container>
  );
};
