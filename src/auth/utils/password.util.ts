import * as argon from 'argon2';

export const hashPassword = (password: string) => argon.hash(password);
export const verifyPassword = (hash: string, password: string) =>
  argon.verify(hash, password);
