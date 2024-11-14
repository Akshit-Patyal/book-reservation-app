import { Button } from 'react-bootstrap';
import './Header.scss';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const logoutHandler = () => {
        sessionStorage.clear();
        navigate('/login');
    };

return (
    <header className="header">
        <div className='tabs'>
            <div>
                <Button className='linkBtn' onClick={() => navigate('/profile')}>Profile</Button>
                <Button className='linkBtn' onClick={() => navigate('/addBooks')}>AddBook</Button>
                <Button className='linkBtn' onClick={() => navigate('/bookList')}>BookList</Button>
            </div>
            <div>
                <Button className='linkBtn' onClick={logoutHandler}>Logout</Button>
            </div>
        </div>
    </header>
);
}

export default Header;