import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async resetProblems(): Promise<{ problemUsersCount: number }> {
    const problemUsersCount = await this.userRepository.count({
      where: { hasProblems: true },
    });

    await this.userRepository.update(
      { hasProblems: true },
      { hasProblems: false },
    );

    return { problemUsersCount };
  }
}
