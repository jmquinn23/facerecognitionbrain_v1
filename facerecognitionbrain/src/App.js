import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg';




const initialState = {
        input: '',
        imageUrl: '',
        box: {},
        route: 'signin',
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

  // componentDidMount() {
  //   fetch('http://localhost:3001/')
  //   .then(res => res.json())
  //   .then(console.log)
  // }

  loadUser = (data) => {
    this.setState({user: {
          id: data.id,
          name: data.name,          
          email: data.email,      
          entries: data.entries,
          joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    console.log(data.outputs[0].data.regions[0].region_info.bounding_box);
    // console.log(data.outputs[0].data.regions[0].region_info.bounding_box);
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');   
    const width = Number(image.width);
    const height = Number(image.height);
     console.log('height', image.height, 'width', image.width);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box});
  }

  onInputChange = (event) => {
   this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
        fetch('http://localhost:3001/imageUrl', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {        
        if (response) {
          fetch('http://localhost:3001/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }        
       

    onRouteChange = (route) => {
      if (route === 'signout') {
        this.setState(initialState)
      } else if (route === 'home') {
        this.setState({isSignedIn: true})
      }
      this.setState({route: route});
    }


    render () {
      // const {isSignedIn, imageUrl, route, box} = this.state;
        return (                                 
          <div className="App">    
            <ParticlesBg type="circle" bg={true} />        
            <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
            { this.state.route === 'home' 
              ? <div>
                  <Logo />
                  <Rank name={this.state.user.name} entries={this.state.user.entries} />
                  <ImageLinkForm 
                    onInputChange={this.onInputChange}
                    onButtonSubmit={this.onButtonSubmit}
                  />
                  <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
               </div>
               : (
                  this.state.route === 'signin' 
                  ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                  : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                 )   
             }            
          </div>
          );
      }
            
  }

export default App;
