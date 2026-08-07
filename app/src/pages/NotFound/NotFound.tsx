import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <h2>Oops! Card out of deck</h2>
      <p>
        The page you are looking for does not exist or has been deleted.
      </p>
      
      <Link to="/">
        Back to Home
      </Link>
    </div>
  );
}