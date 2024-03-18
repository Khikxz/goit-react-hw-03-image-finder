import React, {Component} from 'react';
import {Button} from './Button/Button';
import {ImageGallery} from './ImageGallery/ImageGallery';
import {Loader} from './Loader/Loader';
import {Searchbar} from './Searchbar/Searchbar';
import { getAPI } from '../pixelbay-api';


export class App extends Component {
  state = {
    images: [],
    currentPage: 1,
    searchQuery: '',
    isLoading: false,
    isError: false,
    isEnd: false,
  };

  async componentDidUpdate(_prevProps, prevState){
    const {searchQuery, currentPage} = this.state;

    if(prevState.searchQuery !== searchQuery || prevState.currentPage !== currentPage){
      await this.fetchImages();
    }
  }

  fetchImages = async () => {
    this.setState({isLoading: true, isError:false});

    const {searchQuery, currentPage} = this.state;

    try{
      const response = await getAPI(searchQuery, currentPage);
      const {totalHits, hits} = response;

      this.setState(prevState => ({
        images: currentPage === 1 ? hits: [...prevState.images, ...hits],
        isLoading: false,
        isEnd: prevState.images.length + hits.length >= totalHits,
      }));

      if (hits.length === 0){
        alert('No images found. Try a different search.');
        return;
      }
    } catch (error){
      this.setState({isLoading: false, isError: true});
      alert(`An error occured while fetching data: ${error}`);
    }

  }

  handleSearchSubmit = query => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedCurrentQuery = this.state.searchQuery.toLocaleLowerCase();

    if (normalizedQuery === ''){
      alert('Empty string is not a valid search query. PLease type again.');
      return;
    }

    if (normalizedQuery === normalizedCurrentQuery){
      alert('Search query is the same as the previous one. Please provide a new search query.');
      return;
    }

    if (normalizedQuery !== normalizedCurrentQuery){
      this.setState({
        searchQuery: normalizedQuery,
        currentPage: 1,
        images: [],
        isEnd: false,
      });
    }
  };

  handleLoadMore = () => {
    if (!this.state.isEnd) { 
      this.setState(prevState => ({currentPage: prevState.currentPage + 1}));
    } else {
      alert("You've reached the end of the search results.");
    }
  };

  render(){
    const {images, isLoading, isError, isEnd} = this.state;
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 40,
          color: '#010101'
        }}
      >
        React Homework 03: Image Finder
        <Searchbar onSubmit={this.handleSearchSubmit}/>
        <ImageGallery images={images}/>
        {isLoading && <Loader />}
        {!isLoading && !isError && images.length > 0 && !isEnd && (
          <Button onClick={this.handleLoadMore} />
        )}
        {isError && <p>Something went wrong. Please try again later.</p>}
      </div>
    );
  }
};
