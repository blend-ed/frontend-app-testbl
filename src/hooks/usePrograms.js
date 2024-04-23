import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { SubOrgContext } from "../context/Context";
import { useContext, useEffect, useState } from "react";

// Student Dashboard

const GET_ENROLLED_PROGRAMS = gql`
    query getEnrolledPrograms($user_id: uuid = "", $sub_org_name: String = "", $domain: String = "") {
        program_enrollment(where: {user_id: {_eq: $user_id}, program: {sub_org: {name: {_eq: $sub_org_name}, organisation: {domain: {_eq: $domain}}}}}) {
            program {
                id
                title
                program_brief
                est_time_completion
                created_at
                created_by
                sub_org_id
                updated_at
                next_f2f
                price
                discount
                category
                program_card_image
            }
        }
    }      
`;

const GET_ENROLLED_COURSES = gql`
    query getEnrolledCourses($program_ids: [uuid]) {
        course(where: {programs: {program_id: {_in: $program_ids}}}) {
            id
            name
            openedx_id
            course_image
            duration
        }
    }
`;

const GET_DISCOVER_PROGRAMS = gql`
    query getDiscoverPrograms($programIds: [uuid!], $domain: String = "", $sub_org_name: String) {
        program(where: {publish: {_eq: "true"}, id: {_nin: $programIds}, sub_org: {name: {_eq: $sub_org_name}, organisation: {domain: {_eq: $domain}}}}, order_by: {program_enrollments_aggregate: {count: desc}}) {
            id
            title
            program_brief
            est_time_completion
            created_at
            created_by
            sub_org_id
            updated_at
            next_f2f
            price
            discount
            category
            program_card_image
            program_enrollments_aggregate {
                aggregate {
                count
                }
            }
        }
    }  
`;

const GET_PROGRAM_DETAILS = gql`
    query getProgramDetails($program_id: uuid) {
        program_course(where: { program: { id: { _eq: $program_id } } }) {
            course {
                id
                name
                number
                openedx_id
            }
        }
        program(where: { id: { _eq: $program_id } }) {
            est_time_completion
            id
            price
            program_brief
            title
            program_achieved
            about_program
            discount
            category
            program_card_image
            invite_only
            publish
            program_enrollments_aggregate {
                aggregate {
                    count
                }
            }
        }
    }
`;

const PROGRAM_ENROLL = gql`
    mutation programEnroll($program_id: uuid!, $role: String!, $user_id: String!, $org_url: String) {
        enrollForProgram(program_id: $program_id, role: $role, user_id: $user_id, org_url: $org_url) {
            program_id
            role
            user_id
            err_msg
            success
        }
    }  
`;


// Instructor Dashboard

const GET_INSTRUCTOR_PROGRAMS = gql`
    query getInstructorPrograms($domain: String = "", $sub_org_name: String) {
        program(where: {sub_org:{name: {_eq: $sub_org_name}, organisation: {domain: {_eq: $domain}}}}) {
            id
            created_at
            created_by
            est_time_completion
            sub_org_id
            next_f2f
            program_brief
            title
            updated_at
            publish
            program_card_image
            category
        }
    }
`;

const GET_INSTRUCTOR_COURSES = gql`
    query getInstructorCourses($sub_org_name: String = "", $domain: String = "") {
        course(where: {sub_org: {name: {_eq: $sub_org_name}, organisation: {domain: {_eq: $domain}}}}) {
            course_image
            duration
            name
            openedx_id
            number
        }
    }      
`;

const REFETCH_INSTRUCTOR_COURSES = gql`
    query fetchCourse($org_url: String, $created_by: uuid, $username: String) {
        getCourses(org_url: $org_url, created_by: $created_by, username: $username) {
            message
        }
    }
`;

const CREATE_PROGRAM = gql`
	mutation createProgram($category: String = "", $program_card_image: String = "", $program_brief: String = "", $title: String!, $est_time_completion: String!, $discount: String = "", $created_by: uuid, $price: String!, $about_program: String = "", $program_achieved: String = "", $sub_org_id: uuid = "", $invite_only: Boolean = False) {
		insert_program(objects: {category: $category, program_card_image: $program_card_image, program_brief: $program_brief, title: $title, est_time_completion: $est_time_completion, discount: $discount, created_by: $created_by, price: $price, about_program: $about_program, program_achieved: $program_achieved, sub_org_id: $sub_org_id, invite_only: $invite_only}) {
			returning {
				id
			}
		}
	}
`;

const UPDATE_PROGRAM = gql`
    mutation updateProgram($category: String, $program_card_image: String, $_eq: uuid!, $program_brief: String, $price: String, $title: String, $est_time_completion: String, $discount: String, $program_achieved: String, $about_program: String, $invite_only: Boolean = False) {
        update_program(where: {id: {_eq: $_eq}}, _set: {program_brief: $program_brief, price: $price, title: $title, est_time_completion: $est_time_completion, discount: $discount, program_achieved: $program_achieved, about_program: $about_program, program_card_image: $program_card_image, category: $category, invite_only: $invite_only}) {
            affected_rows
        }
    }
`;  

const usePrograms = (program_id) => {

    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    const { user } = useAuth0();
    const isAdmin = user?.["https://hasura.io/jwt/claims"]["sub_org_roles"][sub_org_name]?.includes('super_admin')


    // Enrolled Programs
    const { loading: enrolledProgramsLoading, error: enrolledProgramsError, data: enrolledPrograms, refetch: enrolledProgramsRefetch } = useQuery(GET_ENROLLED_PROGRAMS, {
        variables: { 
            user_id: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'],
            sub_org_name: sub_org_name,
            domain: window.location.origin
        },
        fetchPolicy: 'no-cache'
    });


    const [enrolledProgramIds, setEnrolledProgramIds] = useState([]);

    useEffect(() => {
        if (enrolledPrograms) {
            setEnrolledProgramIds(enrolledPrograms.program_enrollment.map(e => e.program.id));
        }
    }, [enrolledPrograms])


    // Enrolled Courses
    const { loading: enrolledCoursesLoading, error: enrolledCoursesError, data: enrolledCourses, refetch: enrolledCoursesRefetch } = useQuery(GET_ENROLLED_COURSES, {
        variables: { program_ids: enrolledProgramIds },
        fetchPolicy: 'no-cache'
    });


    // Discover Programs
    const { loading: discoverProgramsLoading, error: discoverProgramsError, data: discoverPrograms } = useQuery(GET_DISCOVER_PROGRAMS, {
        variables: { programIds: enrolledProgramIds, domain: window.location.origin, sub_org_name: sub_org_name },
        fetchPolicy: 'no-cache'
    });


    // Program Details
    const { loading: programDetailsLoading, error: programDetailsError, data: programDetails, refetch: programDetailsRefetch } = useQuery(GET_PROGRAM_DETAILS, {
        variables: { program_id: program_id }
    });


    // Enroll Program
    const [programEnroll, { loading: programEnrollLoading }] = useMutation(PROGRAM_ENROLL);


    // Instructor Programs
    const { data: instructorPrograms, loading: instructorProgramsLoading, error: instructorProgramsError, refetch: instructorProgramsRefetch } = useQuery(GET_INSTRUCTOR_PROGRAMS, {
        variables: { domain: window.location.origin, sub_org_name: sub_org_name },
        fetchPolicy: 'no-cache'
    });
    

    // Instructor Courses
    const { data: instructorCourses, loading: instructorCoursesLoading, error: instructorCoursesError, refetch: instructorCoursesRefetch } = useQuery(GET_INSTRUCTOR_COURSES, {
        variables: { domain: window.location.origin, sub_org_name: sub_org_name },
        fetchPolicy: 'no-cache'
    });


    // Refresh Instructor Courses
    const [refetchInstructorCourses, {loading: refetchInstructorCoursesLoading}] = useLazyQuery(REFETCH_INSTRUCTOR_COURSES, {
        variables: {
            org_url: window.location.origin,
            created_by: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'],
            username: user?.['https://hasura.io/jwt/claims']['openedx_username']
        },
        onCompleted: () => {
            instructorCoursesRefetch();
        }
    });


    // Create Program
    const [createProgram] = useMutation(CREATE_PROGRAM, {
        context: {
            headers: {
                'x-hasura-role': isAdmin ? 'super_admin' : 'program_admin'
            }
        }
    });


    // Update Program
    const [updateProgram] = useMutation(UPDATE_PROGRAM, {
        context: {
            headers: {
                'x-hasura-role': isAdmin ? 'super_admin' : 'program_admin'
            }
        }
    });


    return {
        enrolledPrograms,
        enrolledProgramsLoading,
        enrolledProgramsRefetch,
        enrolledCourses,
        enrolledCoursesLoading,
        enrolledCoursesRefetch,
        discoverPrograms,
        discoverProgramsLoading,
        programDetails,
        programDetailsLoading,
        programDetailsRefetch,
        programEnroll,
        programEnrollLoading,
        instructorPrograms,
        instructorProgramsLoading,
        instructorProgramsRefetch,
        instructorCourses,
        instructorCoursesLoading,
        instructorCoursesRefetch,
        refetchInstructorCourses,
        refetchInstructorCoursesLoading,
        createProgram,
        updateProgram
    }
}

export default usePrograms;
