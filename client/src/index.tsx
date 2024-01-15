import React, { createContext, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import AuthUserProvider from './utils/AuthUserProvider.tsx'
import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom';
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
import BookDetailedView from './pages/BookDetailedView.tsx';
import {QueryClient, QueryClientProvider} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'
import Settings from './pages/Settings.tsx';
import Messages from './pages/Messages.tsx';
import Saved from './pages/Saved.tsx';
import Following from './pages/Following.tsx';


export const ProfileContext = createContext<|[profile, React.Dispatch<React.SetStateAction<profile>>]>([{} as profile, (e) => {e}]);


//fin
const queryClient = new QueryClient()


const AppRoot = () => {

  const [profile, updateProfile] = useState({} as profile);

  const router = createBrowserRouter(createRoutesFromElements(
    <>
            <Route path="/*" element = {<PageNotFound/>} />
            <Route path="/" element={(<RouterRedirect/>)}/>
            
            <Route path="/home" element = {<UserInterface/>}>
              <Route index element = {<Home/>} />
              <Route path ="profile" element = {<Profile/>} />
              <Route path = "reading-list" element = {<ReadingList/>} />
              <Route path = "search" element = {<Search/>} />
              <Route path = "posts/:postId" element = {<PostDetailedView />} />
              <Route path = "books/:bookId" element = {<BookDetailedView/>} />
              <Route path = "users/:userId" element = {<Profile/>} />
              <Route path = "settings" element={<Settings/>} />
              <Route path = "messages" element={<Messages/>} />
              <Route path = "saved" element = {<Saved/>} />
              <Route path = "following" element = {<Following/>} />
            </Route>
            
            <Route path="/login" element = {<SignIn/>}/>
            <Route path="/info" element = {<h1>This is the INFO page!!! :D</h1>} />
    </>
))



  return(
    // <React.StrictMode>
    <>
      <AuthUserProvider>

        <ProfileContext.Provider value= {[profile, updateProfile]}>
         <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
           <ReactQueryDevtools />
          </QueryClientProvider>
        </ProfileContext.Provider>
      </AuthUserProvider>
    </>
  // </React.StrictMode>
  )


}


ReactDOM.createRoot(document.getElementById('root')!).render(<AppRoot />)
