// import node module libraries
import React, { useState } from 'react';
import { Form} from 'react-bootstrap';
import { useAsyncDebounce } from 'react-table';
import FormSelect from '../form-select/FormSelect';

const GlobalFilterSP = ({ filter, setFilter, placeholder, options, selectedCourseId }) => {
	const [value, setValue] = useState(filter);
	const onChange = useAsyncDebounce((value) => {
		setFilter(value || undefined);
	}, 1000);
	return (
		<Form.Control
			as={FormSelect}
			placeholder={placeholder}
            defaultValue={selectedCourseId}
			options={options}
			onChange={(e) => {
				setValue(e.target.value);
				onChange(e.target.value);
			}}
		/>
	);
};

export default GlobalFilterSP;
