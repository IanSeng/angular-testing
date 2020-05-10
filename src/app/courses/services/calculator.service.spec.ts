import { LoggerService } from "./logger.service"
import { CalculatorService } from "./calculator.service"
import { TestBed } from "@angular/core/testing";

describe('CalculatorService', () => {
    let loggerSpy: any;
    let calculator: CalculatorService;

    beforeEach(() => {

        loggerSpy = jasmine.createSpyObj('LoggerService', ["log"]);


        TestBed.configureTestingModule({
            providers: [
                CalculatorService,
                { provide: LoggerService, useValue: loggerSpy }
            ]
        })

        calculator = TestBed.get(CalculatorService)
    })

    it('should add two number', () => {


        const result = calculator.add(2, 2);

        expect(result).toBe(4);

        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    })

    it('should subtract two numbers', () => {


        const result = calculator.subtract(2, 2);

        expect(result).toBe(0, "unepected subtraction result");

        expect(loggerSpy.log).toHaveBeenCalledTimes(1);

    });

})