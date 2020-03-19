import { Controller, Post, Body, Patch, Param, ParseIntPipe, Get, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { Participant } from 'src/participant/entities/participant.entity';
import { ParticipantSearchFilterDto } from './dto/participant-search-filter.dto';
import { ParticipantDto } from 'src/participant/dto/participant.dto';
import { UserAuthDto } from './dto/user-auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) {}

    @Post('/login')
    async loginUser(@Body() userAuthDto: UserAuthDto) {
        return this.adminService.loginUser(userAuthDto)
    }

    @Post('/users')
    @UseGuards(AuthGuard())
    async createUser(@Body() userDto: UserDto, @Req() req): Promise<User> {
        return this.adminService.createUser(userDto, req)
    }

    @Patch('/users/:id')
    @UseGuards(AuthGuard())
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() userDto: UserDto, @Req() req): Promise<User> {
        return this.adminService.updateUser(id, userDto, req)
    }

    @Get('/users/:id')
    @UseGuards(AuthGuard())
    async getUser(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<User> {
        return this.adminService.getUser(id, req)
    }

    @Get('/users')
    @UseGuards(AuthGuard())
    async getUsers(@Req() req): Promise<User[]> {
        return this.adminService.getUsers(req)
    }

    @Delete('/users/:id')
    @UseGuards(AuthGuard())
    async deleteUser(@Param('id', ParseIntPipe) id: number, @Req() req) {
        return this.adminService.deleteUser(id, req)
    }

    @Get('/participants/:id')
    @UseGuards(AuthGuard())
    async getParticipant(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<Participant> {
        return this.adminService.getParticipant(id, req)
    }

    @Get('/participants')
    @UseGuards(AuthGuard())
    async getParticipants(@Query() participantSearchFilterDto: ParticipantSearchFilterDto, @Req() req): Promise<Participant[]> {
        return this.adminService.getParticipants(participantSearchFilterDto, req)
    }

    @Patch('/participants/:id')
    @UseGuards(AuthGuard())
    async updateParticipant(@Param('id', ParseIntPipe) id: number, @Body() participantDto: ParticipantDto, @Req() req): Promise<Participant> {
        return this.adminService.updateParticipant(id, participantDto, req)
    }
}
