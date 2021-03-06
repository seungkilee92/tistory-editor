import * as types from '../constants/ActionTypes'
import { combineReducers } from 'redux'
import status from './status'
import user from './user'
import blogs from './blogs'
import posts from './posts'
import categories from './categories'
import currentBlog from './currentBlog'
import currentPost from './currentPost'
import preferences from './preferences'

export default combineReducers({
	status,
	user,
	blogs,
	currentBlog,
	categories,
	posts,
	currentPost,
	preferences
})
