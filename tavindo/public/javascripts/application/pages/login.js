import React, { Component } from 'react';
import './login.scss';

class Login extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <section id="loginForm">
                <div className="row">
                    <form method="post">
                        <div>
                            <header>
                                <h4>Sign in with your credentials:</h4>
                            </header>
                            <div>
                                <input id="login" type="text" name="login" placeholder="Login" />
                            </div>
                            <div>
                                <input id="password" type="password" name="password" placeholder="Password" />
                            </div>
                            <div>
                                <input type="submit" className="button alt" value="OK" />
                            </div>
                        </div>
                    </form>
                </div>
                <div className="row">
                    <div>
                        <header>
                            <h4>Or, if you prefer, you can also:</h4>
                        </header>
                        <div className="row">
                            <div className="six columns">
                                <a className="button facebook alt" href="/auth/facebook">Sign in with Facebook</a>
                            </div>
                            <div className="six columns">
                                <a className="button google alt" href="/auth/google">Sign in with Google+</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Login;