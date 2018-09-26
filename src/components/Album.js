import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props) {
    super(props);

  const album = albumData.find( album => {
    return album.slug === this.props.match.params.slug
  });

  this.state = {
    album: album,
    currentSong : album.songs[0],
    currentTime: 0,
    currentVolume: 0.8,
    duration: album.songs[0].duration,
    isPlaying: false,
    isHovered: null
  };

  this.audioElement = document.createElement('audio');
  this.audioElement.src = album.songs[0].audioSrc;
}

componentDidMount() {
  this.eventListeners = {
    timeupdate: e => {
      this.setState({ currentTime: this.audioElement.currentTime });
    },
    durationchange: e => {
      this.setState({ duration: this.audioElement.duration });
    },
    volumechange: e => {
      this.setState({ currentVolume: this.audioElement.currentVolume });
    }
  };
  this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
  this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
  this.audioElement.addEventListener('volumechange', this.eventListeners.volumechange);
}

componentWillUnmount() {
  this.audioElement.src = null;
  this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
  this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);

}

play() {
  this.audioElement.play();
  this.setState({ isPlaying: true });
}

pause() {
  this.audioElement.pause();
  this.setState({ isPlaying: false });
}

setSong(song) {
  this.audioElement.src = song.audioSrc;
  this.setState({ currentSong: song });
}

handleSongClick(song) {
  const isSameSong = this.state.currentSong === song;
  if (this.state.isPlaying && isSameSong) {
    this.pause();
  } else {
    if (!isSameSong) {  this.setSong(song); }
    this.play();
  }
}

handleTimeChange(e) {
  const newTime = this.audioElement.duration * e.target.value;
  this.audioElement.currentTime = newTime;
  this.setState({ currentTime: newTime });
}

handleVolumeChange(e) {
  const newVolume = e.target.value;
  this.audioElement.volume = newVolume;
  this.setState({ currentVolume: newVolume });
}

handleMouseEnter() {
  this.setState({ isHovered: true });
}

handleMouseLeave() {
  this.setState({ isHovered: null  });
}

formatTime(time) {
  let timeString;
  let timeSeconds = Math.floor(time % 60);

  if (time > 60) {
    timeString = Math.floor(time/60).toString() + ((time%60) < 10 ? ':0' + timeSeconds.toString() : ':' + timeSeconds.toString());
  }else if (time <= 60) {
    timeString = '00:' + (time < 10 ? '0' + timeSeconds.toString() : timeSeconds.toString());
  }else {
    timeString = '-:--';
  }

  return timeString;
}

renderButton(song, index) {
  if (this.state.currentSong === song) {
    if (this.state.isPlaying === true) {
      return <ion-icon name='pause'></ion-icon>
    } else {
      return <ion-icon name='play'></ion-icon>
    }
  }else {
    if (this.state.isHovered !== null && this.state.isHovered === song) {
      return <ion-icon name='play'></ion-icon>
    }else {
      return index+1
    }
  }
}

handlePrevClick() {
  const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
  const newIndex = Math.max(0, currentIndex - 1);
  const newSong = this.state.album.songs[newIndex];
  this.setSong(newSong);
  this.play();
}

handleNextClick() {
  const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
  const newIndex = Math.min(4, currentIndex + 1);
  const newSong = this.state.album.songs[newIndex];
  this.setSong(newSong);
  this.play();
}

  render() {
    return(
      <section className='album'>
        <section id='album-info'>
          <img id='album-cover-art' src={this.state.album.albumCover} alt={this.state.album.title}/>
          <div className='album-details'>
            <h1 id='album-title'>{this.state.album.title}</h1>
            <h2 className='artist'>{this.state.album.artist}</h2>
            <div id='release-info'>{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <table id='song-list'>
          <colgroup>
            <col id='song-number-column'/>
            <col id='song-title-column'/>
            <col id='song-duration-column'/>
          </colgroup>
          <tbody>
            {
              this.state.album.songs.map( (song, index) =>
                <tr
                  className='song'
                  key={index}
                  onClick={() => this.handleSongClick(song)}
                  onMouseEnter={() => this.handleMouseEnter()}
                  onMouseLeave={() => this.handleMouseLeave()}
                >
                  <td>{this.renderButton(song, index)}</td>
                  <td>{song.title}</td>
                  <td>{song.duration}</td>
                </tr>
              )
            }
          </tbody>
        </table>
        <PlayerBar
          isPlaying={this.state.isPlaying}
          currentSong={this.state.currentSong}
          currentTime={this.audioElement.currentTime}
          formatTime={(time) => this.formatTime(time)}
          duration={this.audioElement.duration}
          handleSongClick={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={() => this.handlePrevClick()}
          handleNextClick={() => this.handleNextClick()}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
        />
      </section>
    );
  }
}

export default Album;
