export type MuscleGroup = 'Ngực' | 'Lưng' | 'Chân' | 'Vai' | 'Tay';

export interface Exercise {
  id: string;
  name: string;
  trainer: string; 
  group: MuscleGroup;
  duration: number; 
}

export type FilterGroup = 'Tất cả' | MuscleGroup;

export type SortOption = 'default' | 'name-asc' | 'duration-asc';
