import { Rings } from 'react-loader-spinner';
import { Spinner } from './Loader.styled';

export const Loader = () => {
  return (
    <>
      <Spinner>
        <Rings width="200" color="#3f51b5" />
      </Spinner>
    </>
  );
};
