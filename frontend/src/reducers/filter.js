const initialState = {
    type: "",
    search: "",
    arr: []
};
const filter = (state = initialState, action) => {
    switch(action.type){
        case 'SET_SEARCH_FILTER':
            return {
                ...state,
                type: "search",
                search: action.filter,
                arr: []
            };
        case 'SET_ARR_FILTER':
            return {
                ...state,
                type: "arr",
                arr: action.arr
            };
        case 'RESET_FILTER':
            return initialState;
        default:
            return state;
    }
}

export default filter;