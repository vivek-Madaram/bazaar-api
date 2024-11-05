import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUpDto } from './dto/user-signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepositiry: Repository<UserEntity>,
  ) {}
  async signup(userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    const userExists = await this.findUserByEmail(userSignUpDto.email);
    // console.log(userExists);
    if (userExists) throw new BadRequestException('email is not available');
    userSignUpDto.password = await hash(userSignUpDto.password, 10);
    let user = this.userRepositiry.create(userSignUpDto);
    user = await this.userRepositiry.save(user);
    delete user.password;
    return user;
  }

  async signin(userSigninDto: UserSignInDto) {
    const userExists = await this.userRepositiry
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: userSigninDto.email })
      .getOne();
    if (!userExists) throw new BadRequestException('bad credentials');
    const matchPassword = await compare(
      userSigninDto.password,
      userExists.password,
    );
    if (!matchPassword) throw new BadRequestException('bad credentials');
    delete userExists.password;
    return userExists;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepositiry.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepositiry.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async findUserByEmail(email: string) {
    return await this.userRepositiry.findOneBy({ email });
  }
  async accessToken(user: UserEntity) {
    return sign({ id: user.id, email: user.email }, 'secret key', {
      expiresIn: '30m',
    });
  }
}
