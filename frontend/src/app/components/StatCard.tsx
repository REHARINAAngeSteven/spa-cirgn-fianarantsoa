import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: 'pending' | 'validated' | 'blocked' | 'primary';
  delay?: number;
  subtitle?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'primary',
  delay = 0,
  subtitle 
}: StatCardProps) {
  const colorClasses = {
    pending: 'border-l-status-pending text-status-pending',
    validated: 'border-l-status-validated text-status-validated',
    blocked: 'border-l-status-blocked text-status-blocked',
    primary: 'border-l-primary text-primary',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`bg-card rounded-lg border-l-4 ${colorClasses[color]} p-6 hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-5 h-5 ${colorClasses[color]}`} />
        <h3 className="text-foreground">{title}</h3>
      </div>
      <motion.p
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.2, type: 'spring' }}
        className="text-3xl text-foreground"
      >
        {value}
      </motion.p>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
}
