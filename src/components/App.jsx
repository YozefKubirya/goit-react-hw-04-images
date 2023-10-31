import {useState,useEffect} from 'react';
import { ColorRing } from 'react-loader-spinner';
import Searchbar from './SearchBar/SearchBar';
import Button from './Button/Button';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from './Modal/Modal';
import { searchImageAPI } from '../api/api';
import styles from 'App.module.css';

export const App = () => {
  const [search, searchSetState] = useState('');
  const [images, imageSetState] = useState([]);
  const [loading,setLoading] = useState(false);
  const [error, errorSetState] = useState(null);
  const [page, pageSetState] = useState(1);
  const [modal, modalSetState] = useState(false);
  const [largeImageURL, largeImageURLSetState] = useState[''];

  useEffect(() => {
    if (search) {
      const fetchPosts = async () => {
        try {
          setLoading(true);

          const data = await searchImageAPI(search, page);

          imageSetState(images => [...images, ...data.hits]);
        } catch (error) {
          errorSetState(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    }
  }, [search, page]);

  const searchImages = ({ search }) => {
    if (search.trim()) {
      searchSetState(search);
      pageSetState(1)
      imageSetState([])
    }
  };

  const loadMore = () => {
   pageSetState(prevPage=>prevPage+1);
  };

  const showImage = data => {
    largeImageURLSetState(data);
    modalSetState(true)
  }

  const closeModal = () => {
    largeImageURLSetState('');
    modalSetState(false)
  };
    return (
      <div className={styles.App}>
        <Searchbar onSubmit={searchImages} />

        <ImageGallery images={images} showImage={showImage} />

        {loading && (
          <ColorRing
            height="100"
            width="100"
            radius="10"
            color="green"
            ariaLabel="loading"
          />
        )}
        {error && <p>Error! Try again later.</p>}

        {Boolean(images.length) && <Button loadMore={loadMore} />}
        {modal && (
          <Modal close={closeModal}>
            <img src={largeImageURL} alt="" />
          </Modal>
        )}
      </div>  
    );
  
 }
