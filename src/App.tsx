import React, { useState, useMemo } from 'react';
import {
  Autocomplete,
  Text,
  Group,
  Badge,
  Stack,
  Table,
  Paper,
  Container,
  Title,
  AutocompleteProps,
  rem,
  CloseButton,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconBuildingBank, IconCalendar, IconHash } from '@tabler/icons-react';

interface Bond {
  sierraId: string;
  maturity: string;
  description: string;
  currency: string;
  issuer: string;
  isin: string;
}

const BONDS_DATA: Bond[] = [
  { sierraId: 'S1001', description: 'T-Note 2.5% Dec 25', isin: 'US912828LJ90', issuer: 'US Treasury', maturity: '2025-12-15', currency: 'USD' },
  { sierraId: 'S1002', description: 'Bund 0% Jun 30', isin: 'DE0001102507', issuer: 'Germany Fed Rep', maturity: '2030-06-30', currency: 'EUR' },
  { sierraId: 'S1003', description: 'Gilt 4.25% Sep 27', isin: 'GB00B16NNR78', issuer: 'UK Treasury', maturity: '2027-09-15', currency: 'GBP' },
  { sierraId: 'S1004', description: 'Corp Bond 5% Mar 26', isin: 'US38141GZM88', issuer: 'Goldman Sachs', maturity: '2026-03-20', currency: 'USD' },
  { sierraId: 'S1005', description: 'JGB 0.1% Nov 32', isin: 'JP1103681N14', issuer: 'Japan Finance', maturity: '2032-11-10', currency: 'JPY' },
  { sierraId: 'S1006', description: 'CAD Gov 3% May 28', isin: 'CA135087L518', issuer: 'Gov of Canada', maturity: '2028-05-22', currency: 'CAD' },
  { sierraId: 'S1007', description: 'Apple Inc 3.2% Jan 25', isin: 'US037833CQ12', issuer: 'Apple Inc.', maturity: '2025-01-01', currency: 'USD' },
];

const renderAutocompleteOption: AutocompleteProps['renderOption'] = ({ option }) => {
  const bond = (option as any).bond as Bond;
  return (
    <Group justify="space-between" wrap="nowrap" px="md" py="sm" align="center" style={{ width: '100%' }}>
      <Stack gap={4} style={{ flex: 1 }}>
        <Group gap="xs" align="center" wrap="nowrap">
          <Badge 
            variant="filled" 
            radius="sm" 
            styles={{ 
              root: { 
                backgroundColor: '#228be6', 
                height: rem(20), 
                padding: `0 ${rem(6)}`,
                fontSize: rem(11),
                fontWeight: 800,
                textTransform: 'none'
              } 
            }}
          >
            {bond.sierraId}
          </Badge>
          <Text size="sm" fw={700} c="dark.4" style={{ whiteSpace: 'nowrap' }}>
            {bond.description}
          </Text>
        </Group>
        <Group gap="lg" wrap="nowrap">
          <Group gap={6} wrap="nowrap">
            <IconBuildingBank size={14} color="#adb5bd" stroke={1.5} />
            <Text size="xs" c="gray.6" fw={500}>{bond.issuer}</Text>
          </Group>
          <Group gap={6} wrap="nowrap">
            <IconCalendar size={14} color="#adb5bd" stroke={1.5} />
            <Text size="xs" c="gray.6" fw={500}>{bond.maturity}</Text>
          </Group>
          <Group gap={6} wrap="nowrap">
            <IconHash size={14} color="#adb5bd" stroke={1.5} />
            <Text size="xs" c="gray.6" fw={500}>{bond.isin}</Text>
          </Group>
        </Group>
      </Stack>
      
      <div style={{ 
        border: '1px solid #e9ecef', 
        padding: `${rem(2)} ${rem(8)}`, 
        borderRadius: rem(4),
        backgroundColor: '#f8f9fa'
      }}>
        <Text fw={700} size="xs" c="gray.7" style={{ fontSize: rem(10), letterSpacing: '0.5px' }}>
          {bond.currency}
        </Text>
      </div>
    </Group>
  );
};

export default function App() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedBondId, setSelectedBondId] = useState<string | null>(null);

  // Options shown in the dropdown, filtered by input
  const dropdownOptions = useMemo(() => {
    const query = searchValue.toLowerCase().trim();
    if (!query) return BONDS_DATA;

    return BONDS_DATA.filter((bond) =>
      bond.sierraId.toLowerCase().includes(query) ||
      bond.description.toLowerCase().includes(query) ||
      bond.isin.toLowerCase().includes(query) ||
      bond.issuer.toLowerCase().includes(query) ||
      bond.maturity.toLowerCase().includes(query) ||
      bond.currency.toLowerCase().includes(query)
    );
  }, [searchValue]);

  // Table results: Only show if a specific bond is selected OR show all if nothing selected
  const tableData = useMemo(() => {
    if (selectedBondId) {
      return BONDS_DATA.filter(b => b.sierraId === selectedBondId);
    }
    return BONDS_DATA;
  }, [selectedBondId]);

  const autocompleteData = useMemo(() => dropdownOptions.map((bond) => ({
    value: bond.description,
    label: bond.description,
    bond, 
  })), [dropdownOptions]);

  const handleOptionSubmit = (val: string) => {
    const selected = BONDS_DATA.find(b => b.description === val);
    if (selected) {
      setSelectedBondId(selected.sierraId);
      setSearchValue(selected.description);
    }
  };

  const handleInputChange = (val: string) => {
    setSearchValue(val);
    // Only reset the selection if the input is cleared
    if (val === '') {
      setSelectedBondId(null);
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-50 overflow-auto p-[10px] box-border">
      <Container size="xl" py="xl">
        <Paper shadow="sm" radius="md" p="xl" withBorder bg="white">
          <Stack gap="xl">
            <div>
              <Title order={2} fw={800} c="blue.9" mb={4}>
                Bond Instrument Picker
              </Title>
              <Text size="sm" c="dimmed">
                Search by ID, ISIN, Issuer, Currency, or Maturity (YYYYMMDD)
              </Text>
            </div>

            <Stack gap={4}>
              <Text size="sm" fw={700}>Select Bond</Text>
              <Autocomplete
                placeholder="Type 'US91', 'Goldman', 'USD' or '2025'..."
                leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                rightSection={
                  searchValue ? (
                    <CloseButton
                      size="sm"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setSearchValue('');
                        setSelectedBondId(null);
                      }}
                      aria-label="Clear value"
                    />
                  ) : null
                }
                rightSectionPointerEvents="auto"
                data={autocompleteData}
                value={searchValue}
                onChange={handleInputChange}
                onOptionSubmit={handleOptionSubmit}
                renderOption={renderAutocompleteOption}
                filter={({ options }) => options}
                maxDropdownHeight={400}
                styles={{
                  input: { 
                    height: rem(48),
                    fontSize: rem(16),
                  },
                  dropdown: { 
                    padding: 0,
                    borderRadius: rem(8),
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  },
                  option: { 
                    padding: 0,
                    borderBottom: '1px solid #f1f3f5',
                  },
                  options: {
                    padding: 0
                  }
                }}
              />
            </Stack>

            <Stack gap="md">
              <Group justify="space-between">
                <Title order={4} fw={700}>Available Inventory</Title>
                <Badge variant="light" color="blue" radius="sm" size="lg">
                  {tableData.length} RECORDS
                </Badge>
              </Group>

              <Table.ScrollContainer minWidth={800}>
                <Table 
                  verticalSpacing="md" 
                  horizontalSpacing="lg" 
                  highlightOnHover 
                  withTableBorder={false}
                  styles={{
                    thead: {
                      backgroundColor: '#f8f9fa',
                    },
                    th: {
                      color: '#495057',
                      fontSize: rem(13),
                      fontWeight: 700,
                      borderBottom: '1px solid #dee2e6',
                      paddingTop: rem(16),
                      paddingBottom: rem(16),
                    },
                    td: {
                      paddingTop: rem(16),
                      paddingBottom: rem(16),
                      borderBottom: '1px solid #f1f3f5',
                    }
                  }}
                >
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>SierraId</Table.Th>
                      <Table.Th>Description</Table.Th>
                      <Table.Th>ISIN</Table.Th>
                      <Table.Th>Issuer</Table.Th>
                      <Table.Th>Maturity</Table.Th>
                      <Table.Th>Ccy</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {tableData.map((bond) => (
                      <Table.Tr key={bond.sierraId}>
                        <Table.Td>
                          <Text c="blue.6" fw={700} size="sm">{bond.sierraId}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={700} size="sm" c="gray.9">{bond.description}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c="gray.4" fw={500}>{bond.isin}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c="gray.8" fw={500}>{bond.issuer}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c="gray.4" fw={500}>{bond.maturity}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={800} size="sm" c="gray.9">{bond.currency}</Text>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                    {tableData.length === 0 && (
                      <Table.Tr>
                        <Table.Td colSpan={6}>
                          <Text ta="center" py="xl" c="dimmed">No bonds found matching your search</Text>
                        </Table.Td>
                      </Table.Tr>
                    )}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
}
