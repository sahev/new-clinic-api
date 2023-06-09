import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { Not, Like, Repository } from 'typeorm';
import {
  CreateAdminDto,
  CreateUserDto,
  UpdateUserDto,
} from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { Role } from 'src/auth/models/roles.model';
import { Contact } from '../entities/contact-user.entity';

@Injectable()
export class UsersService {
  constructor (
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Contact) private contactRepository: Repository<Contact>,
  ) { }

  async create (createUserDto: CreateUserDto | CreateAdminDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      }
    });

    if (user) {
      throw new BadRequestException('Email already exists');
    }

    const createdUser = this.userRepository.create(createUserDto);

    if (createUserDto.isFirstUser) {
      createdUser.role = Role.ADMIN;
    }

    const saveUser = await this.userRepository.save(createdUser);

    delete saveUser.password;
    delete saveUser.refreshToken;
    return saveUser;
  }

  async findAllByClinicId (id: number) {
    return this.userRepository.find({
      where: [
        { clinicId: id, role: Not(Role.SUPER) }
      ],
      relations: ['contact']
    });
  }

  async findAllByHeadQuarterId (id: number) {
    return this.userRepository.find({
      where: [
        { clinicId: id, role: Not(Role.SUPER) },
        { headQuarterId: id, role: Not(Role.SUPER) }
      ],
      relations: ['contact']
    });
  }

  async findByEmailAndGetPassword (email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email
      },
      select: ['id', 'password', 'role', 'clinicId']
    });
    return user
  }

  async findOneBy (id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['contact']
    });
  }

  async findAllByName (clinicId: number, name: string) {

    return this.userRepository.find({
      where: [
        { clinicId, firstName: Like(`%${name}%`) },
        { clinicId, email: Like(`%${name}%`) }
      ],
      select: ['id', 'firstName', 'lastName', 'email']
    });
  }

  async findById (userId: number) {
    return await this.userRepository.findOneByOrFail({ id: userId });
  }

  async findByEmail (email: string) {
    return await this.userRepository.find({
      where: { email },
    });
  }

  async emailExists (email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user)
      return user.id

    return false;
  }

  async update (id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    let contact: Contact;

    if (updateUserDto.contact) {
      contact = await this.contactRepository.save(updateUserDto.contact)
      user.contactId = contact.id
      user.contact = contact
    }

    await this.userRepository.save(user);

    return user
  }

  async remove (id: number) {
    const user = await this.userRepository.findOneBy({ id: id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    return this.userRepository.remove(user);
  }

  async setCurrentRefreshToken (refreshToken: string, userId: number) {
    //crypto is a node module, and bcrypt the maximum length of the hash is 60 characters, and token is longer than that, so we need to hash it
    const hash = createHash('sha256').update(refreshToken).digest('hex');

    const currentHashedRefreshToken = await bcrypt.hashSync(hash, 10);
    return await this.userRepository.update(userId, {
      refreshToken: currentHashedRefreshToken,
    });
  }

  async removeRefreshToken (userId: number) {
    await this.findById(userId);

    return this.userRepository.update(
      { id: userId },
      {
        refreshToken: null,
      },
    );
  }

  async getUserIfRefreshTokenMatches (refreshTokenn: string, userId: number) {
    const { id,
      refreshToken,
      role } = await this.userRepository.findOneBy({ id: userId });

    const user = {
      id,
      refreshToken,
      role
    }

    const hash = createHash('sha256').update(refreshTokenn).digest('hex');
    const isRefreshTokenMatching = await bcrypt.compare(
      hash,
      user.refreshToken,
    );

    if (isRefreshTokenMatching) {
      return { id: user.id, role: user.role };
    }
  }

  async toggleStatus (id: number) {
    let user = await this.userRepository.findOneBy({ id: id })
    user.active = !user.active
    this.userRepository.save(user)
  }

  async togglePerformServiceStatus (id: number) {
    let user = await this.userRepository.findOneBy({ id: id })
    user.performService = !user.performService
    this.userRepository.save(user)
  }
}
