module.exports = {
	blocked: {
		http_code: 400,
		error: {
			code: -1,
			message: "Summary cant be updated or deleted because it was executed before"
		}
	},
	user_is_not_enroled_in_the_activity: {
		http_code: 400,
		error: {
			code: -1,
			message: "Cant create the summary because the user is not enroled to the activity related to the project"
		}
	},
	test_case_already_solved_for_you: {
		http_code: 400,
		error: {
			code: -1,
			message: "The test case already solved for you"
		}
	},
	teacher_cant_create_summary_for_him_projects: {
		http_code: 202,
		error: {
			code: -1,
			message: "Teacher cant participate in him projects"
		}
	},
	teacher_activity_no_setted: {
		http_code: 400,
		error: {
			code: -1,
			message: "Please set the activity in your project. Login in VPL ++ client, select this project, assing an activity to it and save. Students can't evaluate them activities"
		}
	},
	student_activity_no_setted: {
		http_code: 400,
		error: {
			code: -1,
			message: "Can't save the submission results, project is not related to this activity. Please report it to the teacher, he knows how to resolve it."
		}
	},
}