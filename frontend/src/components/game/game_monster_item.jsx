import React from 'react';

class GameMonsterItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false,
            hover: false,
        }

        this.numSelectedChars = 0;

        this.selectMonster = this.selectMonster.bind(this);
        this.showStats = this.showStats.bind(this);
        this.hideStats = this.hideStats.bind(this);
        this.addToTeam = this.addToTeam.bind(this);
    }

    addToTeam(e) {
        e.preventDefault();
        this.team.push(e.target.alt);
        this.setState({
          userTeam: this.team,
        })
        // console.dir(e.target.alt)
        if (this.team.length === 2) {
          alert('click fight to begin');
          this.props.updateUserTeam(this.props.user.id, { team: this.team, user:this.props.user.id });
        };
      };

    selectMonster() {
        this.setState({
            selected: true,
        })
    }

    showStats() {
        this.setState({
            hover: true,
        })
    }

    hideStats() {
        this.setState({
            hover: false,
        })
    }

    render() {
        const { monster, addToTeam } = this.props;

        let toggleClass;
        if (this.state.selected && this.numSelectedChars < 2) {
          this.numSelectedChars += 1;
          toggleClass = 'selected';
        } else {
            toggleClass = '';
        }
        
        let stats;
        if (this.state.hover || this.state.selected) {
            stats = 'show-stats'
        } else {
            stats = 'hide-stats'
        }

        let leftMoves = 'hide-moves';
        let rightMoves = 'hide-moves'
        let hoverIcon = 'not-hovered-icon';
        if (this.state.hover && this.props.index % 2 === 0) {
            leftMoves = 'show-moves-left';
            hoverIcon = 'hovered-icon';
        } else if (this.state.hover && this.props.index % 2 === 1) {
            rightMoves = 'show-moves-right';
            hoverIcon = 'hovered-icon';
        }

        return (
                <div 
                    className={`monster-element ${toggleClass}`}
                    alt={monster._id}
                    onClick={this.selectMonster}
                    onMouseEnter={this.showStats}
                    onMouseLeave={this.hideStats}>
                    <div className={leftMoves}>
                        <h3>Moves:</h3>
                        <ul>
                            {
                            monster.movespool.map((move, idx) => 
                                <li className='move-list-item' key={idx}>{move.name}</li>
                            )
                            }
                        </ul>
                    </div>
                    <div className='icon-stats'>
                        <img onClick={addToTeam} className={hoverIcon}  src={monster.imageUrl} alt={monster._id}/>
                        <div onClick={addToTeam} className={stats} title={monster._id}>
                            <h4 className='monster-name'>{monster.name}</h4>
                            <h5>Health: {monster.health}</h5>
                            <h5>Attack: {monster.attack}</h5>
                            <h5>Defense: {monster.defense}</h5>
                            <h5>Speed: {monster.speed}</h5>
                        </div>
                    </div>
                    <div className={rightMoves}>
                        <h3>Moves:</h3>
                        <ul>
                            {
                                monster.movespool.map((move, idx) => 
                                    <li className='move-list-item' key={idx}>{move.name}</li>
                                )
                            }
                        </ul>
                    </div>
                </div>
        )
    }
} 

export default GameMonsterItem;