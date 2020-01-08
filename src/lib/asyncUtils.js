import { call, put} from 'redux-saga/effects';

export const createPromiseSaga = (type, promiseCreator) => {
    const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
    return function* saga(action){
        try {
            const result = yield call(promiseCreator, action.payload);
            yield put({
                type: SUCCESS,
                payload: result
            });
        } catch(e) {
            yield put({
                type: ERROR,
                error: true,
                payload: e
            })
        }
    }
};

export const createPromiseSagaById = (type, promiseCreator) => {
    const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
    return function* saga(action){
        const id = action.meta;
        try {
            const result = yield call(promiseCreator, action.payload);
            yield put({
                type: SUCCESS,
                payload: result,
                meta: id
            });
        } catch(e) {
            yield put({
                type: ERROR,
                error: true,
                payload: e,
                meta: id
            });
        }
    }
}


export const createPromiseThunk = (type, promiseCreator) => {
    const [SUCCESS, ERROR] = [`${type}_SUCCESS`,`${type}_ERROR`];

    const thunkCreator = param => async dispatch => {
        // 요청이 시작됨
        dispatch({ type });
        // API 호출
        try {
            const payload = await promiseCreator(param);
            // 성공했을 때
            dispatch({ 
                type: SUCCESS, 
                payload
            });
        } catch(e) {
            // 실패했을 때
            dispatch({ 
                type: ERROR, 
                payload: e,
                error: true
            });
        }
    }

    return thunkCreator;
};

const defaultIdSelector = param => param;

export const createPromiseThunkById = (type, promiseCreator, idSelector = defaultIdSelector) => {
    const [SUCCESS, ERROR] = [`${type}_SUCCESS`,`${type}_ERROR`];

    const thunkCreator = param => async dispatch => {
        const id = idSelector(param);
        // 요청이 시작됨
        dispatch({ type, meta: id });
        // API 호출
        try {
            const payload = await promiseCreator(param);
            // 성공했을 때
            dispatch({ 
                type: SUCCESS, 
                payload,
                meta: id
            });
        } catch(e) {
            // 실패했을 때
            dispatch({ 
                type: ERROR, 
                payload: e,
                error: true,
                meta: id
            });
        }
    }

    return thunkCreator;
}

export const handleAsyncActions = (type, key, keepData) => {
    const [SUCCESS, ERROR] = [`${type}_SUCCESS`,`${type}_ERROR`];
    const reducer = (state, action) => {
        switch(action.type){
            case type:
                return {
                    ...state,
                    [key]: reducerUtils.loading(keepData ? state[key].data : null)
                };
            case SUCCESS:
                return {
                    ...state,
                    [key]: reducerUtils.success(action.payload)
                };
            case ERROR:
                return {
                    ...state,
                    [key]: reducerUtils.error(action.error)
                };
            default:
                return state;
        }
    }

    return reducer;
}

export const handleAsyncActionsById = (type, key, keepData) => {
    const [SUCCESS, ERROR] = [`${type}_SUCCESS`,`${type}_ERROR`];
    const reducer = (state, action) => {
        const id = action.meta;
        switch(action.type){
            case type:
                return {
                    ...state,
                    [key]: {
                        ...state[key],
                        [id]: reducerUtils.loading(keepData ? 
                            (state[key][id] && state[key][id].data) 
                            : null)
                    }
                };
            case SUCCESS:
                return {
                    ...state,
                    [key]: {
                        ...state[key],
                        [id] : reducerUtils.success(action.payload)
                    }
                };
            case ERROR:
                return {
                    ...state,
                    [key]: {
                        ...state[key],
                        [id] : reducerUtils.error(action.payload)
                    }
                };
            default:
                return state;
        }
    }

    return reducer;
}

export const reducerUtils = {
    initial: (data = null) => ({
        data,
        loading: false,
        error: null
    }),
    loading: (prevState = null) => ({
        data: prevState,
        loading: true,
        error: null
    }),
    success: (data) => ({
        data,
        loading: false,
        error: null,
    }),
    error: (error) => ({
        data: null,
        loading: false,
        error
    })
};