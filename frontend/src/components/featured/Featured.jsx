import HeroBanner from '../heroBanner/HeroBanner';
import './featured.scss';

const Featured = ({ type, setGenre }) => {
  return (
    <div className="featured">
      <HeroBanner type={type} onGenreChange={setGenre} />
    </div>
  );
};

export default Featured;