import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

export interface FilterOption {
  label: string;
  value: string | number;
  options: { label: string; value: string | number }[];
}

interface TableSearchProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: FilterOption[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (filterKey: string, value: string) => void;
  resultCount?: number;
}

export function TableSearch({
  searchPlaceholder = 'Rechercher...',
  searchValue,
  onSearchChange,
  filters = [],
  activeFilters = {},
  onFilterChange,
  resultCount,
}: TableSearchProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = Object.values(activeFilters).some(v => v !== '');

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-input-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        {filters.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
              hasActiveFilters
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card border-border text-foreground hover:bg-accent'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filtres</span>
            {hasActiveFilters && (
              <span className="ml-1 px-1.5 py-0.5 bg-primary-foreground text-primary rounded text-xs">
                {Object.values(activeFilters).filter(v => v !== '').length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && filters.length > 0 && (
        <div className="bg-card border border-border rounded-md p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filters.map((filter) => (
              <div key={filter.value}>
                <label className="block text-sm text-foreground mb-1.5">
                  {filter.label}
                </label>
                <select
                  value={activeFilters[filter.value] || ''}
                  onChange={(e) => onFilterChange?.(String(filter.value), e.target.value)}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                >
                  <option value="">Tous</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={() => {
                filters.forEach(filter => onFilterChange?.(String(filter.value), ''));
              }}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
            >
              <X className="w-3 h-3" />
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      {/* Results Count */}
      {resultCount !== undefined && (
        <div className="text-sm text-muted-foreground">
          {resultCount} résultat{resultCount !== 1 ? 's' : ''} trouvé{resultCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
