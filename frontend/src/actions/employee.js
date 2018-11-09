const axios = require('axios');

export const request_start = () => ({
    type: 'REQUEST_EMPLOYEES_START'
});

export const request_success = response => ({
    type: 'REQUEST_EMPLOYEES_SUCCESS',
    data: response.data
});

export const request_fail = err => ({
    type: 'REQUEST_EMPLOYEES_FAIL',
    err: err
});

export const request_finish = () => ({
    type: 'REQUEST_EMPLOYEES_FINISH'
});

export const getAllEmployees = () => {
    return (dispatch, store) => {
        dispatch(request_start());
        axios({
            method: 'get',
            url: '/api/employees'
        }).then(response => {
            dispatch(request_success(response));
        }).catch(err => {
            dispatch(request_fail(err));
        });
    }
}

export const addEmployee = (name, title, sex, start_date, office_phone, cell, sms, email, manager, avatar) => {
    return (dispatch, store) => {
        dispatch(request_start());
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
            method: 'post',
            url: '/api/employees',
            data: tmp,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
        }).then(response => {
            dispatch(request_finish());
        }).catch(err => {
            dispatch(request_fail(err));
        });
    }
}

export const deleteEmployee = id => {
    return (dispatch, store) => {
        dispatch(request_start());
        axios({
            method: 'delete',
            url: `/api/employees/${id}`
        }).then(response => {
            dispatch(request_success(response));
        }).catch(err => {
            dispatch(request_fail(err));
        });
    }
}