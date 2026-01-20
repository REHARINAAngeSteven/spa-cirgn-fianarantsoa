// frontend/src/app/components/StatusBadge.tsx
import type { StatutPassation } from '../types/backend';

interface StatusBadgeProps {
  status: StatutPassation;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const statusConfig: Record<StatutPassation, { label: string; bg: string; text: string }> = {
    EN_ATTENTE: {
      label: 'En attente',
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
    },
    VALIDEE: {
      label: 'Validée',
      bg: 'bg-green-100',
      text: 'text-green-800',
    },
    REJETEE: {
      label: 'Rejetée',
      bg: 'bg-red-100',
      text: 'text-red-800',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text} ${className}`}
    >
      {config.label}
    </span>
  );
}