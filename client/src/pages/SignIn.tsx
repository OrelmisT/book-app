import  { useEffect } from 'react'
import '../styles/SignIn.css'
import { signIn } from '../utils/auth'
import { useAuth } from '../utils/AuthUserProvider'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import {FcGoogle} from '@react-icons/all-files/fc/FcGoogle'


const SignIn = () => {
    const [searchParams] =  useSearchParams()
    const redirectLink = searchParams.get('redirect-to') || '/home'
    const user = useAuth();
    const location = useLocation();
    const state = location?.state as {searchQuery: string, searchStartIndex: string}
    

    const navigate = useNavigate();

    useEffect(() => {
        //REDIRECT TO HOME PAGE HERE

        if(user.user !== null && user.user !== undefined){
            console.log(redirectLink)
            

            if(state !== null && state !== undefined && state.searchQuery !== null && state.searchQuery !== undefined && state.searchStartIndex !== null && state.searchStartIndex !== undefined){
              navigate(`${redirectLink}?query=${state.searchQuery}&startIndex=${state.searchStartIndex}`)
            }
            else{
              navigate(`${redirectLink}`)
            }
        }
    })

  return (
    <>
    <div className='siteHeader'>
        <h1>The Bookshelf Society</h1>
    </div>

    <img src='https://i.imgur.com/oyFIP3O.png' id='SignInImg'></img>

    <h1 id='desc'>READ. EXPLORE. DISCUSS. JOIN US TODAY:</h1>

    <button onClick={signIn}>Sign In With Google
      <div className='iconDiv'>
         <FcGoogle id={'googleLogo'}/>
        </div>
       </button>
    <h1>{user.user?.email}</h1>
    </>
  )
}

export default SignIn
