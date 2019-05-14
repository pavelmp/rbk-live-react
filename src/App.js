import React from 'react';
import './App.css';

const SignUp = function(props){
  return (
    <div>
      <h1>Sign Up</h1>
      <input type='text' placeholder='username' value={props.username} onChange={event => props.onChange(event)} name="username"/>
      <input type='text' placeholder='password' value={props.password} onChange={event => props.onChange(event)} name="password"/>
      <button onClick={() => props.signUp()}>Sign Up</button>
      <button onClick={() => props.redirect('signIn')}>Already signed up? Sign in here</button>
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
      errorMessage: '',
      token: ''
    }
  }

  componentDidMount(){
    console.log('Called componentDidMount')
  }

  componentWillMount(){
    console.log('Called componentWillMount')
  }

  redirect(whatPageToShow){
    this.setState({whatPageToShow: whatPageToShow});
  }

  onChange(event){
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }

  signUp(){
    //Call API to sign up with username and password
    const body = {username: this.state.username, password: this.state.password};
    fetch('http://127.0.0.1:5000/signup', {
      method: 'post',
      body: JSON.stringify(body),
      headers: {"Content-Type": "application/json"}
    }).then((response) => {
      return response.text();
    }).then((textReply) => {
      if(textReply === 'This username is already taken'){
        this.setState({errorMessage: textReply})
      } else {
        this.setState({whatPageToShow: 'signIn', username: '', password: '', errorMessage: ''})
      }
    });
  }

  signIn(){
    //Call API to sign in with username and password
    const body = {username: this.state.username, password: this.state.password};
    fetch('http://127.0.0.1:5000/signin', {
      method: 'post',
      body: JSON.stringify(body),
      headers: {"Content-Type": "application/json"}
    }).then((response) => {
      return response.json();
    }).then((body) => {
      if(body.error){
        if(body.error === 'Please sign in'){
          return this.setState({whatPageToShow: 'signIn', username: '', password: '', errorMessage: ''})  
        } else {
          return this.setState({errorMessage: body.error})
        }
      }
      //Got token
      const token = body.token;
      localStorage.setItem('token', token);
      this.setState({username: '', password: '', errorMessage: ''});
      this.getPlaces();
    });
  }

  getPlaces(){
    const token = localStorage.getItem('token');
    console.log(token)
    fetch('http://127.0.0.1:5000/places', {
      method: 'get',
      headers: {"x-access-token": token }
    }).then((response) => {
      return response.json();
    }).then((body) => {
      console.log(body);
      if(body.error){
        return this.setState({errorMessage: body.error})
      };
      return this.setState({places: body.places, whatPageToShow: 'places'})
    })
  }
  
  render(){
    return (
      <div className="App">
        <header className="App-header">
          { this.state.whatPageToShow === 'signUp'
            ? <SignUp username={this.state.username} 
                      password={this.state.password} 
                      onChange={event => this.onChange(event)} 
                      signUp={() => this.signUp()}
                      redirect={(whatPageToShow) => this.redirect(whatPageToShow)} />
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
