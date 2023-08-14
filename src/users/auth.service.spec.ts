import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
      // Create partial fake copy if users service
      fakeUsersService = {
        find: () => Promise.resolve([]),
        create: (email: string, password: string) => 
          Promise.resolve({ id: 1, email, password } as User)
      };
    
      // Create some kind of testing DI container
      const module = await Test.createTestingModule({
        providers: [
          AuthService,
          { 
            provide: UsersService,
            useValue: fakeUsersService
          }
        ],
      }).compile();
    
      // Create an instance of AuthService inside this test DI container
      service = module.get(AuthService);
    });
    
    it('can create an instance of auth service', async () => {
      expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async() => {
      const user = await service.signup('asdsdsa@example.org', 'asdsdad');
      
      // We cannot test if the password was hashed properly, but at least it should be different from the password input
      expect(user.password).not.toEqual('asdsdad');
      const [salt, hash] = user.password.split('.');
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => {
      // changing the behavior of the find function for this test
      fakeUsersService.find = () =>
        Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
        
        await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
        BadRequestException,
        );
      });
      
    it('throws if signin is called with an unused email', async () => {
      await expect(
        service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
      ).rejects.toThrow(NotFoundException);
    });

});
