import { client } from '../utils/fetchClient';
import { User } from '../types/User';

export const getUsers = () => {
  return client.get<User[]>('/users');
};

export const getUser = (id: number) => {
  // Instead of User[] you should return User!
  return client.get<User>(`/users/${id}`);
};
