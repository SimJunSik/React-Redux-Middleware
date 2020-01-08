import { delay, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects';

const INCREASE = 'counter/INCREASE';
const DECREASE = 'counter/DECREASE';
const INCREASE_AYSNC = 'counter/INCREASE_AYSNC';
const DECREASE_AYSNC = 'counter/DECREASE_AYSNC';

export const increase = () => ({ type: INCREASE });
export const decrease = () => ({ type: DECREASE });

// --- redux-thunk ---
// export const increaseAsync = () => (dispatch) => {
//     setTimeout(() => {
//         dispatch(increase());
//     }, 1000);
// };

// export const decreaseAsync = () => (dispatch) => {
//     setTimeout(() => {
//         dispatch(decrease());
//     }, 1000);
// };

// --- redux-saga ---
export const increaseAsync = () => ({ type: INCREASE_AYSNC });
export const decreaseAsync = () => ({ type: DECREASE_AYSNC });

function* increaseSaga(){
    yield delay(1000);
    yield put(increase()); // put은 dispatch와 비슷한 역할
}

function* decreaseSaga(){
    yield delay(1000);
    yield put(decrease());
}

// 어떤 action이 dispatch 됐을 때 어떤 작업을 처리할지 정의
export function* counterSaga(){
    yield takeEvery(INCREASE_AYSNC, increaseSaga);
    yield takeLatest(DECREASE_AYSNC, decreaseSaga); // takeLatest는 가장 마지막에 들어온 것만 처리
    // yield takeLeading(DECREASE_AYSNC, decreaseSaga); // takeLeading은 가장 처음에 들어온 것만 처리
}

const initialState = 0;

export default function counter(state = initialState, action){
    switch(action.type){
        case INCREASE:
            return state + 1;
        case DECREASE:
            return state - 1;
        default:
            return state
    }
}


