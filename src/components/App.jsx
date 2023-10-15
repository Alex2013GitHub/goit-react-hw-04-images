import { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { getImages } from '../services/api';
import { errorInfo, notifyInputQuerry, success } from './ErrorInfo/ErrorInfo';
import { Gallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Pagination } from './LoadMore/LoadMore';
import { Container } from './GlobalStyle';
import { Toaster } from 'react-hot-toast';

export class App extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    loading: false,
  };

  changeQuery = newQuery => {
    this.setState({
      query: `${Date.now()}/${newQuery}`,
      images: [],
      page: 1,
    });
  };

  componentDidUpdate = async (prevProps, prevState) => {
    const { query, page } = this.state;

    if (prevState.query !== query || prevState.page !== page) {
      this.loadResult();
    }
  };

  loadResult = async () => {
    const { query, page } = this.state;
    try {
      this.setState({ loading: true });
      const img = await getImages(query, page);
      if (!img.length) {
        errorInfo();
        return;
      }
      this.setState(prevState => ({
        images: [...prevState.images, ...img],
      }));
      if (page === 1) {
        success(query);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSubmit = evt => {
    evt.preventDefault();
    if (evt.target.elements.query.value.trim() === '') {
      notifyInputQuerry();
      return;
    }
    this.changeQuery(evt.target.elements.query.value);

    evt.target.reset();
  };

  handleLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  render() {
    const { loading, images } = this.state;
    return (
      <Container>
        <Searchbar onSubmit={this.handleSubmit} />
        {loading && <Loader />}
        {images.length > 0 && <Gallery imgItems={images} />}
        {images.length > 0 && (
          <Pagination onClick={this.handleLoadMore}>Load More</Pagination>
        )}
        <Toaster position="top-right" reverseOrder={true} />
      </Container>
    );
  }
}
