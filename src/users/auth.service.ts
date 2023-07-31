import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if e-mail is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      // Bad practice: this informs a hacker it found an existing email address/username
      throw new BadRequestException('email in use');
    }

    // Hash the user's password
    // Generate a salt of 16 characters
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together of 32 characters or bytes?
    // Helping TypeScript a bit by saying the hash is a Buffer, as otherwise it does not know about the promisifyed function
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const user = await this.usersService.create(email, result);

    // Return the user
    return user;
  }

  // Not a great method name, since a user will not actually be signed in after this function
  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    // What if 2 users where found? Check for this "this should not happen" edge case and throw exception?

    const [salt, storedhash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedhash !== hash.toString('hex')) {
      // Would throwing an Unauthorized be better?
      throw new BadRequestException('bad password');
    }
    return user;
  }
}
