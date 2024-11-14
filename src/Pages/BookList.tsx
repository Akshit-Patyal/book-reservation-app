import axios from "axios";
import { useEffect, useState } from "react";
import "./BookList.scss";
import Header from "../Components/Header";
import {
  faArrowRightArrowLeft,
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import ReactPaginate from "react-paginate";

const BookList = () => {
  var userObj = JSON.parse(sessionStorage.userDetails);
  const [bookList, setBookList] = useState<any[]>([]);
  const [deletedBook, setDeletedBook] = useState();
  const [bookExchanged, setBookExchanged] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [searchFilterValue, setSearchFilterValue] = useState("Title");
  const [showAllBookFlag, setShowAllBookFlag] = useState<boolean>(false);
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + 5;
  const currentItems = bookList.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(bookList.length / 5);

  const navigate = useNavigate();

  const deleteBookHandler = async (book: any) => {
    const result = await axios.delete(
      `http://localhost:8080/api/v1/book-mgmt/book/${book.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${sessionStorage.token}`,
        },
      }
    );
    setDeletedBook(result.data);
  };

  const searchPayloadHandler = () => {
    if (searchFilterValue === "Title") {
      return { title: searchValue };
    } else if (searchFilterValue === "Author") {
      return { author: searchValue };
    } else {
      return { genre: searchValue };
    }
  };

  const bookSearchHandler = async () => {
    try {
      const result = await axios.post(
        "http://localhost:8080/api/v1/book-mgmt/search-books?page=0&size=5",
        searchPayloadHandler(),
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${sessionStorage.token}`,
          },
        }
      );
      setBookList(result.data.content);
    } catch (error) {
      console.error(error);
    }
  };

  const showAllBooksHandler = async () => {
    let url = "http://localhost:8080/api/v1/book-mgmt/books";
    if (showAllBookFlag) {
      url = `http://localhost:8080/api/v1/book-mgmt/books/{userId}?userId=${userObj.id}`;
    }
    try {
      const result = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${sessionStorage.token}`,
        },
      });
      setBookList(result.data);
    } catch (error) {
      console.error(error);
    }
    setShowAllBookFlag(!showAllBookFlag);
  };

  const bookExchageHandler = async (
    book : any
  ) => {
    try {
      const result = await axios.put(
        `http://localhost:8080/api/v1/book-mgmt/book/${book.id}`,
        {
          available: !book.available,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${sessionStorage.token}`,
          },
        }
      );
      setBookExchanged(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * 5) % bookList.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    const fetchBooksList = async () => {
      try {
        const result = await axios.get(
          `http://localhost:8080/api/v1/book-mgmt/books/{userId}?userId=${userObj.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${sessionStorage.token}`,
            },
          }
        );
        setBookList(result.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (searchValue.length === 0) {
      fetchBooksList();
    }
  }, [userObj.id, deletedBook, searchValue, bookExchanged]);

  return (
    <div>
      <Header />
      <div className="list-container">
        <h2 className="mb-4">{showAllBookFlag ? "List of All Books!" : "List of Your Books!"}</h2>
        <div className="search-container">
          <div className="search-input-container">
            <Dropdown as={ButtonGroup} className="dropdown-container">
              <Button variant="danger" className="dropdown-dp">
                Search By {searchFilterValue}
              </Button>

              <Dropdown.Toggle
                split
                variant="danger"
                className="dropdown-dp"
                id="dropdown-split-basic"
              />

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setSearchFilterValue("Title");
                  }}
                >
                  Title
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setSearchFilterValue("Author");
                  }}
                >
                  Author
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setSearchFilterValue("Genre");
                  }}
                >
                  Genre
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <input
              type="input"
              placeholder="Search Books"
              id="floatingSearch"
              className="search-input"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button className="search-btn" onClick={bookSearchHandler}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Button>
          </div>
          <div>
            <Button
              className="btnShowAll"
              variant="danger"
              onClick={showAllBooksHandler}
            >
              {showAllBookFlag ? <p>Show My Books!</p> : <p>Show All Books!</p>}
            </Button>
          </div>
        </div>
        <table className="book-table">
          <tr className="book-heading mb-4">
            <th>Title</th>
            <th>Genre</th>
            <th>Author</th>
            <th>Availability</th>
            <th></th>
          </tr>
          {currentItems.length > 0 &&
            currentItems.map((book) => (
              <tr className="book-data" key={book.id}>
                <td>{book.title}</td>
                <td>{book.genre}</td>
                <td>{book.author}</td>
                <td>{book.available === true ? "Yes" : "No"}</td>
                <td>
                  {showAllBookFlag ? (
                    <Button
                      variant="success"
                      size="sm"
                      className={book.available ? "exchange-btn" : "exchanged-btn"} 
                      onClick={() => {bookExchageHandler(book)}}
                    >
                      {book.available ? "Exchange" : "Exchanged"}
                      <FontAwesomeIcon
                        icon={faArrowRightArrowLeft}
                        className="exchange-icon"
                      />
                    </Button>
                  ) : (
                    <div className="action-btn">
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="edit-icon"
                        onClick={() => {
                          navigate("/addBooks", {
                            state: { updatedBookData: book, editFlag: true },
                          });
                        }}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="edit-icon"
                        onClick={() => {
                          deleteBookHandler(book);
                        }}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
        </table>
        <ReactPaginate
          breakLabel="..."
          nextLabel=" next>"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="<previous "
          renderOnZeroPageCount={null}
          containerClassName={"pagination"}
          pageClassName={"page-item"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default BookList;
