import { TestBed, ComponentFixture, async } from "@angular/core/testing"
import { CoursesModule } from "../courses.module"
import { CoursesCardListComponent } from "./courses-card-list.component"
import { COURSES } from "../../../../server/db-data";
import { Course } from "../model/course";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

// Note: 
// 1. Try to achieve the test in synchronos way and avoid async
// 2. Predicate is an function to return true or false

// Testing presentational components 
describe('CoursesCardListComponent', () => {
    // instances 
    let component: CoursesCardListComponent;
    let fixture: ComponentFixture<CoursesCardListComponent>;  // fixture is to test utility, we can use it to obtain instance of the component (ex we can also use it access to dom)
    let el: DebugElement; // it's an object to query the DOM

    
    beforeEach(async(() => { //this is a synchronys beforeEach block, which mean the code after "then" promise will not be resolve. async (it is aungular testing utility) here is to wait for async code we pass to complete.
        TestBed.configureTestingModule({
            // instead of put component in declaration to config every component in the html file, we import the module  
            imports: [CoursesModule]
        }).compileComponents()// compileComponents is to get back promise that is resolved during compilation. This is async process
            .then(() => {
                fixture = TestBed.createComponent(CoursesCardListComponent)
                component = fixture.componentInstance;
                el = fixture.debugElement;
            });

    }))
    // test component is created
    it('should create the component', () => {
        expect(component).toBeTruthy();

        console.log(component)
    })
    // Test DOM interaction 
    it('should display the course list', () => {
        
        component.courses = Object.values(COURSES).sort(sortCoursesBySeqNo) as Course[]; // we have pass data to the component here 

        fixture.detectChanges() // after adding data to the DOM, we need to notify the fixture
        //This show that this block is synchronos because we do not have to wait for promise even we change DOM

        // console.log(el.nativeElement.outerHTML) // way to debug, nativeElement will only select the element in that component

        // To make sure data is correctly display on the screen 
        const cards = el.queryAll(By.css(".course-card")); //We use by utility to make it easy the predicate in DOM elemnt. Predicate is an function to return true or false

        expect(cards).toBeTruthy();
        expect(cards.length).toBe(12);


    })

    // testing content 
    it('should display the first course', () => {
        component.courses = Object.values(COURSES).sort(sortCoursesBySeqNo) as Course[];

        fixture.detectChanges();

        const course = component.courses[0];

        const card = el.query(By.css('.course-card:first-child'));
        const title = card.query(By.css('.mat-card-title'));
        const image = card.query(By.css('img'))

        expect(card).toBeTruthy();
        expect(title.nativeElement.textContent).toBe(course.titles.description); // testContent is to get text
        expect(image.nativeElement.src).toBe(course.iconUrl); // src is the [src] element in the image tag 
    })

})

function sortCoursesBySeqNo(c1: Course, c2: Course) {
    return c1.seqNo - c2.seqNo;

}