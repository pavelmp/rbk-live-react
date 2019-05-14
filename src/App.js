import React from 'react';
import './App.css';

const SignUp = function(props){
  return (
    <div>
      <h1>Sign Up</h1>
      <input type='text' placeholder='username' value={props.username} onChange={event => props.onChange(event)} name="username"/>
      <input type='text' placeholder='password' value={props.password} onChange={event => props.onChange(event)} name="password"/>
      <button onClick={() => props.signUp()}>Sign Up</button>
    </div>
  );
};

const SignIn = function(props){
  return (
    <div>
      <h1>Sign In</h1>
      <input type='text' placeholder='username' value={props.username} onChange={event => props.onChange(event)} name="username"/>
      <input type='text' placeholder='password' value={props.password} onChange={event => props.onChange(event)} name="password"/>
      <button onClick={() => props.signIn()}>Sign In</button>
    </div>
  );
};

//props.places - array with place objects {location: 'City Mall', distance: 500}
const Places = function(props){
  return (
    <div>
      <h1>Places</h1>
      {
        props.places.map((place, index) => {
          return (<p key={index}>{index + 1}. {place.location} - {place.distance}</p>)
        })
      }
    </div>
  );
};



class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      whatPageToShow: 'signUp',
      places: [{location: 'City Mall', distance: 500}],
      errorMessage: ''
    }
  }

  componentDidMount(){
    console.log('Called componentDidMount')
  }

  componentWillMount(){
    console.log('Called componentWillMount')
  }

  onChange(event){
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }

  signUp(){
    //Call API to sign up with username and password
    const body = {username: this.state.username, password: this.state.password};
    fetch('http://localhost:5000/signup', {
      method: 'post',
      body: JSON.stringify(body),
      headers: {"Content-Type": "application/json"}
    }).then((response) => {
      return response.text();
    }).then((textReply) => {
      if(textReply === 'This username is already taken'){
        this.setState({errorMessage: textReply})
      };
      // console.log(data);
      // this.setState({whatPageToShow: 'signIn', username: '', password: ''})  
    });
  }

  signIn(){
    //Call API to sign in with username and password
    this.setState({whatPageToShow: 'places', username: '', password: ''})
  }
  
  render(){
    console.log('Rendered');
    return (
      <div className="App">
        <header className="App-header">
          { this.state.whatPageToShow === 'signUp'
            ? <SignUp username={this.state.username} password={this.state.password} onChange={event => this.onChange(event)} signUp={() => this.signUp()}/>
            : this.state.whatPageToShow === 'signIn'
              ? <SignIn username={this.state.username} password={this.state.password} onChange={event => this.onChange(event)} signIn={() => this.signIn()}/>
              : this.state.whatPageToShow === 'places'
                ? <Places places={this.state.places}/>
                : null
          }
          {
            this.state.errorMessage 
              ? <p>{this.state.errorMessage}</p>
              : null
          }
        </header>
      </div>
    );
  }
}

export default App;
