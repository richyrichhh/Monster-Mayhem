import React from 'react';


class Play extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchGame()
    }

    render() {
        console.log(this.props);

        return(
        <div className="play-main">
            <div className='play-div'>
                <img className="play-background" src="https://res.cloudinary.com/df6rrvdqm/image/upload/v1579895776/monster-mayhem/stage-3_scoe0t.jpg" alt="play-back"/>
            </div>
        </div>
        )
    }
}

export default Play;