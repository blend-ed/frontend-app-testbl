/********************************
Component : Tag Input Control
*********************************

Availalble Parameters

defaulttags  : Optional, here you can pass default tag list like this  defaulttags={["example1@domain.com", "example2@domain.com"]}

*/

// Import required libraries
import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactTagInput from '@pathofdev/react-tag-input';
import { toast } from 'react-toastify';

const GKTagsEmailInput = ({ setEmailData, placeholder, emailData }) => {
	const [tags, setTags] = React.useState(emailData);

	useEffect(() => {
		setEmailData(tags);
	}, [tags])

	return (
		<Fragment>
			<ReactTagInput
				tags={tags}
				placeholder={placeholder}
				maxTags={10}
				editable={true}
				readOnly={false}
				removeOnBackspace={true}
				onChange={(newTags) => {
					setTags(newTags);
				}}
				validator={(value) => {
					const regex =
						/^(([^<>()[\],;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/i;
					let isEmail = regex.test(value);
					if (!isEmail) {
						toast.error('Please enter valid e-mail address.');
					}
					return isEmail;
				}}
			/>
		</Fragment>
	);
};

GKTagsEmailInput.propTypes = {
	defaulttags: PropTypes.array,
	placeholder: PropTypes.string
};

GKTagsEmailInput.defaultProps = {
	defaulttags: [],
	placeholder: 'Type and press enter'
};

export default GKTagsEmailInput;
