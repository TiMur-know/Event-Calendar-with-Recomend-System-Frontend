import Cookies from 'js-cookie';
import {useEffect } from 'react';
import { useNavigate } from 'react-router';

		const setRefreshToken=()=>{
			const serverToken = Cookies.get("token")
			return serverToken
		}
		setTimeout(setRefreshToken,1000)
		const getServerToken=async()=>{
			const serverToken= await setRefreshToken()
			return serverToken
		}

const AuthCheckerHOC=({children}:
	{children:React.ReactNode})=>{
		const navigate=useNavigate()
		const token = Cookies.get("token")
		useEffect(()=>{
			const checkAuth=async()=>{
				const serverToken= await getServerToken()
				if(token!=serverToken){
					navigate("/")
				}
			}
			checkAuth()
		})
return (
	<>{children}</>
)
}
export default AuthCheckerHOC