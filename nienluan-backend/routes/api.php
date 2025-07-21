<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MajorController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PermissionGroupController;
use App\Http\Controllers\ReportPeriodController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\ThesisController;
use App\Http\Controllers\ThesisCouncilController;
use App\Http\Controllers\ThesisRegistrationController;
use App\Http\Controllers\ThesisTaskController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('guest')->post('/login', [AuthController::class, 'login']);


Route::middleware('auth:api')->group(function () {
    // Academic years
    Route::post('/add-academic-years', [AcademicYearController::class, 'store']);
    Route::get('/academic-years', [AcademicYearController::class, 'index']);
    Route::put('/update-academic-years/{id}', [AcademicYearController::class, 'update']);
    Route::delete('/delete-academic-years/{id}', [AcademicYearController::class, 'destroy']);
    Route::post('/delete-multi-academic-years', [AcademicYearController::class, 'destroyMulti']);
    Route::get('/search-academic-years', [AcademicYearController::class, 'search']);
    Route::get('/get-year-list', [AcademicYearController::class, 'getYearList']);


    // Semester
    Route::get('/semester', [SemesterController::class, 'index']);
    Route::post('/add-semester', [SemesterController::class, 'store']);
    Route::delete('/delete-semester/{id}', [SemesterController::class, 'destroy']);
    Route::post('/delete-multi-semester', [SemesterController::class, 'destroyMulti']);
    Route::put('/update-semester/{id}', [SemesterController::class, 'update']);
    Route::get('/search-semester', [SemesterController::class, 'search']);


    //Major
    Route::get('/major', [MajorController::class, 'index']);
    Route::post('/add-major', [MajorController::class, 'store']);
    Route::delete('/delete-major/{id}', [MajorController::class, 'destroy']);
    Route::post('/delete-multi-major', [MajorController::class, 'destroyMulti']);
    Route::put('/update-major/{id}', [MajorController::class, 'update']);
    Route::get('/search-major', [MajorController::class, 'search']);


    //Room
    Route::get('/room', [RoomController::class, 'index']);
    Route::post('/add-room', [RoomController::class, 'store']);
    Route::delete('/delete-room/{id}', [RoomController::class, 'destroy']);
    Route::post('/delete-multi-room', [RoomController::class, 'destroyMulti']);
    Route::put('/update-room/{id}', [RoomController::class, 'update']);
    Route::get('/search-room', [RoomController::class, 'search']);


    //Period report
    Route::get('/period-report', [ReportPeriodController::class, 'index']);
    Route::post('/add-report-period', [ReportPeriodController::class, 'store']);
    Route::get('/get-semester-option', [ReportPeriodController::class, 'getSemesterOptions']);
    Route::get('/get-semester-by-year/{id}', [ReportPeriodController::class, 'getSemesterByYear']);
    Route::delete('/delete-report-period/{id}', [ReportPeriodController::class, 'destroy']);
    Route::post('/delete-multi-report-period', [ReportPeriodController::class, 'destroyMulti']);
    Route::put('/update-report-period/{id}', [ReportPeriodController::class, 'update']);
    Route::get('/search-report-period', [ReportPeriodController::class, 'search']);


    // Teacher
    Route::get('/teacher-list', [UserController::class, 'index']);
    Route::post('/add-teacher', [UserController::class, 'store']);
    Route::get('/get-major-list-option', [MajorController::class, 'getMajorListOptions']);
    Route::delete('/delete-teacher/{id}', [UserController::class, 'destroy']);
    Route::post('/delete-multi-teacher', [UserController::class, 'destroyMulti']);
    Route::put('/update-teacher/{id}', [UserController::class, 'update']);
    Route::get('/search-teacher', [UserController::class, 'search']);
    Route::post('/create-teacher-account/{id}', [UserController::class, 'createTeacherAccount']);
    Route::get('/reset-teacher-account/{id}', [UserController::class, 'resetTeacherAccount']);


    // User information
    Route::post('/update-user-information/{id}', [UserController::class, 'updateUserInformation']);
    Route::get('/get-current-user', [AuthController::class, 'getCurrentUser']);
    Route::post('/change-user-password/{id}', [AuthController::class, 'updatePassword']);
    



    // Student
    Route::get('/student-list', [UserController::class, 'studentList']);
    Route::post('/add-student', [UserController::class, 'addStudent']);
    Route::delete('/delete-student/{id}', [UserController::class, 'destroyStudent']);
    Route::post('/delete-multi-student', [UserController::class, 'destroyMultiStudent']);
    Route::put('/update-student/{id}', [UserController::class, 'updateStudent']);
    Route::get('/search-student', [UserController::class, 'searchStudent']);
    Route::post('/create-student-account/{id}', [UserController::class, 'createStudentAccount']);
    Route::get('/reset-student-account/{id}', [UserController::class, 'resetStudentAccount']);

    // Thesis publish
    Route::get('/thesis-publish', [ThesisController::class, 'index']);
    Route::get('/get-report-period-option', [ThesisController::class, 'getReportPeriodOptions']);
    Route::post('/add-thesis-publish', [ThesisController::class, 'store']);
    Route::get('/get-report-period-by-semester/{id}', [ThesisController::class, 'getReportPeriodBySemester']);
    Route::get('/search-thesis-publish', [ThesisController::class, 'searchThesisPublish']);
    Route::delete('/delete-thesis-publish/{id}', [ThesisController::class, 'destroy']);
    Route::post('/delete-multi-thesis-publish', [ThesisController::class, 'destroyMulti']);
    Route::post('/update-thesis-publish/{id}', [ThesisController::class, 'update']);
    Route::get('/get-student', [ThesisController::class, 'getStudent']);


    // Thesis publish for student
    Route::get('/thesis-publish-for-student', [ThesisController::class, 'thesisPublishForStudent']);
    Route::get('/search-thesis-publish-for-student', [ThesisController::class, 'searchThesisPublishForStudent']);



    // Thesis registration
    Route::get('/thesis-register', [ThesisRegistrationController::class, 'index']);
    Route::get('/get-lecturer-option', [ThesisRegistrationController::class, 'getLecturerOptions']);
    Route::get('/search-thesis-register', [ThesisRegistrationController::class, 'searchThesisRegister']);
    Route::get('/withdraw-thesis/{id}', [ThesisRegistrationController::class, 'withdrawThesis']);
    Route::post('/register-thesis-publish/{id}', [ThesisRegistrationController::class, 'store']);


    // Thesis registration for student
    Route::get('/thesis-register-for-student', [ThesisRegistrationController::class, 'thesisRegisterForStudent']);





    // Thesis approval
    // Route::get('/thesis-approval', [ThesisRegistrationController::class, 'thesisApproval']);
    Route::post('/reject-thesis/{id}', [ThesisRegistrationController::class, 'rejectThesis']);
    Route::get('/approve-thesis/{id}', [ThesisRegistrationController::class, 'approveThesis']);
    Route::post('/reject-multi-thesis', [ThesisRegistrationController::class, 'rejectMulti']);
    Route::post('/approve-multi-thesis', [ThesisRegistrationController::class, 'approveMulti']);


    // Thesis task
    Route::get('/get-thesis-by-time', [ThesisTaskController::class, 'thesisTaskByTime']);
    Route::get('/get-thesis-active-by-time', [ThesisTaskController::class, 'thesisTaskActiveByTime']);


    // Thesis task for student
    Route::get('/get-thesis-by-time-for-student', [ThesisTaskController::class, 'thesisTaskByTimeForStudent']);
    Route::get('/get-thesis-active-by-time-for-student', [ThesisTaskController::class, 'thesisTaskActiveByTimeForStudent']);
    Route::get('/get-thesis-task-for-student', [ThesisTaskController::class, 'getThesisTaskForStudent']);
    Route::get('/search-thesis-task-for-student', [ThesisTaskController::class, 'searchThesisTaskForStudent']);
    Route::post('/student-update-thesis-task/{id}', [ThesisTaskController::class, 'studentUpdateThesisTask']);




    Route::post('/add-thesis-task', [ThesisTaskController::class, 'addThesisTask']);
    Route::get('/get-thesis-task', [ThesisTaskController::class, 'getThesisTask']);
    Route::get('/search-thesis-task', [ThesisTaskController::class, 'searchThesisTask']);
    Route::delete('/delete-thesis-task/{id}', [ThesisTaskController::class, 'deleteThesisTask']);
    Route::post('/delete-multi-thesis-task', [ThesisTaskController::class, 'deleteMultiThesisTask']);
    Route::post('/update-thesis-task/{id}', [ThesisTaskController::class, 'updateThesisTask']);
    Route::post('/review-thesis-task/{id}', [ThesisTaskController::class, 'reviewThesisTask']);


    // Committee
    Route::post('/add-committee', [ThesisCouncilController::class, 'addCouncil']);
    Route::get('/get-teacher-options', [ThesisCouncilController::class, 'getTeacherOptions']);
    Route::get('/get-committee-list', [ThesisCouncilController::class, 'getCommitteeList']);
    Route::get('/delete-committee/{id}', [ThesisCouncilController::class, 'deleteCommittee']);
    Route::post('/delete-multi-committee', [ThesisCouncilController::class, 'destroyMulti']);
    Route::post('/update-committee/{id}', [ThesisCouncilController::class, 'updateCommittee']);
    Route::get('/filter-committee', [ThesisCouncilController::class, 'filterCommittee']);


    // Schedule
    Route::get('/get-active-room', [ScheduleController::class, 'getActiveRoom']);
    Route::get('/get-thesis-approved-option', [ScheduleController::class, 'getThesisApproved']);
    Route::post('/add-thesis-report-schedule', [ScheduleController::class, 'store']);
    Route::get('/get-thesis-schedule', [ScheduleController::class, 'getThesisSchedule']);
    Route::delete('/delete-thesis-schedule/{id}', [ScheduleController::class, 'deleteThesisSchedule']);
    Route::put('/update-thesis-report-schedule/{id}', [ScheduleController::class, 'update']);


    // Report Schedule for Teacher and student
    Route::get('/get-report-room', [ScheduleController::class, 'getReportRoom']);
    Route::get('/get-report-schedule', [ScheduleController::class, 'getReportSchedule']);

    Route::get('/get-report-room-for-student', [ScheduleController::class, 'getStudentReportRoom']);
    Route::get('/get-report-schedule-for-student', [ScheduleController::class, 'getStudentReportSchedule']);


    // Permission
    Route::get('/permission', [PermissionController::class, 'index']);
    Route::get('/search-permission', [PermissionController::class, 'search']);
    Route::post('/add-permission', [PermissionController::class, 'addPermisson']);
    Route::delete('/delete-permission/{id}', [PermissionController::class, 'deletePermisson']);
    Route::post('/delete-multi-permission', [PermissionController::class, 'destroyMultiPermission']);
    Route::put('/update-permission/{id}', [PermissionController::class, 'updatePermission']);

    // Permission group
    Route::get('/permission-group', [PermissionGroupController::class, 'index']);
    Route::get('/all-role', [PermissionGroupController::class, 'allRole']);
    Route::post('/add-role', [PermissionGroupController::class, 'addRole']);
    Route::put('/update-role/{id}', [PermissionGroupController::class, 'updateRole']);
    Route::delete('/delete-role/{id}', [PermissionGroupController::class, 'deleteRole']);
    Route::post('/delete-multi-permission-group', [PermissionGroupController::class, 'deleteMultiPermissionGroup']);
    Route::get('/search-permission-group', [PermissionGroupController::class, 'searchPermissionGroup']);
    Route::get('/get-roles-list-option', [MajorController::class, 'getRolesListOptions']);
});
