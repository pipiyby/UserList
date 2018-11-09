export const setSearchFilter = str => ({
    type: 'SET_SEARCH_FILTER',
    filter: str
});

export const setArrFilter = arr => ({
    type: 'SET_ARR_FILTER',
    arr: arr
});

export const resetFilter = () => ({
    type: 'RESET_FILTER'
});