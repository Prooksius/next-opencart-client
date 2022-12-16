import axios from 'axios'
import { REACT_APP_DB_URL } from '../config'

export const axiosInstance = axios.create({
	baseURL: REACT_APP_DB_URL,
	headers: {
		'Content-Type': 'multipart/form-data',
	},
})

export const axiosPrivateInstance = axios.create({
	baseURL: REACT_APP_DB_URL,
	headers: {
		Authorization: 'Bearer 4wJ_OM44mnxiiJCliYwo7sT8xz3ld-7K',
		'Content-Type': 'multipart/form-data',
	},
	withCredentials: true,
})

export const axiosServerInstance = axios.create({
	baseURL: REACT_APP_DB_URL,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
	},
})

export const axiosServerPrivateInstance = axios.create({
	baseURL: REACT_APP_DB_URL,
	headers: {
		Authorization: 'Bearer 4wJ_OM44mnxiiJCliYwo7sT8xz3ld-7K',
		'Content-Type': 'application/x-www-form-urlencoded',
	},
	withCredentials: true,
})
