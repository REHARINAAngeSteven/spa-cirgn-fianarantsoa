import { useState, useMemo } from 'react';

// Type pour les options de filtre individuelles
export interface FilterItem {
  label: string;
  value: string | number;
}

// Type pour chaque filtre complet
export interface FilterOption {
  label: string;         // Nom affiché du filtre (ex: "Grade")
  value: string;         // Clé du champ correspondant (ex: "grade")
  options: FilterItem[]; // Liste des options possibles
}

// Config du hook
export interface UseTableFiltersConfig<T> {
  data: T[];
  searchFields: (keyof T)[];
  filterConfig?: {
    [key: string]: (item: T, value: string) => boolean;
  };
}

// Hook
export function useTableFilters<T>({
  data,
  searchFields,
  filterConfig = {},
}: UseTableFiltersConfig<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Filtrer les données
  const filteredData = useMemo(() => {
    let result = [...data];

    // Appliquer la recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(query);
        })
      );
    }

    // Appliquer les filtres personnalisés
    Object.entries(filters).forEach(([key, value]) => {
      if (value && filterConfig[key]) {
        result = result.filter((item) => filterConfig[key](item, value));
      }
    });

    return result;
  }, [data, searchQuery, filters, searchFields, filterConfig]);

  // Paginer les données
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Réinitialiser la page lors d'un changement de filtre
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    filters,
    setFilter: handleFilterChange,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize: handlePageSizeChange,
    filteredData,
    paginatedData,
    totalPages,
    totalItems: filteredData.length,
  };
}
