import { Route, Routes } from "react-router";
import SignUp from "../Dashboard/SignUp";
import Login from "../Dashboard/Login";
import Profile from "../Pages/Profile";
import AddBook from "../Pages/AddBook";
import BookList from "../Pages/BookList";

const BookRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/addBooks" element={<AddBook />} />
            <Route path="/bookList" element={<BookList />} />
        </Routes>
    );
}

export default BookRoutes;