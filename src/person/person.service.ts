import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Person, PersonDocument } from './person.schema';
import { PersonDto } from './dto/person.dto';
import { PersonContractDto } from './dto/person-contract.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectModel(Person.name) private personModel: Model<PersonDocument>,
  ) {}

  async getAllPerson(companyId: string) {
    return await this.personModel.find({ companyId: { $eq: companyId } });
  }

  async getOnePerson(id: string) {
    return await this.personModel.findById(id);
  }

  async addPerson(dto: PersonDto, companyId: string) {
    await this.personModel.create(dto);
    return await this.personModel.find({ companyId: { $eq: companyId } });
  }

  async updatePerson(id: string, dto: PersonDto, companyId: string) {
    await this.personModel.findByIdAndUpdate(id, dto);
    return await this.personModel.find({ companyId: { $eq: companyId } });
  }

  async deletePerson(id: string, companyId: string) {
    await this.personModel.findByIdAndDelete(id);
    return await this.personModel.find({ companyId: { $eq: companyId } });
  }

  // *******************  Contract  ****************
  async addContract(dto: PersonContractDto, id: string) {
    console.log(dto);
    await this.personModel.updateOne(
      { _id: id },
      {
        $push: {
          contract: {
            paid: dto.paid,
            history: [...dto.history],
          },
        },
      },
    );
    return this.personModel.findById(id);
  }
}
