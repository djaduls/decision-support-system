import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
  SUBMIT_NEW_MODEL_REQUEST,
  DELETE_MODEL_REQUEST,
  PUBLISH_MODEL_REQUEST,
  UPDATE_CURRICULUM_REQUEST,
} from '../actions';
import {
  sumbitModelSuccess,
  sumbitModelError,
  deleteModelSuccess,
  deleteModelError,
  publishModelSuccess,
  publishModelError,
  updateCurriculumSuccess,
  updateCurriculumError,
} from './actions';
import {
  sumbitModelService,
  deleteModelService,
  publishModelService,
  updateCurriculumService,
} from './services';

function* submitModelSaga({ payload }) {
  try {
    const response = yield call(sumbitModelService, payload);
    const { callBack } = payload;
    if (callBack) {
      callBack(response);
    }
    yield put(sumbitModelSuccess(response));
  } catch (error) {
    yield put(sumbitModelError(error));
  }
}

function* deleteModelSaga({ payload }) {
  const { ids } = payload;
  try {
    const response = yield call(deleteModelService, ids);
    const { callBack } = payload;
    if (callBack) {
      callBack(response);
    }
    yield put(deleteModelSuccess(response));
  } catch (error) {
    yield put(deleteModelError(error));
  }
}

function* publishModelSaga({ payload }) {
  const { id, type } = payload;
  try {
    const response = yield call(publishModelService, id, type);
    const { callBack } = payload;
    if (callBack) {
      callBack(response);
    }
    yield put(publishModelSuccess(response));
  } catch (error) {
    yield put(publishModelError(error));
  }
}

function* updateCurriculumSaga({ payload }) {
  const { title, fileUrl } = payload;
  try {
    const response = yield call(updateCurriculumService, title, fileUrl);
    const { callBack } = payload;
    if (callBack) {
      callBack(response);
    }
    yield put(updateCurriculumSuccess(response));
  } catch (error) {
    yield put(updateCurriculumError(error));
  }
}

export function* watchSubmitModelSaga() {
  yield takeEvery(SUBMIT_NEW_MODEL_REQUEST, submitModelSaga);
}

export function* watchDeleteModelSaga() {
  yield takeEvery(DELETE_MODEL_REQUEST, deleteModelSaga);
}

export function* watchPublishModelSaga() {
  yield takeEvery(PUBLISH_MODEL_REQUEST, publishModelSaga);
}

export function* watchUpdateCurriculumSaga() {
  yield takeEvery(UPDATE_CURRICULUM_REQUEST, updateCurriculumSaga);
}

export default function* rootSaga() {
  yield all([fork(watchSubmitModelSaga)]);
  yield all([fork(watchDeleteModelSaga)]);
  yield all([fork(watchPublishModelSaga)]);
  yield all([fork(watchUpdateCurriculumSaga)]);
}
