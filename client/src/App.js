import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

const particlesOptions = {
  "particles": {
    "number": {
      "value": 100,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "polygon",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 8
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 2,
        "size_min": 1.5982994094283678,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 2,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "retina_detect": true
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route:'signIn',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  resetState = () => {
    this.setState({
      input: '',
      imageUrl: '',
      box: [],
      route: 'login',
      isLoggedIn: false,
      user: {
        _id: '',
        name: '',
        username: '',
        entries: 0,
        joined: '',
      },
    });
  };

  calculateFaceLocation = (data) => {
    // array of location of the bounding boxes in the output
    let arrayOfFaceBoundingBox = [];

    // image that gets displayed in the app
    const image = document.getElementById('inputImage');

    // get the width and height of the image to perform calculations on
    const width = Number(image.width);
    const height = Number(image.height);

    // goes through the data.outputs array and adds each face the API finds in the image to our array
    for (let faceBoundBox of data.outputs[0].data.regions) {
      arrayOfFaceBoundingBox.push({
        // the left_col is a percentage of our width so we multiply them and set leftCol to the result.
        // same with top row but with height
        leftCol: faceBoundBox.region_info.bounding_box.left_col * width,
        topRow: faceBoundBox.region_info.bounding_box.top_row * height,
        // we want to get the number that is the total percentage (right_col * width) minus the left most side of the width (width)
        // same with bottomRow
        rightCol: width - (faceBoundBox.region_info.bounding_box.right_col * width),
        bottomRow: height - (faceBoundBox.region_info.bounding_box.bottom_row * height)
      })
    }
    return arrayOfFaceBoundingBox;
  }

  displayFaceBoxOutline = (boxOutline) => {
    this.setState({box: boxOutline});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onImageSubmit = () => {
    this.setState({imageUrl: this.state.input, box: {}})

    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}));
        })
        .catch('Unable to update image');
      }
    this.displayFaceBoxOutline(this.calculateFaceLocation(response));
    })
      .catch((error) => {
        console.log(error);
    });
  }

  onRouteChange = (route) => {
    if (route === 'signedOut') {
      this.resetState();
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const {route, box, imageUrl, isSignedIn} = this.state;
    return (
      <div className="App">
        <Particles 
          className='particles'
          params={particlesOptions} />
        <Navigation 
          resetState={this.resetState}
          onRouteChange={this.onRouteChange} 
          isSignedIn={isSignedIn} />
        { route === 'home' ?
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onImageSubmit={this.onImageSubmit}/>
            <FaceRecognition box={box} imageUrl={imageUrl} /> 
          </div>
          : (
            route === 'signIn' || route === 'signedOut' ?
            <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
            :
            <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          )
          
        }
      </div>
    );
  }
}

export default App;
