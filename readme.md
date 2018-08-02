#Moodle

##Configuration

##WebServices

###Moodle Configuration 

1. Add the capability "webservice/rest:use" to authenticate users 
2. Add the next capabilities to Teacher: 
    - moodle/badges:viewotherbadges,
    - moodle/calendar:manageownentries,
    - moodle/competency:competencyview,
    - moodle/competency:evidencedelete,
    - moodle/competency:competencymanage,
    - moodle/competency:coursecompetencyview,
    - moodle/category:viewhiddencategories,
    - moodle/course:view,
    - moodle/user:update,
    - moodle/site:deleteownmessage,
    - moodle/user:editownmessageprofile,
    - moodle/site:sendmessage,
    - moodle/user:manageownfiles,
    - moodle/user:editownprofile,
    - moodle/user:editprofile,
    - moodle/user:editmessageprofile,
    - gradereport/overview:view,
    - message/airnotifier:managedevice,
    - mod/feedback:complete,
    - mod/folder:view,
    - mod/imscp:view,
    - mod/label:view,
    - mod/lesson:view,
    - mod/page:view,
    - mod/quiz:attempt,
    - mod/quiz:reviewmyattempts,
    - mod/resource:view,
    - mod/url:view,
    - mod/workshop:submit,
    - moodle/competency:planviewown,
    - moodle/competency:planview,
    - moodle/competency:userevidenceview
    - moodle/webservice:createtoken
    - webservice/rest:use


###Login
You need set the capabilites from each role. First the token generation and rest use.

METHOD: POST
PATH: http://www.domain.me/login/token.php?username=username&password=password&service=moodle_mobile_app





###Usefull functions

####core_course_get_courses
#####Description
List all courses



####core_course_view_course
#####Description
Get info about a course
#####parameters:
1. courseid

####core_enrol_get_users_courses
#####Description
Get all courses where user belongs.
#####parameters:
1. userid



###flows
1. Listar todos mis cursos
   function   core_enrol_get_users_courses
   params:    userid
2. Listar todos los usuarios de un curso mio.
   function:   core_enrol_get_enrolled_users
   params:     courseid




"moodle/badges:viewotherbadges","moodle/calendar:manageownentries","moodle/competency:competencyview","moodle/competency:evidencedelete","moodle/competency:competencymanage","moodle/competency:coursecompetencyview","moodle/category:viewhiddencategories","moodle/course:view","moodle/user:update","moodle/site:deleteownmessage","moodle/user:editownmessageprofile","moodle/site:sendmessage","moodle/user:manageownfiles","moodle/user:editownprofile","moodle/user:editprofile","moodle/user:editmessageprofile","gradereport/overview:view","message/airnotifier:managedevice","mod/feedback:complete","mod/folder:view","mod/imscp:view","mod/label:view","mod/lesson:view","mod/page:view","mod/quiz:attempt","mod/quiz:reviewmyattempts","mod/resource:view","mod/url:view","mod/workshop:submit","moodle/competency:planviewown","moodle/competency:planview","moodle/competency:userevidenceview"

Teacher requires the next role capabilities:
VALUES
(1,3,"moodle/badges:viewotherbadges",1,1533143978,0),
(1,3,"moodle/calendar:manageownentries",1,1533143978,0),
(1,3,"moodle/competency:competencyview",1,1533143978,0),
(1,3,"moodle/competency:evidencedelete",1,1533143978,0),
(1,3,"moodle/competency:competencymanage",1,1533143978,0),
(1,3,"moodle/competency:coursecompetencyview",1,1533143978,0),
(1,3,"moodle/category:viewhiddencategories",1,1533143978,0),
(1,3,"moodle/course:view",1,1533143978,0),
(1,3,"moodle/user:update",1,1533143978,0),
(1,3,"moodle/site:deleteownmessage",1,1533143978,0),
(1,3,"moodle/user:editownmessageprofile",1,1533143978,0),
(1,3,"moodle/site:sendmessage",1,1533143978,0),
(1,3,"moodle/user:manageownfiles",1,1533143978,0),
(1,3,"moodle/user:editownprofile",1,1533143978,0),
(1,3,"moodle/user:editprofile",1,1533143978,0),
(1,3,"moodle/user:editmessageprofile",1,1533143978,0),
(1,3,"gradereport/overview:view",1,1533143978,0),
(1,3,"message/airnotifier:managedevice",1,1533143978,0),
(1,3,"mod/feedback:complete",1,1533143978,0),
(1,3,"mod/folder:view",1,1533143978,0),
(1,3,"mod/imscp:view",1,1533143978,0),
(1,3,"mod/label:view",1,1533143978,0),
(1,3,"mod/lesson:view",1,1533143978,0),
(1,3,"mod/page:view",1,1533143978,0),
(1,3,"mod/quiz:attempt",1,1533143978,0),
(1,3,"mod/quiz:reviewmyattempts",1,1533143978,0),
(1,3,"mod/resource:view",1,1533143978,0),
(1,3,"mod/url:view",1,1533143978,0),
(1,3,"mod/workshop:submit",1,1533143978,0),
(1,3,"moodle/competency:planviewown",1,1533143978,0),
(1,3,"moodle/competency:planview",1,1533143978,0),
(1,3,"moodle/competency:userevidenceview",1,1533143978,0),

