import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    // Only create mock functions of the functions used in the controller's functions we want to test 
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'asdaasd@example.org', password: 'assad' } as User)
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asdsad'} as User])
      },
      // remove: () => {},
      // update: () => {},
    };
    fakeAuthService = {
      // signup: () => {

      // },
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User)
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('asdaasd@example.org');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdaasd@example.org');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signing updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin({ email: '123232@example.org', password: 'sadsd'}, 
    session);

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
