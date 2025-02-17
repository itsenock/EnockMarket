import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to Campus Market</h1>
        <p>Your one-stop shop for all your needs</p>
        <div className="home-buttons">
          <Link to="/products">
            <button>Shop Now</button>
          </Link>
          <Link to="/sell">
            <button>Sell with Us</button>
          </Link>
        </div>
      </div>

      <div className="categories-section">
        <h2>Explore Categories</h2>
        <div className="card-container">
          <Link to="/products?category=Electronics" className="card-link">
            <div className="card">
              <img
                src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Electronics"
              />
              <h3>Electronics</h3>
              <p>Discover the latest in tech and gadgets.</p>
            </div>
          </Link>

          <Link to="/products?category=Fashion" className="card-link">
            <div className="card">
              <img
                src="https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Fashion"
              />
              <h3>Fashion</h3>
              <p>Explore trending styles and accessories.</p>
            </div>
          </Link>

          <Link to="/products?category=Home%20%26%20Kitchen" className="card-link">
            <div className="card">
              <img
                src="https://images.pexels.com/photos/30617433/pexels-photo-30617433/free-photo-of-cozy-vintage-kitchen-with-rustic-decor.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Home & Kitchen"
              />
              <h3>Home & Kitchen</h3>
              <p>Upgrade your home with our range of products.</p>
            </div>
          </Link>

          <Link to="/products?category=Sports & Outdoors" className="card-link">
            <div className="card">
              <img
                src="https://images.pexels.com/photos/2923156/pexels-photo-2923156.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Fashion"
              />
              <h3>Sports & Outdoors</h3>
              <p>Gear up for adventure with our top-notch sports and outdoors products!</p>
            </div>
          </Link>

          <Link to="/products?category=Musical Instruments" className="card-link">
            <div className="card">
              <img
                src="https://images.pexels.com/photos/6966/abstract-music-rock-bw.jpg?auto=compress&cs=tinysrgb&w=400"
                alt="Musical Instruments"
              />
              <h3>Musical Instruments</h3>
              <p>Unlock your musical potential with our high-quality instruments.</p>
            </div>
          </Link>
          <Link to="/products?category=Furniture" className="card-link">
            <div className="card">
              <img
                src="https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Fashion"
              />
              <h3>Furniture</h3>
              <p>Transform your space with our stylish and comfortable furniture for every room.</p>
            </div>
          </Link>
            
          <Link to="/products?category=Home Appliances" className="card-link">
            <div className="card">
              <img
                src="https://images.pexels.com/photos/8082206/pexels-photo-8082206.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Fashion"
              />
              <h3>Home Appliances</h3>
              <p>Upgrade your home with our top-of-the-line appliances for a seamless living experience.</p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Home;
