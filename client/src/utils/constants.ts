export const HOST = import.meta.env.VITE_ASP_URL

export const AUTH_ROUTES = "api/auth"
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`
export const GET_USER_INFO_ROUTE = `${AUTH_ROUTES}/user-info`
export const UPDATE_USER_ROUTE = `${AUTH_ROUTES }/update-user`
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`

export const CONTACTS_ROUTES = "api/contacts"
export const SEARCH_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/search`

export const MESSAGE_ROUTE = "api/message"
export const GET_ALL_MESSAGES_ROUTES = `${MESSAGE_ROUTE}/get-messages`