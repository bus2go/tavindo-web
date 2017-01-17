import React, { Component } from 'react';

import FormLinhaContainer from '../components/form.linha.container';

class Home extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div>
                <FormLinhaContainer />
                {this.props.children}
            </div>
        );
    }
}

export default Home;