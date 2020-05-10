import { TestBed, async, ComponentFixture, fakeAsync, flush } from "@angular/core/testing"
import { CoursesModule } from "../courses.module"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { HomeComponent } from "./home.component"
import { DebugElement } from "@angular/core"
import { CoursesService } from "../services/courses.service"
import { Observable, of } from "rxjs"
import { COURSES } from "../../../../server/db-data"
import { Course } from "../model/course"
import { By } from "@angular/platform-browser"


// Note: 
// 1. Home component is known as the smart/comtainer component, which it gets data and doesnt have presentation responsibility. It is usually top level 
// 2. why use async when fakeasync is better? It is because it support HTTP request, it is useful when we do HTTP call to backend
// 3. async at beforeEach is to make sure the block get resolved before moving forward to the tests. which it wait for promise (then) to resolve, we can also use fakeAsync but we would need a flushMicrotasks for the promise

describe('HomeComponent', () => {
    let fixture: ComponentFixture<HomeComponent>;
    let component: HomeComponent;
    let el: DebugElement;
    let coursesService: any;

    // Place for reuse mock data
    const beginnerCourses = Object.values(COURSES).sort(sortCoursesBySeqNo).filter((course: Course) => course.category == 'BEGINNER') as Course[]; //we will get error and to fix it we need to add type "any" to the coursesService varaible because this is what angular return when we do [coursesService = TestBed.get(CoursesService)]
    const advanceCourses = Object.values(COURSES).sort(sortCoursesBySeqNo).filter((course: Course) => course.category == 'BEGINNER') as Course[];
    const allCourses = Object.values(COURSES).sort(sortCoursesBySeqNo) as Course[];

    beforeEach(async(() => { // async is similar to fakeasync, it going to detect all of the async code inside the block and wait for the promite to done.  
        const courseService = jasmine.createSpyObj('CoursesService', ['findAllCourses']) //[] is the methods we want to mock
        TestBed.configureTestingModule({
            imports: [CoursesModule, NoopAnimationsModule], // NoopAnimationModule will ignore the animation
            providers: [
                { provide: CoursesService, useValue: courseService } //useValue is the mock value
            ]
        }).compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(HomeComponent);
                component = fixture.componentInstance;
                el = fixture.debugElement;
                coursesService = TestBed.get(CoursesService);
            });
    }));

    it("should create the component", () => {
        expect(component).toBeTruthy();
    })

    // mocking observable based services with "of"
    it("should only display beginer course", () => {
        coursesService.findAllCourses.and.returnValue(of(beginnerCourses)); // of will take the value and create an observable and it is synchoronous

        fixture.detectChanges(); // to apply data to the DOM

        const tabs = el.queryAll(By.css(".mat-tab-label"));

        expect(tabs.length).toBe(1);

    })

    // mocking observable based services with "of"
    it("should display only advance courses", () => {
        coursesService.findAllCourses.and.returnValue(of(advanceCourses)); // of will take the value and create an observable and it is synchoronous

        fixture.detectChanges(); // to apply data to the DOM

        const tabs = el.queryAll(By.css(".mat-tab-label"));

        expect(tabs.length).toBe(1);

    })

    it("should display both tabs", () => {
        coursesService.findAllCourses.and.returnValue(of(allCourses)); // of will take the value and create an observable and it is synchoronous

        fixture.detectChanges(); // to apply data to the DOM

        const tabs = el.queryAll(By.css(".mat-tab-label"));

        expect(tabs.length).toBe(2);
    })

    // simulate user DOM interaction (async component - with fakeAsync)
    it("should display advanced courses when tab clicked - fake Async", fakeAsync(() => {
        coursesService.findAllCourses.and.returnValue(of(allCourses)); // of will take the value and create an observable and it is synchoronous

        fixture.detectChanges(); // to apply data to the DOM

        const tabs = el.queryAll(By.css(".mat-tab-label"));

        // Simulating user click (async)
        click(tabs[1]);

        fixture.detectChanges(); // to apply data to the DOM (update DOM there is changes)

        flush(); // we neeeded to use flush here because click(tabs[1]) is async behaviour built in. 

        const cardTitles = el.queryAll(By.css('.mat-tab-body-active'));

        expect(cardTitles.length).toBeGreaterThan(0);

        expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");

    }));

    // simulate user DOM interaction (async component - with Async)
    it("should display advanced courses when tab clicked - async", async(() => {  // async does not have function like flush or tick
        coursesService.findAllCourses.and.returnValue(of(allCourses)); // of will take the value and create an observable and it is synchoronous

        fixture.detectChanges(); // to apply data to the DOM

        const tabs = el.queryAll(By.css(".mat-tab-label"));

        // Simulating user click (async)
        click(tabs[1]);

        fixture.detectChanges(); // to apply data to the DOM (update DOM there is changes)

        fixture.whenStable().then(() => { // notify when all async is completed, but the drawback of here is not having control over of time like tick and the way of writing is not like synchronous
            console.log("called whenStable()");

            const cardTitles = el.queryAll(By.css('.mat-tab-body-active'));

            expect(cardTitles.length).toBeGreaterThan(0);

            expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");

        });


    }));

})

function sortCoursesBySeqNo(c1: Course, c2: Course) {
    return c1.seqNo - c2.seqNo;

}

const ButtonClickEvents = {
    left: { button: 0 },
    right: { button: 2 }
};

function click(el: DebugElement | HTMLElement,
    eventObj: any = ButtonClickEvents.left): void {

    if (el instanceof HTMLElement) {
        el.click();
    } else {
        el.triggerEventHandler('click', eventObj);
    }
}