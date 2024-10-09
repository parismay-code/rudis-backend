import { CreateRoleDto } from './dto/create-role.dto';

export const DEFAULT_ROLES: CreateRoleDto[] = [
  {
    name: 'user',
    description: 'Default user',
    priority: 1,
  },
  {
    name: 'premium',
    description: 'Premium user',
    priority: 2,
  },
  {
    name: 'streamer',
    description: 'Streamer',
    priority: 3,
  },
  {
    name: 'support',
    description: 'Support',
    priority: 4,
  },
  {
    name: 'moderator',
    description: 'Moderator',
    priority: 50,
  },
  {
    name: 'admin',
    description: 'Administrator',
    priority: 70,
  },
  {
    name: 'developer',
    description: 'Developer',
    priority: 90,
  },
  {
    name: 'owner',
    description: 'Owner',
    priority: 99,
  },
];
