import {Link} from 'react-router-dom'

const PageNotFound = () => {
  return (
    <div>
        <h1>{"Page Not Found :("}</h1>
      
        <Link to ="/home"><h2>Return To Home</h2></Link>
    </div>
  )
}

export default PageNotFound
