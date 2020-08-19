import React, { Component } from 'react';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            registerEmail: '',
            registerPassword: '',
            registerName: ''
        }
    }

    onNameChange = (event) => {
        this.setState({registerName: event.target.value})
    }
    onEmailChange = (event) => {
        this.setState({registerEmail: event.target.value})
    }
    onPasswordChange = (event) => {
        this.setState({registerPassword: event.target.value})
    }

    onSubmitSignIn = () => {
        fetch('http://localhost:3000/register', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.registerEmail,
                password: this.state.registerPassword,
                name: this.state.registerName
            })
        })
            .then(response => response.json())
            .then(user => {
                if (user.id) {
                    this.props.loadUser(user); 
                    this.props.onRouteChange('home');
                }
            })
    }

    render() {
        return (
            // <div>
                <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                    <main className="pa4 black-80">
                        <div className="measure">
                            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                                <legend className="f1 fw6 ph0 mh0 center">Register</legend>
                                <div className="mt3">
                                    <label className="db fw6 lh-copy f5" htmlFor="name">Name</label>
                                    <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                        onChange={this.onNameChange} 
                                        type="text" 
                                        name="name"   
                                        id="name"/>
                                    <label className="db fw6 lh-copy f5" htmlFor="email-address">Email</label>
                                    <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                        onChange={this.onEmailChange}
                                        type="email" 
                                        name="email-address"   
                                        id="email-address"/>
                                </div>
                                <div className="mv3">
                                    <label className="db fw6 lh-copy f5" htmlFor="password">Password</label>
                                    <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                        onChange={this.onPasswordChange}
                                        type="password" 
                                        name="password"  
                                        id="password"/>
                                </div>
                            </fieldset>
                            
                            <div className="">
                                <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f5 dib" 
                                    type="submit" 
                                    value="Register"
                                    onClick={this.onSubmitSignIn}
                                    />
                            </div>
                        </div>
                    </main>
                </article>
            // </div>
        );
    }
}

export default Register;