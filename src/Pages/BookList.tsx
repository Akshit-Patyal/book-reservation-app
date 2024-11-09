import axios from "axios";
import { useEffect, useState } from "react";
import "./BookList.scss";
import Header from "../Components/Header";

const BookList = () => {
  var userObj = JSON.parse(sessionStorage.userDetails);
  const [bookList, setBookList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBooksList = async () => {
      try {
        const result = await axios.get(
          `http://localhost:8080/api/v1/book-mgmt/books?userId=${userObj.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${sessionStorage.token}`,
            },
          }
        );
        console.log(result);
        setBookList(result.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBooksList();
  }, [userObj.id]);

  return (
    <div>
      <Header />
      <div className="list-container">
        <h2 className="mb-4">List of your Books!</h2>
        <table className="book-table">
        <tr className="book-heading mb-4">
        <th>Title</th>
        <th>Genre</th>
        <th>Author</th>
        </tr>
        {bookList.length > 0 && bookList.map((book) => 
        <tr className="book-data">
        <td>{book.title}</td>
        <td>{book.genre}</td>
        <td>{book.author}</td>
        </tr>
        )}
        </table>
      </div>
    </div>
  );
};

export default BookList;
