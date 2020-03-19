import { Controller, Post, Body, Patch, Param, ParseIntPipe, Get, Delete, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { Participant } from 'src/participant/entities/participant.entity';
import { ParticipantSearchFilterDto } from './dto/participant-search-filter.dto';
import { ParticipantDto } from 'src/participant/dto/participant.dto';
import { UserAuthDto } from './dto/user-auth.dto';

@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) {}

    @Post('/login')
    async loginUser(@Body() userAuthDto: UserAuthDto) {
        return this.adminService.loginUser(userAuthDto)
    }

    @Post('/users')
    async createUser(@Body() userDto: UserDto): Promise<User> {
        return this.adminService.createUser(userDto)
    }

    @Patch('/users/:id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() userDto: UserDto): Promise<User> {
        return this.adminService.updateUser(id, userDto)
    }

    @Get('/users/:id')
    async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.adminService.getUser(id)
    }

    @Get('/users')
    async getUsers(): Promise<User[]> {
        return this.adminService.getUsers()
    }

    @Delete('/users/:id')
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.deleteUser(id)
    }

    @Get('/participants/:id')
    async getParticipant(@Param('id', ParseIntPipe) id: number): Promise<Participant> {
        return this.adminService.getParticipant(id)
    }

    @Get('/participants')
    async getParticipants(@Query() participantSearchFilterDto: ParticipantSearchFilterDto): Promise<Participant[]> {
        return this.adminService.getParticipants(participantSearchFilterDto)
    }

    @Patch('/participants/:id')
    async updateParticipant(@Param('id', ParseIntPipe) id: number, @Body() participantDto: ParticipantDto): Promise<Participant> {
        return this.adminService.updateParticipant(id, participantDto)
    }
}
