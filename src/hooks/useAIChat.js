import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { SubOrgContext } from "../context/Context";
import { useContext, useEffect, useState } from "react";

const AI_CHAT_HISTORY = gql`
subscription AIChatHistory($_eq: uuid = "") {
	ai_chat(limit: 10, order_by: {timestamp: desc}, where: {user_id: {_eq: $_eq}}) {
	  ai_message
	  message
	}
  }
`;

const GET_SUB_ORG_ID = gql`
query getSubOrgId($_eq: String = "") {
  sub_org(where: {name: {_eq: $_eq}}) {
    id
  }
}
`;

const SEND_AI_MESSAGE = gql`
mutation sendAIMessage($message: String = "", $user_id: uuid = "", $ai_message: Boolean = false, $sub_org_id: uuid = "", $hidden: Boolean) {
    insert_ai_chat_one(object: {message: $message, user_id: $user_id, ai_message: $ai_message, sub_org_id: $sub_org_id, hidden: $hidden}) {
      id
    }
  }  
`;

const AI_CHATBOT = gql`
mutation aiMessage($attendance: String = "", $history: jsonb = "", $user_details: String = "", $user_message: String = "", $program_details: String = "") {
	aiChatbot(attendance: $attendance, history: $history, user_details: $user_details, user_message: $user_message, program_details: $program_details) {
	  bot_message
	  err_msg
	}
  }
`;

const STREAK_DATA = gql`
subscription data($_eq: uuid = "", $sub_org: String = "") {
    streaks(where: {user_id: {_eq: $_eq}, sub_org: {name: {_eq: $sub_org}}}) {
      current_streak
      last_streak
      updated_at
    }
  }
`;

const USER_PROGRAM_DETAILS = gql`
query userProgramEnrollments($_eq: uuid = "", $sub_org_name: String = "") {
	program_enrollment(where: {user_id: {_eq: $_eq}, program: {sub_org: {name: {_eq: $sub_org_name}}}}) {
	  program {
		category
		program_achieved
		program_brief
		title
		start_date
		publish
	  }
	}
  }
`; 

const useAIChat = () => {
    const ConfigContext = useContext(SubOrgContext)
	const sub_org_name = 'localhost'

    const { user } = useAuth0();

    const [history, setHistory] = useState([]);
    const [sub_org_id, setSubOrgId] = useState('');
    const [streakFormattedData, setStreakFormattedData] = useState('');

    const [sendAIMessageMutation] = useMutation(SEND_AI_MESSAGE);
	const [aiChatbotMutation] = useMutation(AI_CHATBOT);

    const {data: aiChatHistory} = useSubscription(AI_CHAT_HISTORY, {
		variables: { _eq: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'] }
	})

    const { data: subOrgIdData } = useQuery(GET_SUB_ORG_ID, {
		variables: {
		  _eq: sub_org_name
		},
		onError: (error) => { console.log(error) }  
	  });

      const { data: streakData } = useSubscription(STREAK_DATA, {
        variables: {
            _eq: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
            sub_org: sub_org_name
        },
        onError: (error) => {
            console.log(error)
        }
    });

    const {data: programDetails} = useQuery(USER_PROGRAM_DETAILS, {
		variables: { _eq: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'], sub_org_name: sub_org_name }
	})

      useEffect(() => {
		const history = []
		if (aiChatHistory) {
			aiChatHistory.ai_chat.map((item) => {
				if (item.ai_message) {
					history.push({'output': item.message})
				} else {
					history.push({'input': item.message})
				}
			})
			setHistory(history.reverse())
            console.log(history)
		}
	}, [aiChatHistory])

    useEffect(() => {
        if (subOrgIdData) {
            setSubOrgId(subOrgIdData.sub_org[0]?.id)
        }
    }, [subOrgIdData])

    useEffect(() => {
		if (streakData && streakData.streaks.length > 0) {
			let formattedData = ''
			if (streakData.streaks[0].last_streak === streakData.streaks[0].current_streak) {
				formattedData = 'Streak on going very well! \n'
			} else {
				formattedData = 'Streak broken \n'
			}
			if (streakData.streaks[0].updated_at === new Date().toISOString().split('T')[0]) {
				formattedData += 'Student was active today \n'
			} else {
				formattedData += 'Student was not active today \n'
			}
			if (streakData.streaks[0].updated_at < new Date().toISOString().split('T')[0]) {
				formattedData += 'Student has been absent for a while'
			}
			// show the count of streak too
			formattedData += `Last Streak: ${streakData.streaks[0].last_streak} \\ Current Streak: ${streakData.streaks[0].current_streak}`
			setStreakFormattedData(formattedData)
		}
	}, [streakData])

    let programDetailsString = '';
	if (programDetails && programDetails.program_enrollment) {
		programDetails.program_enrollment.forEach((programEnrollment, index) => {
			programDetailsString += `Program ${index + 1}:\n`;
			programDetailsString += `Title: ${programEnrollment.program.title}\n`;
			programDetailsString += `Category: ${programEnrollment.program.category}\n`;
			programDetailsString += `Brief: ${programEnrollment.program.program_brief}\n`;
			programDetailsString += `Start Date: ${programEnrollment.program.start_date}\n`;
			programDetailsString += `Publish: ${programEnrollment.program.publish ? 'Yes' : 'No'}\n\n`;
		});
	}

    return {history, sendAIMessageMutation, aiChatbotMutation, sub_org_id, streakData, programDetailsString, streakFormattedData};
}

export default useAIChat;