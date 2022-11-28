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
      imageUrl: ''
    }
  }

onInputChange = (event) => {
 this.setState({input: event.target.value})
}

  onButtonSubmit = () => {
    console.log('click');
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
      .then(
      function (response) {
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      },
      function (err) {
      });
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
          <FaceRecognition imageUrl={this.state.input}/>
        </div>
   );
  }

}

export default App;
