import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { AuthGuard } from '../Guard/auth.guard';
import { RequestWidthCompany } from 'src/types/type';
import { PersonDto } from './dto/person.dto';
import { PersonContractDto } from './dto/person-contract.dto';

@Controller('person')
export class PersonController {
  constructor(private personService: PersonService) {}

  @Get()
  @UseGuards(AuthGuard)
  getAllPerson(@Req() req: RequestWidthCompany) {
    return this.personService.getAllPerson(req.companyId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getOnePerson(@Param('id') id: string) {
    return this.personService.getOnePerson(id);
  }

  // create new person
  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  addPerson(@Req() req: RequestWidthCompany, @Body() dto: PersonDto) {
    return this.personService.addPerson(
      { ...dto, companyId: req.companyId },
      req.companyId,
    );
  }

  // create new contract
  @Post(':id/contract')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  addContract(@Param('id') id: string, @Body() dto: PersonContractDto) {
    return this.personService.addContract(dto, id);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  updatePerson(
    @Req() req: RequestWidthCompany,
    @Param('id') id: string,
    @Body() dto: PersonDto,
  ) {
    return this.personService.updatePerson(id, dto, req.companyId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delelePerson(@Req() req: RequestWidthCompany, @Param('id') id: string) {
    console.log(req.companyId);
    return this.personService.deletePerson(id, req.companyId);
  }
}
