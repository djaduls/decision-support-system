import {
  SUBMIT_NEW_MODEL_REQUEST,
  SUBMIT_NEW_MODEL_SUCCESS,
  SUBMIT_NEW_MODEL_ERROR,
  DELETE_MODEL_REQUEST,
  DELETE_MODEL_SUCCESS,
  DELETE_MODEL_ERROR,
  PUBLISH_MODEL_REQUEST,
  PUBLISH_MODEL_SUCCESS,
  PUBLISH_MODEL_ERROR,
  UPDATE_CURRICULUM_REQUEST,
  UPDATE_CURRICULUM_SUCCESS,
  UPDATE_CURRICULUM_ERROR,
} from '../actions';

const INIT_STATE = {
  data: [],
  error: null,
  isLoading: false,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SUBMIT_NEW_MODEL_REQUEST:
    case DELETE_MODEL_REQUEST:
    case PUBLISH_MODEL_REQUEST:
    case UPDATE_CURRICULUM_REQUEST:
      return { ...state, isLoading: true, error: '' };
    case SUBMIT_NEW_MODEL_SUCCESS:
    case DELETE_MODEL_SUCCESS:
    case PUBLISH_MODEL_SUCCESS:
    case UPDATE_CURRICULUM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case SUBMIT_NEW_MODEL_ERROR:
    case DELETE_MODEL_ERROR:
    case PUBLISH_MODEL_ERROR:
    case UPDATE_CURRICULUM_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isLogin: false,
      };

    default:
      return { ...state };
  }
};
