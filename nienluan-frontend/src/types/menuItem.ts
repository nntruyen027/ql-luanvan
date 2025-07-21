// Đặt trên cùng file hoặc tạo riêng types.ts
import type { ItemType } from 'antd/es/menu/hooks/useItems';

export interface MenuItem extends ItemType {
  permission?: string;
  children?: MenuItem[];
}
