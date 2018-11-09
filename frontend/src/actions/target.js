const axios = require('axios');

export const request_start = () => ({
    type: 'REQUEST_TARGET_START'
});

export const request_success = response => ({
    type: 'REQUEST_TARGET_SUCCESS',
    data: response.data
});

export const request_fail = err => ({
    type: 'REQUEST_TARGET_FAIL',
    err: err
});

export const circleDetected = () => ({
    type: 'CIRCLE_CHECK_FAIL'
});

export const editSucceed = () => ({
    type: 'EDIT_SUCCEED'
});

export const getTarget = id => {
    console.log("get: " + id);
    return (dispatch, store) => {
        dispatch(request_start());
        axios({
            method: 'get',
            url: `/api/employees/${id}`
        }).then(response => {
            dispatch(request_success(response));
        }).catch(err => {
            dispatch(request_fail(err));
        });
    }
}

export const modifyTarget = (id, name, title, sex, start_date, office_phone, cell, sms, email, manager, avatar) => {
    return (dispatch, store) => {
        dispatch(request_start());
        console.log(`"${manager}"`);
        let tmp = new FormData();
        tmp.set('name', name);
        tmp.set('title', title);
        tmp.set('sex', sex);
        tmp.set('start_date', start_date);
        tmp.set('office_phone', office_phone);
        tmp.set('cell', cell);
        tmp.set('sms', sms);
        tmp.set('email', email);
        tmp.set('manager', manager);
        tmp.append('avatar', avatar);
        axios({
            method: 'put',
            url: `/api/employees/${id}`,
            data: tmp,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
        }).then(response => {
            if(response.data.circle === true){
                dispatch(circleDetected());
            } else {
                dispatch(editSucceed());
            }
        }).catch(err => {
            dispatch(request_fail(err));
        });
    }
}