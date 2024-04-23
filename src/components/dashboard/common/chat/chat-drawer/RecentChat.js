// import node module libraries
import { ListGroup } from 'react-bootstrap';

// import sub custom components
import { Avatar } from '../../../../../components/elements/bootstrap/Avatar';
import AvatarImage from '../../../../../assets/images/avatar/avatar.png';

const RecentChat = (props) => {

    const { usersList, formattedThreadData, chatMessageArray, setChatBoxId, groupChatList } = props;

    const getLastMessage = (thread) => {
        let result = chatMessageArray?.find(({ id }) => id === thread.id);
        return typeof result === 'object' && result.chatMessages.length > 0
            ? result.chatMessages[result.chatMessages.length - 1].message
            : "Let's start chating";
    };

    const getLastMessageTime = (thread) => {
        let result = chatMessageArray?.find(({ id }) => id === thread.messagesId);
        if (typeof result === 'object' && result.chatMessages.length > 0) {
            const curDate = new Date();
            const msgDate = new Date(
                result.chatMessages[result.chatMessages.length - 1].date
            );
            return msgDate.getDate() === curDate.getDate() &&
                msgDate.getMonth() === curDate.getMonth() &&
                msgDate.getFullYear() === curDate.getFullYear()
                ? result.chatMessages[result.chatMessages.length - 1].time
                : result.chatMessages[result.chatMessages.length - 1].date;
        } else {
            return '';
        }
    };

    return (
        <div>
            {formattedThreadData?.map((item, index) => {
                let details =
                    item.type === 'user'
                        ? usersList?.find(({ id }) => id === item.userId)
                        : groupChatList?.find(({ id }) => id === item.groupId);

                if (details !== null) {
                    return (
                        <ListGroup.Item
                            bsPrefix=" "
                            key={index}
                            role="button"
                            className={`py-3 px-3 chat-item contacts-item`}
                            onClick={() => { setChatBoxId(item.id) }}
                        >
                            {item.type === 'user' ? (
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex">
                                        <Avatar
                                            size="md"
                                            className="rounded-circle"
                                            type={details?.image ? 'image' : 'initial'}
                                            src={details?.image || AvatarImage}
                                            status={details?.status.toLowerCase()}
                                            alt={details?.name}
                                            name={details?.name}
                                        />
                                        <div className=" ms-2">
                                            <h5 className="mb-0 fw-bold text-truncate-line"> {details?.name}</h5>
                                            <p
                                                className="mb-0 text-muted text-truncate"
                                                style={{ maxWidth: '145px' }}
                                                dangerouslySetInnerHTML={{ __html: getLastMessage(item) }} />
                                        </div>
                                    </div>

                                </div>
                            ) : (
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex">
                                        <Avatar
                                            size="md"
                                            className="rounded-circle"
                                            type={details?.groupMembers[0].image ? 'image' : 'initial'}
                                            src={details?.groupMembers[0].image || AvatarImage}
                                            status={details?.groupMembers[0].status.toLowerCase()}
                                            alt={details?.groupMembers[0].name}
                                            name={details?.groupMembers[0].name}
                                        />
                                        <div className="position-absolute mt-3 ms-n2">
                                            <Avatar
                                                size="sm"
                                                className="rounded-circle"
                                                type={details?.groupMembers[1].image ? 'image' : 'initial'}
                                                src={details?.groupMembers[1].image || AvatarImage}
                                                alt={details?.groupMembers[1].name}
                                                status={details?.groupMembers[1].status.toLowerCase()}
                                                name={details?.groupMembers[1].name}
                                            />
                                        </div>
                                        <div className=" ms-2">
                                            <h5 className="mb-0 fw-bold"> {details?.name}</h5>
                                            <p
                                                className="mb-0 text-muted text-truncate"
                                                style={{ maxWidth: '145px' }}
                                                dangerouslySetInnerHTML={{ __html: getLastMessage(item) }} />
                                        </div>
                                    </div>
                                    <div>
                                        <small className="text-muted">
                                            {getLastMessageTime(item)}
                                        </small>
                                    </div>
                                </div>
                            )}
                        </ListGroup.Item>
                    );
                }
                return false;
            })}
        </div>
    );
};
export default RecentChat;
