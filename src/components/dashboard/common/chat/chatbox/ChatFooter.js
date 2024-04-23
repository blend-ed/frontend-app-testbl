import SendMessage from './SendMessage';

const ChatFooter = ({history, programDetails, drawer, chatBoxId, aiChatName, streakFormattedData}) => {

	return (
		<div className={`bg-light ${drawer ? 'p-1' : 'px-lg-4 px-2'} chat-footer`}>
			<SendMessage drawer chatBoxId={chatBoxId} history={history} programDetails={programDetails} aiChatName={aiChatName} streakFormattedData={streakFormattedData} />
		</div>
	);
};
export default ChatFooter;
