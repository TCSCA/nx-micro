import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProcessCsvUseCase } from '../../../application/use-cases/process-csv.use-case';

@Controller()
export class CsvController {
    constructor(private readonly processCsvUseCase: ProcessCsvUseCase) { }

    @MessagePattern({ cmd: 'process_csv' })
    async processCsv() {
        return this.processCsvUseCase.execute();
    }
}
