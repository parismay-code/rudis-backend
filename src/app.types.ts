import { Request } from 'express';
import { User } from './users/user.entity';

export type AuthorizedRequest = Request & { user: User };
