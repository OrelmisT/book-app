import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App.tsx'
import './styles/index.css'
import AuthUserProvider from './utils/AuthUserProvider.tsx'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import SignIn from './pages/SignIn.tsx'
import RouterRedirect from './pages/RouterRedirect.tsx'
import UserInterface from './components/UserInterface.tsx'


const AppRoot = () => {
  return(
    <React.StrictMode>
      <AuthUserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={(<RouterRedirect/>)}/>
          <Route path="/home" element= {<App />}>
             <Route index element = {<UserInterface/>}/>
          </Route>
          <Route path="/login" element = {<SignIn/>} />
          <Route path="/info" element = {<h1>This is the INFO page!!! :D</h1>} />   
        </Routes>
      </BrowserRouter>
      </AuthUserProvider>
  </React.StrictMode>
  )


}


ReactDOM.createRoot(document.getElementById('root')!).render(<AppRoot />)
