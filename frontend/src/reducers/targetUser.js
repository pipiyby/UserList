const initialState = {
    isFetching: false,
    data: [],
    circleCheck: false,
    err: null,
    editSucceed: false
};

const targetUser = (state = initialState, action) => {
    switch(action.type){
        case 'REQUEST_TARGET_START':
            return {
                ...state,
                isFetching: true,
                circleCheck: false,
                err: null,
                editSucceed: false
            };
        case 'REQUEST_TARGET_SUCCESS':
            return {
                ...state,
                isFetching: false,
                data: action.data,
                circleCheck: false,
                err: null
            };
        case 'REQUEST_TARGET_FAIL':
            return {
                ...state,
                isFetching: false,
                err: action.err
            };
        case 'CIRCLE_CHECK_FAIL':
            return {
                ...state,
                isFetching: false,
                circleCheck: true
            };
        case 'EDIT_SUCCEED':
            return {
                ...state,
                isFetching: false,
                circleCheck: false,
                err: null,
                editSucceed: true
            };
        default:
            return state;
    }
}

export default targetUser;