
export const SubOrgReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'CHANGE_SUBORG':
      localStorage.setItem('subOrg', payload.subOrg); 
      return {
        ...state,
        subOrg : payload.subOrg
      }   
    default:
      return state;
  }
};
