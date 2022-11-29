import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg';
import Clarifai from 'clarifai';


const app = new Clarifai.App({
  apiKey: 'ab955313c8c841e8b9b8fb729a14c098'
});


class App extends Component {

    constructor() {
      super();
      this.state = {
        input: '',
        imageUrl: '',
        box: {}
      }
    }

  calculateFaceLocation = (data) => {
   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
   const image = document.getElementById('inputImage');
   const width = Number(image.width);
   const height = Number(image.height);
   return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)    
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
   this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
      console.log('click');
      this.setState({imageUrl: this.state.input })
      app.models
        // .predict('53e1df302c079b3db8a0a36033ed2d15', 
      .predict('e466caa0619f444ab97497640cefc4dc', 
          this.state.input)
        .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
        .catch(err => console.log(err));
    }


    render () {
        return (
          <div className="App">
            <ParticlesBg type="circle" bg={true} />
            <Navigation />
            <Logo />
            <Rank />
            <ImageLinkForm 
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={this.state.box} imageUrl={this.state.input}/>
          </div>
     );
    }

}

export default App;
