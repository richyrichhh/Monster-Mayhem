// import React from 'react';
// const _ = require('underscore');

// const currentUser = {
//   id: 0
// };

// export default class EditTeam extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       team: this.props.teams[currentUser.id],
//       monsters: this.props.monsters
//     }
//   }

//   componentDidMount() {
//     if(_.isEmpty(this.state.team)) this.props.fetchTeam(currentUser.id).then(payload => this.setState({team: payload.team}));
//     if(_.isEmpty(this.state.monsters)) this.props.fetchMonsters().then(payload => this.setState({monsters: payload.monsters}));
//   }

//   handleSubmit() {
//     let newTeam = Object.assign({}, this.state.team);
//     for (var i of [0, 1]) {
//       newTeam[i].monster = document.getElementById(`select-monster-${i}`);
//       newTeam[i].monster.moves = [document.getElementById(`pick-move-1-${i}`), document.getElementById(`pick-move-2-${i}`), document.getElementById(`pick-move-3-${i}`), document.getElementById(`pick-move-4-${i}`)];
//     }
//     this.props.updateTeam(newTeam);
//   }

//   handleUpdate(i, prop, val) {
//     let newState = Object.assign({}, this.state);
//     Object.assign(newState.team[i], {[prop]: val});
//     this.setState(newState);
//   }

//   render() {
//     const { team, monsters } = this.state;
//     // const { monsters } = this.state;
//     return (
//       <div id="edit-team-div">
//         {team.map((monster, i) => {( 
//           <form>
//             <label>
//               Monster:
//               <select id={`select-monster-${i}`} className="select-monster">
//                 {monsters.map( mon => {(
//                   <option value={mon.name}>{mon.name}</option>
//                 )})}
//               </select>
//             </label>

//             <label>
//               Move 1:
//               <select id={`pick-move-1-${i}`}className="pick-move">
//                 {monster.moves.map( move => {(
//                   <option value={move.name}>{move.name}</option>
//                 )})}
//               </select>
//             </label>
//             <label>
//               Move 2:
//               <select id={`pick-move-2-${i}`}>
//                 {monster.moves.map( move => {(
//                   <option value={move.name}>{move.name}</option>
//                 )})}
//               </select>
//             </label>
//             <label>
//               Move 3:
//               <select id={`pick-move-3-${i}`}>
//                 {monster.moves.map( move => {(
//                   <option value={move.name}>{move.name}</option>
//                 )})}
//               </select>
//             </label>
//             <label>
//               Move 4:
//               <select id={`pick-move-3-${i}`}>
//                 {monster.moves.map( move => {(
//                   <option value={move.name}>{move.name}</option>
//                 )})}
//               </select>
//             </label>

//             <input id="edit-team-form-submit" type="submit" value="Update Team" />
//           </form>
//         )})}  
//       </div>
//     )
//   }
// }