const initialState = {
    isFetching: false,
    data: [],
    err: null
};

const users = (state = initialState, action) => {
    switch(action.type){
        case 'REQUEST_EMPLOYEES_START':
            return {
                ...state,
                isFetching: true,
                err: null
            };
        case 'REQUEST_EMPLOYEES_FINISH':
            return {
                ...state,
                isFetching: false,
            };
        case 'REQUEST_EMPLOYEES_SUCCESS':
            return {
                ...state,
                isFetching: false,
                data: action.data,
                err: null
            };
        case 'REQUEST_EMPLOYEES_FAIL':
            return {
                ...state,
                isFetching: false,
                err: action.err
            };
        default:
            return state;
    }
}

export default users;