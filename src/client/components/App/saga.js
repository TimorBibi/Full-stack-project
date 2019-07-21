import {AppActionsConstants} from './constants'
import { call, put, takeEvery } from 'redux-saga/effects'
import AppActions from './actions'
import RegisterPageActions from "../RegisterPage/actions";

function* checkToken(action){
    console.log('AppSaga=', action);
    try {
        const res = yield call(fetch, action.uri,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

        const json = yield call([res, 'json']); //retrieve body of response
        yield put(AppActions.connectUserAction(json));
    } catch (e) {
        yield put(AppActions.appFailureAction(e.message));
    }
}

function* disconnectUser(action) {
    console.log('AppSaga=', action);
    try {
        const res = yield call(fetch, action.uri,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

        const json = yield call([res, 'json']); //retrieve body of response
        yield put(AppActions.connectUserAction({succeed: false, username: ''}));
    } catch (e) {
        yield put(AppActions.appFailureAction(e.message));
    }
}

function* loadCities(action){
    console.log('AppSaga=', action);
    try {
        const res = yield call(fetch, action.uri,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

        const json = yield call([res, 'json']); //retrieve body of response
        console.log("HEREE111");
        yield put(AppActions.loadCitiesSuccessAction(json));
        console.log("HEREE222");

    } catch (e) {
        yield put(AppActions.appFailureAction(e.message));
    }
}

function* AppSaga() {
    //using takeEvery, you take the action away from reducer to saga
    yield takeEvery(AppActionsConstants.CHECK_TOKEN, checkToken);
    yield takeEvery(AppActionsConstants.DISCONNECT_USER, disconnectUser);
    yield takeEvery(AppActionsConstants.LOAD_CITIES, loadCities);
}

export default AppSaga;
