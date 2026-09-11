export interface User {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  stage: 'cycle' | 'pregnancy' | 'menopause';
  stageLabel: string;
}
