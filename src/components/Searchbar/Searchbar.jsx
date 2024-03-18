import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styles from './Searchbar.module.css';

export class Searchbar extends Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
    };

    state = { query: ''};

    handleChange = e => {
        this.setState({query: e.target.value});
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.onSubmit(this.state.query);
        this.setState({query: ''})
    }

    render(){
        return(
            <header className={styles.searchbar}>
            <form className={styles.form} onSubmit={this.handleSubmit}>
              <button type="submit" className={styles.button}>
                <span className={styles.buttonLabel}>Search</span>
              </button>
              <input
                className={styles.input}
                type="text"
                autoComplete="off"
                autoFocus
                placeholder="Search images and photos"
                value={this.state.query}
                onChange={this.handleChange}
              />
            </form>
          </header>
        )
    }
}