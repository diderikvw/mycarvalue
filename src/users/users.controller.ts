import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
//@UseInterceptors(new SerializeInterceptor(UserDto)) refactored to our own decorator
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.authService.signup(body.email, body.password);
  }

  @Post('/signin')
  // Re-using the CreateUserDto is fine, but the name of this Dto is then not great.
  signin(@Body() body: CreateUserDto) {
    return this.authService.signin(body.email, body.password);
  }

  // Anyting from the request is a string, so this is why findUser has a string param
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    console.log('handler is running');
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) { 
    // It would be nicer to throw the exception here instead of in the service, but that is a bit more challenging. 
    // Advanced topic: exception filtering.
    return this.usersService.remove(parseInt(id));
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    // It would be nicer to throw the exception here instead of in the service, but that is a bit more challenging. 
    // Advanced topic: exception filtering.
    return this.usersService.update(parseInt(id), body);
  }
}
