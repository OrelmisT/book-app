import { useState } from "react";
import SignIn from "./SignIn";
import UserInteface from "./UserInterface";

function App() {

    const [page, setPage] = useState(0);


    if (page === 0) return (
        <SignIn setPage={setPage} />
    )

    if (page === 1) return (
        <UserInteface setPage={setPage} />
    )

    return (
        <>
            <h1>App</h1>
        </>
    );
}

export default App;
