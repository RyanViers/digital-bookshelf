export interface ModalConfig {
  type: 'warning' | 'error' | 'success';
  title: string;
  message: string;
  confirmText?: string; 
  cancelText?: string;  
}