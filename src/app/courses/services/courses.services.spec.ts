import { CoursesService } from './courses.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { COURSES, findLessonsForCourse, LESSONS } from '../../../../server/db-data';
import { Course } from '../model/course';
import { HttpErrorResponse } from '@angular/common/http';


describe('CoursesService', () => {

    let coursesService: CoursesService,
        httpTestingController: HttpTestingController;

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                CoursesService
            ]
        });

        coursesService = TestBed.get(CoursesService),
            httpTestingController = TestBed.get(HttpTestingController);

    });

    it('should retrieve all courses', () => {

        coursesService.findAllCourses()
            .subscribe(courses => {

                expect(courses).toBeTruthy('No courses returned');

                expect(courses.length).toBe(12,
                    "incorrect number of courses");

                const course = courses.find(course => course.id == 12);

                expect(course.titles.description).toBe(
                    "Angular Testing Course");

            });

        const req = httpTestingController.expectOne('/api/courses');

        expect(req.request.method).toEqual("GET");

        req.flush({ payload: Object.values(COURSES) });

    });

    it('should find a course by id', () => {

        coursesService.findCourseById(12)
            .subscribe(course => {

                expect(course).toBeTruthy();
                expect(course.id).toBe(12);

            });

        const req = httpTestingController.expectOne('/api/courses/12');

        expect(req.request.method).toEqual("GET");

        req.flush(COURSES[12]); // flush is trigger the call return 

    });

    it('should save the course data', () => {

        const changes: Partial<Course> =
        {
            titles: {
                description: 'Testing Course',
                longDescription: 'In-depth guide to Unit Testing and E2E Testing of Angular Applications'
            }
        };

        coursesService.saveCourse(12, changes)
            .subscribe(course => {

                expect(course.id).toBe(12);

            });

        const req = httpTestingController.expectOne('/api/courses/12');

        expect(req.request.method).toEqual("PUT");

        expect(req.request.body.titles.description)
            .toEqual(changes.titles.description);


        req.flush({
            ...COURSES[12],
            ...changes
        }) // copy COURSE12 and replace it partially with changes 

    });

    // testing if call fails
    it('should give an error if save courses fail', () => {
        const changes: Partial<Course> =
        {
            titles: {
                description: 'Testing Course',
            }
        };

        coursesService.saveCourse(12, changes).subscribe(() => {
            fail("the save course operation should have failed"),
                (error: HttpErrorResponse) => {
                    expect(error.status).toBe(500);
                }

        })

        const req = httpTestingController.expectOne('/api/courses/12');

        expect(req.request.method).toEqual("PUT");

        req.flush('Save course failed', { status: 500, statusText: 'internetServer Erro' })

    })

    // it('should find a list of lessons', () => {
    //     // since only courseID is required we can leave the rest of the params blank
    //     coursesService.findLessons(12).subscribe(lessons => {

    //         expect(lessons).toBeTruthy();
    //         expect(lessons.length).toEqual(3); //default pageSize is 3
    //     })
    //     // since this endpoint has params like /api/lessons?3&courseId=12, we are going to just test the main endpoint url
    //     const req = httpTestingController.expectOne(req => req.url == '/api/lessons');

    //     expect(req.request.method).toEqual('GET');

    //     //To Test Params of the endpoint 
    //     expect(req.request.params.get("courseId")).toEqual("12");
    //     expect(req.request.params.get("filter")).toEqual("");
    //     expect(req.request.params.get("sortOrder")).toEqual("asc");
    //     expect(req.request.params.get("pageNumber")).toEqual("0");
    //     expect(req.request.params.get("pageSize")).toEqual("3");
    //     // This endpoint return payload
    //     req.flush({
    //         payload: (Object.values(LESSONS).filter(lesson => lesson.courseId == 12)).slice(0,3)
    //     })
    // })


    afterEach(() => {
        httpTestingController.verify() // to make sure that the expectOne is only being use for each block(it) 
    })
})