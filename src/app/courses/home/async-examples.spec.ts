import { fakeAsync, tick, flush, flushMicrotasks } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";
// Note: 
// 1. testing observable is very similar to testing timeout function
describe("Async Testing Examples", () => {

    // (dont do this) This way of test is needed to be avoided because in a larger code base we wont know how long it take a async code to take and etc
    it("Asynchronous test example with Jasmine done()", (done: DoneFn) => { // Done callback is from Jasmine 
        let test = false;

        setTimeout(() => {

            console.log("running assertion");

            test = true;

            expect(test).toBeTruthy();

            done();

        }, 1000);
    })

    // (do this) aungular fake async utility
    it("Asynchronous this example - setTimeout()", fakeAsync(() => { // fakeAsync will kep track of all async operations 
        //zone.js library is a build in angular change detaction async machanism. it more flexible than jasmine done 
        let test = false;

        setTimeout(() => { })

        setTimeout(() => {
            console.log('running assertion setTimeout()');
            test = true;

        }, 1000);


        //tick(1000);//push the clock forward, it has to be in fakeAsync. without this there will be an error saying there are items in the queue which is the async code 
        flush();//all time out finish before going into the assertion. It is also a zone function
        expect(test).toBeTruthy(); // we can no longer writing assetion in nested block aka inside setTimeout

    }));

    // testing promises (intro to microtasks)

    it('Asynchronous test example - plain Promise', fakeAsync(() => {
        let test = false;

        console.log('Creating promise');
        // set time out is a macrotask
        // setTimeout(() => {
        //     console.log('setTimeout() first callBack triggered');
        // })

        // setTimeout(() => {
        //     console.log('setTimeout() second callBack triggered');
        // })

        // Promises is a microtask thus in runtime, it will be executed before macrotask
        Promise.resolve().then(() => {
            console.log('Promise first then() evaluated successfully');
            return Promise.resolve();
        }).then(() => {
            test = true;
            console.log('Promise second then() evaluated successfully');
        })

        flushMicrotasks(); // flush only microtask like promises before the assertion is run

        console.log('Running test assertion');
        expect(test).toBeTruthy();
    }));


    // mixed test for both micro and macrotask (promises and setTimeout)
    it('Asynchronous test example - promises + setTimeout()', fakeAsync(() => {
        let counter = 0;

        Promise.resolve()
            .then(() => {
                counter += 10;

                setTimeout(() => {
                    counter += 1;
                }, 1000)
            })
        expect(counter).toBe(0);

        flushMicrotasks();

        expect(counter).toBe(10);

        tick(500);

        expect(counter).toBe(10);

        flush();

        expect(counter).toBe(11);

    }));

    // using fakeAsync to test Observables (synchronous observable)
    it('Asynchronous test example - Observables', () => {
        let test = false;

        console.log('Creating Observable');

        const test$ = of(test); //creating a fake observable

        test$.subscribe(() => {
            test = true;
        }) // subscribe is making the test$ observable synchronous, because subscribe block is immediately executed before the assertions 

        console.log('Running test assertions');

        expect(test).toBe(true);
    })

    // using fakeAsync to test Observables with pipe (asynchronous observable)
    it('Asynchronous test example - Observables with pipe', fakeAsync(() => {
        let test = false;

        console.log('Creating Observable');

        const test$ = of(test).pipe(delay(1000)); //creating a fake observable and pipe with delay

        test$.subscribe(() => {
            test = true;
        }) // subscribe is making the test$ observable synchronous, because subscribe block is immediately executed before the assertions 

        tick(1000);

        console.log('Running test assertions');

        expect(test).toBe(true);
    }));


})