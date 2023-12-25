import React, { createContext, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import AuthUserProvider from './utils/AuthUserProvider.tsx'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import SignIn from './pages/SignIn.tsx'
import RouterRedirect from './pages/RouterRedirect.tsx'
import UserInterface from './components/UserInterface.tsx'
import { profile } from './types.tsx'
import Home from './components/Home.tsx'
import Profile from './components/Profile.tsx'
import ReadingList from './components/ReadingList.tsx'
import Search from './components/Search.tsx'
import PostDetailedView from './pages/PostDetailedView.tsx';
import PageNotFound from './pages/PageNotFound.tsx';

export const ProfileContext = createContext<|[profile, React.Dispatch<React.SetStateAction<profile>>]>([{} as profile, (e) => {e}]);

const AppRoot = () => {

  const [profile, updateProfile] = useState({} as profile);



  return(
    <React.StrictMode>
      <AuthUserProvider>
        <ProfileContext.Provider value= {[profile, updateProfile]}>

          <BrowserRouter>
            <Routes>
              <Route path="/" element={(<RouterRedirect/>)}/>
              <Route path="/*" element = {<PageNotFound/>} />
              
              <Route path="/home" element = {<UserInterface/>}>
                <Route index element = {<Home/>} />
                <Route path ="profile" element = {<Profile/>} />
                <Route path = "reading-list" element = {<ReadingList/>} />
                <Route path = "search" element = {<Search/>} />
                <Route path = "posts/:postId" element = {<PostDetailedView></PostDetailedView>} />
              </Route>
              
              <Route path="/login" element = {<SignIn/>} />
              <Route path="/info" element = {<h1>This is the INFO page!!! :D</h1>} />   
            </Routes>
          </BrowserRouter>
        </ProfileContext.Provider>
      </AuthUserProvider>
  </React.StrictMode>
  )


}


ReactDOM.createRoot(document.getElementById('root')!).render(<AppRoot />)
