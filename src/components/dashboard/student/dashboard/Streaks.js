import { gql, useQuery, useSubscription } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import Tippy from "@tippyjs/react";
import { SubOrgContext } from "../../../../context/Context";
import useAIChat from "../../../../hooks/useAIChat";
import { useContext, useEffect, useState } from "react";
import { Card, Modal } from "react-bootstrap"
import { useMediaQuery } from "react-responsive";

const GET_ENGAGEMENT_DATA = gql`
	query getDailyEnagagment($org_url: String = "", $sub_org: String = "", $user_id: uuid = "") {
		dailyEngagment(org_url: $org_url, sub_org: $sub_org, user_id: $user_id) {
			dailyengagement
            err_msg
		}
	}
`;

export const Streaks = ({ show, setShow, setCount }) => {
    const { user } = useAuth0();
    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'
    const currentDay = new Date().getDay();

    const {history, sendAIMessageMutation, aiChatbotMutation, sub_org_id, streakData, programDetailsString, streakFormattedData} = useAIChat();

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const [WeeklyEngageData, setWeeklyEngageData] = useState([0, 0, 0, 0, 0, 0, 0])

    const {data: engagementData } = useQuery(GET_ENGAGEMENT_DATA, {
        variables: {
            org_url: window.location.origin,
            sub_org: sub_org_name,
            user_id: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"]
        },
        onError: (error) => {
            console.log(error)
        }
    })

    useEffect(() => {
        if (engagementData && engagementData.dailyEngagment) {
            setWeeklyEngageData(engagementData.dailyEngagment.dailyengagement)
        }
    }, [engagementData])

    useEffect(() => {
        if (streakData && streakData?.streaks[0]?.current_streak && history.length > 0) {
            const streakAppreciationSend = history?.filter((item) => item["input"] === `Hey, I got ${streakData?.streaks[0]?.current_streak} days streak!`)
            if (streakData?.streaks[0]?.current_streak === 7 && streakAppreciationSend.length === 0) {
                console.log('Sending AI Message')
                sendAIMessageMutation({
                    variables: {
                        message: `Hey, I got ${streakData?.streaks[0]?.current_streak} days streak!`,
                        user_id: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
                        sub_org_id: sub_org_id,
                        hidden: true
                    },
                    onCompleted: () => {
                        aiChatbotMutation({
                            variables: {
                                attendance: `${streakFormattedData}`,
                                history: history,
                                user_details: `${user?.['name']}`,
                                user_message: `Hey, I got ${streakData?.streaks[0]?.current_streak} days streak!`,
                                program_details: programDetailsString,
                            },
                            onCompleted: (data) => {
                                console.log('AI Chatbot response received:', data.aiChatbot.bot_message)
                                sendAIMessageMutation({
                                    variables: {
                                        message: data.aiChatbot.bot_message,
                                        user_id: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
                                        sub_org_id: sub_org_id,
                                        ai_message: true,
                                        hidden: false
                                    },
                                });
                                setCount(streakData?.streaks[0]?.current_streak)
                            }
                        });
                        setCount(streakData?.streaks[0]?.current_streak)
                    }
                });
            } else {
                setCount(streakData?.streaks[0]?.current_streak)
            }
        }
    }, [streakData, history])

    const weekday = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const StreaksSoul = () => (
        <div className="text-center mx-lg-4 mt-lg-n3 mt-n1">
            <h1 className="display-2 text-primary mb-0">
                {streakData?.streaks[0]?.current_streak || 0}
            </h1>
            <p className="text-tertiary fs-4 fw-semi-bold">
                Days Streak!
            </p>
            <div className="d-flex justify-content-between">
                {WeeklyEngageData?.map((item, index) => (
                    <div key={index}>
                        <h5 className={`${currentDay === index ? 'bg-primary rounded text-white py-0 px-1' : 'text-muted'}`}>
                            {weekday[index]}
                        </h5>
                        <div key={index} className={`fa-solid fa-${item ? 'circle-check text-tertiary' : 'circle text-gray'} display-6`} />
                    </div>
                ))}
            </div>
        </div>
    )
    if (!isMobile) {
    return (
        <Card className="mb-5">
            <div className="text-end pt-3 pe-3 pb-0">
                <Tippy content={"Your streak will reset, if you don't practice tomorrow"} animation={'scale'} interactive={true} placement='left' arrow={false} theme='light' className='text-primary bg-white shadow fs-6 text-center'>
                    <span className="fe fe-info fs-5 text-primary" />
                </Tippy>
            </div>
            <Card.Body className="pt-0">
                <StreaksSoul />
            </Card.Body>
        </Card>
    )
    } else {
        return (
            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Body>
                    <StreaksSoul />
                </Modal.Body>
            </Modal>
        )
    }
}