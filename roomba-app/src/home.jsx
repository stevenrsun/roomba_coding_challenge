import React, { Component } from 'react';

const indices = {
    ROOM_DIMENSIONS: 0,
    INITIAL_ROOMBA_LOCATION: 1,
    DIRT_LOCATIONS: 2,
    DRIVING_INSTRUCTIONS: 3
}

class Home extends Component {
    state = { 
        file: '',
        result: '',
        arr: [],
        location: []
    }

    uploadJSON = (event) => {
        let reader = new FileReader();
        let file = event.target.files[0];
        this.setState({file: file});

        const blob = new Blob([file], {type:"application/json"});
        reader.onloadend = () => {
            this.setState({
                result: reader.result
            })
            let data = JSON.parse(reader.result);
            let arr = Object.keys(data).map(
                (key) => data[key]
            );
            this.setState({arr});
            this.setState({location: arr[indices.INITIAL_ROOMBA_LOCATION]});
        }

        reader.readAsText(blob)
    }

    renderTable = () => {
        let tableBody = [];
        let numInstructions = this.state.arr[indices.DRIVING_INSTRUCTIONS].length;
        let wallHits = 0;
        let dirtCollected = 0;
        let distanceTraveled = 0;
        let coords = this.state.location;
        let i;
        for(i = 0; i <= numInstructions; i++) {
            // push first row (no direction)
            if(i === 0) {
                tableBody.push(
                    <tr>
                        <th scope="row">{i + 1}</th>
                        <td>{coords[0]}, {coords[1]}</td>
                        <td> </td>
                        <td>0</td>
                        <td>0</td>
                    </tr>
                )
            }
            // push remaining rows
            else {
                // find next location of roomba
                let action = this.state.arr[indices.DRIVING_INSTRUCTIONS][i - 1];
                if(action === "W") {
                    // wall hit? (current row = 0)
                    if(coords[0] === 0) {
                        action = "";
                        ++wallHits;
                    }
                    // else check if dirt was collected
                    else {
                        --coords[0];
                        ++distanceTraveled;
                        if(this.foundDirt(coords)) {
                            ++dirtCollected;
                        }
                    }
                }
                else if(action === "N") {
                    // wall hit? 
                    if(coords[1] === this.state.arr[indices.ROOM_DIMENSIONS][1] - 1) {
                        action = "";
                        ++wallHits;
                    }
                    // else check if dirt was collected
                    else {
                        ++coords[1];
                        ++distanceTraveled;
                        if(this.foundDirt(coords)) {
                            ++dirtCollected;
                        }
                    }
                }
                else if(action === "E") {
                    // wall hit? 
                    if(coords[0] === this.state.arr[indices.ROOM_DIMENSIONS][0] - 1) {
                        action = "";
                        ++wallHits;
                    }
                    // else check if dirt was collected
                    else {
                        ++coords[0];
                        ++distanceTraveled;
                        if(this.foundDirt(coords)) {
                            ++dirtCollected;
                        }
                    }
                }
                else if(action === "S") {
                    // wall hit? 
                    if(coords[1] === 0) {
                        action = "";
                        ++wallHits;
                    }
                    // else check if dirt was collected
                    else {
                        --coords[1];
                        ++distanceTraveled;
                        if(this.foundDirt(coords)) {
                            ++dirtCollected;
                        }
                    }
                }
                tableBody.push(
                    <tr>
                        <th scope="row">{i + 1}</th>
                        <td>{coords[0]}, {coords[1]}</td>
                        <td>{action}</td>
                        <td>{dirtCollected}</td>
                        <td>{wallHits}</td>
                    </tr>
                )
            }
        }
        let table = 
            <div>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Step</th>
                            <th scope="col">Roomba Location</th>
                            <th scope="col">Action</th>
                            <th scope="col">Total Dirt Collected</th>
                            <th scope="col">Total Wall Hits</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableBody}
                    </tbody>
                </table>
                <p>Final Position: {coords[0]}, {coords[1]}</p>
                <p>Total Dirt Collected: {dirtCollected}</p>
                <p>Total Distance Traveled: {distanceTraveled}</p>
                <p>Total Walls Hit: {wallHits}</p>
            </div>
        return table;
    }

    foundDirt = (coords) => {
        let i;
        let arr = this.state.arr[indices.DIRT_LOCATIONS];
        for(i = 0; i < arr.length; i++) {
            if(coords[0] === arr[i][0] && coords[1] === arr[i][1])
                return true;
        }
        return false;
    }

    render() { 
        return ( 
            <div>
                <input type="file"
                name="myFile"
                onChange={this.uploadJSON} />
                {this.state.arr.length === 0 ? null : this.renderTable()
                }
            </div>
         );
    }
}
 
export default Home;