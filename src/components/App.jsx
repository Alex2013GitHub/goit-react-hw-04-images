import { useState, useEffect, useRef } from 'react';
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
  const prevQuery = useRef(query);
  const prevPage = useRef(page);

  // state = {
  //   query: '',
  //   images: [],
  //   page: 1,
  //   loading: false,
  // };

  const changeQuery = newQuery => {
    setQuery(`${Date.now()}/${newQuery}`);
    setImages([]);
    setPage(1);
  };

  // componentDidUpdate = async (prevProps, prevState) => {
  //   const { query, page } = this.state;

  //   if (prevState.query !== query || prevState.page !== page) {
  //     this.loadResult();
  //   }
  // };

  useEffect(() => {
    const loadResult = async () => {
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

    if (prevQuery.current !== query || prevPage.current !== page) {
      loadResult();
      prevQuery.current = query;
      prevPage.current = page;
    }
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
    // this.setState(prevState => ({
    //   page: prevState.page + 1,
    // }));
  };

  // rende
  //   const { loading, images } = this.state;
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
