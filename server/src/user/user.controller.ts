import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@ApiTags("Users")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: "User created" })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "List all users" })
  @ApiResponse({ status: 200, description: "Users list" })
  findAll() {
    return this.userService.findAll();
  }

  @Get(":uuid")
  @ApiOperation({ summary: "Get a user by uuid" })
  @ApiParam({ name: "uuid", type: String })
  @ApiResponse({ status: 200, description: "User found" })
  @ApiResponse({ status: 404, description: "User not found" })
  findOne(@Param("uuid") uuid: string) {
    return this.userService.findOne(uuid);
  }

  @Put(":uuid")
  @ApiOperation({ summary: "Update a user" })
  @ApiParam({ name: "uuid", type: String })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: "User updated" })
  @ApiResponse({ status: 404, description: "User not found" })
  update(@Param("uuid") uuid: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(uuid, dto);
  }

  @Delete(":uuid")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a user" })
  @ApiParam({ name: "uuid", type: String })
  @ApiResponse({ status: 204, description: "User deleted" })
  @ApiResponse({ status: 404, description: "User not found" })
  async remove(@Param("uuid") uuid: string) {
    await this.userService.remove(uuid);
  }
}
