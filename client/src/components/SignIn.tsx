import  { useEffect } from 'react'
import '../styles/SignIn.css'
import { signIn } from '../utils/auth'
import { useAuth } from '../utils/AuthUserProvider'


const SignIn = (props: {setPage: React.Dispatch<React.SetStateAction<number>>}) => {

    const user = useAuth();

    useEffect(() => {
        if(user.user !== null){
        props.setPage(1)
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
