export type RoleType = 'super_admin' | 'reseller' | 'customer';

export interface CodeFile {
  id: string;
  name: string;
  path: string;
  category: 'migration' | 'model' | 'route' | 'controller' | 'service' | 'blade' | 'config';
  language: 'php' | 'blade' | 'bash' | 'sql' | 'env';
  description: string;
  code: string;
  keyHighlights: string[];
}

export interface SchemaTable {
  name: string;
  description: string;
  columns: {
    name: string;
    type: string;
    isPrimary?: boolean;
    isForeign?: boolean;
    foreignRef?: string;
    nullable?: boolean;
    description: string;
  }[];
}

export interface OrderSimulationStep {
  title: string;
  status: 'idle' | 'processing' | 'success' | 'failed';
  timestamp?: string;
  details?: string;
  payload?: any;
}
