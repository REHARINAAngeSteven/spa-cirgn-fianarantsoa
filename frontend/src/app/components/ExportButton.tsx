import { Download } from 'lucide-react';

interface ExportButtonProps {
  data: any[];
  filename: string;
  headers?: Record<string, string>; // Mapping des clés aux libellés
  disabled?: boolean;
}

export function ExportButton({ data, filename, headers, disabled = false }: ExportButtonProps) {
  const handleExport = () => {
    if (!data || data.length === 0) return;

    // Préparer les en-têtes
    const keys = headers ? Object.keys(headers) : Object.keys(data[0]);
    const headerLabels = headers 
      ? keys.map(key => headers[key])
      : keys;

    // Créer le CSV
    const csvRows = [];
    csvRows.push(headerLabels.join(';'));

    // Ajouter les données
    data.forEach(row => {
      const values = keys.map(key => {
        const value = row[key];
        // Échapper les valeurs avec des virgules ou guillemets
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(';') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      csvRows.push(values.join(';'));
    });

    // Créer le blob et télécharger
    const csvContent = csvRows.join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || !data || data.length === 0}
      className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
        disabled || !data || data.length === 0
          ? 'bg-muted text-muted-foreground border-border cursor-not-allowed'
          : 'bg-card border-border text-foreground hover:bg-accent'
      }`}
      title="Exporter en CSV"
    >
      <Download className="w-4 h-4" />
      <span className="text-sm">Exporter</span>
    </button>
  );
}
