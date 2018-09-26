import React, { Component } from 'react';

class PlayerBar extends Component {
  render() {
    return (
      <section className='player-bar'>
        <section id='buttons'>
          <button id='previous' onClick={this.props.handlePrevClick} >
            <ion-icon name='skip-backward'></ion-icon>
          </button>
          <button id='play-pause' onClick={this.props.handleSongClick} >
            <ion-icon name={this.props.isPlaying ? 'pause' : 'play'}></ion-icon>
          </button>
          <button id='next' onClick={this.props.handleNextClick} >
            <ion-icon name='skip-forward'></ion-icon>
          </button>
        </section>
        <section id='time-control'>
          <div>
            {this.props.formatTime(this.props.currentTime)}
              <input
                type='range'
                className='seek-bar'
                value={(this.props.currentTime / this.props.duration) || 0}
                max='1'
                min='0'
                step='0.01'
                onChange={this.props.handleTimeChange}
              />
            {this.props.formatTime(this.props.duration)}
          </div>
        </section>
        <section id='volume-control'>
          <div>
            <ion-icon name='volume-low'></ion-icon>
              <input
                type='range'
                className='seek-bar'
                max='1'
                min='0'
                step='0.01'
                value={this.props.currentVolume}
                onChange={this.props.handleVolumeChange}
              />
            <ion-icon name="volume-high"></ion-icon>
          </div>
        </section>
      </section>
    );
  }
}

export default PlayerBar;
