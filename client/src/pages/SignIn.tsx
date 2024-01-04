import  { useEffect } from 'react'
import '../styles/SignIn.css'
import { signIn } from '../utils/auth'
import { useAuth } from '../utils/AuthUserProvider'
import { useNavigate, useSearchParams } from 'react-router-dom'


const SignIn = () => {
    const [searchParams] =  useSearchParams()
    const redirectLink = searchParams.get('redirect-to') || '/home'
    const user = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        //REDIRECT TO HOME PAGE HERE

        if(user.user !== null && user.user !== undefined){
            navigate(`${redirectLink}`)
        }
    })

  return (
    <>
    <div className='siteHeader'>
        <h1>The Bookshelf Society</h1>
    </div>

    <img src='https://i.imgur.com/oyFIP3O.png' id='SignInImg'></img>

    <h1 id='desc'>READ. EXPLORE. DISCUSS. JOIN US TODAY:</h1>

    <button onClick={signIn}>Sign In With Google</button>
    <h1>{user.user?.email}</h1>
    </>
  )
}

export default SignIn
