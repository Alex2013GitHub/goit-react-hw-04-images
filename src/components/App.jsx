import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { getImages } from '../services/api';
import { errorInfo, notifyInputQuerry, success } from './ErrorInfo/ErrorInfo';
import { Gallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Pagination } from './LoadMore/LoadMore';
import { Container } from './GlobalStyle';
import { Toaster } from 'react-hot-toast';

export const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const changeQuery = newQuery => {
    setQuery(`${Date.now()}/${newQuery}`);
    setImages([]);
    setPage(1);
  };

  useEffect(() => {
    const loadResult = async () => {
      if (!query) return;

      try {
        setLoading(true);
        const img = await getImages(query, page);
        if (!img.length) {
          errorInfo();
          return;
        }
        setImages(prevImages => [...prevImages, ...img]);
        if (page === 1) {
          success(query);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [query, page]);

  const handleSubmit = evt => {
    evt.preventDefault();
    if (evt.target.elements.query.value.trim() === '') {
      notifyInputQuerry();
      return;
    }
    changeQuery(evt.target.elements.query.value);

    evt.target.reset();
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <Container>
      <Searchbar onSubmit={handleSubmit} />
      {loading && <Loader />}
      {images.length > 0 && <Gallery imgItems={images} />}
      {images.length > 0 && (
        <Pagination onClick={handleLoadMore}>Load More</Pagination>
      )}
      <Toaster position="top-right" reverseOrder={true} />
    </Container>
  );
};
