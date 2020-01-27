import React, { Component } from "react";
import { render } from "react-dom";
import './index.css';
import ApolloClient from "apollo-boost";
import { Query, ApolloProvider } from '@apollo/react-components';
import gql from "graphql-tag";

const client = new ApolloClient({
    uri: 'http://smart-meeting.herokuapp.com'
});

export const BUILDING_QUERY = gql`
    query BuildingQuery($id : Int!){
        Building(id: $id){
            meetingRooms{
				name,
      	        floor,
                building {
                    name
                }
				meetings {
                    title
				}
            }
        }
    }
`;

export const BUILDINGS_QUERY = gql`
    {
        Buildings{
            id,
            name
        }
    }
`;


class AppContainer extends Component {
    constructor(){
        super();
        this.state = {
            selectedBuilding: 1,
        };
    };
    
    onSelectBuilding = ({ selectedBuilding }) => {
        this.setState({ selectedBuilding });
    }
    render() {
        return <div>
            <ShowBuildings onChange={this.onSelectBuilding} />
            <ShowMeetingRooms selectedBuilding={this.state.selectedBuilding}></ShowMeetingRooms>
        </div>
    }

}

const renderRooms = (meetingRooms=[]) =>{
   return meetingRooms.map(({ name, meetings }, i) => {
        return (
            <div key={i}>
                <h1>{name}</h1>
            </div>
            // <div>
            //     {title}
            //     {date}
            //     {`${startTime} to ${endTime}`}
            //     {name}
            // </div>
        )
    })
}

class ShowMeetingRooms extends Component{
   constructor(props){
       super(props)
       this.state = {
           Building: null
       }
   }

    render() {
        const {selectedBuilding: id} = this.props;
        return (<Query query={BUILDING_QUERY} variables={{id}}>
                {
                    ({loading, data})=>{
                        return loading ? <p>loading...</p> :  <div className="meetingRooms">
                        {
                            renderRooms(data.Building && data.Building.meetingRooms)
                        }
                    </div>
                    }
                }
            </Query>
        )
    }     
}

const ShowBuildings = (props) => {
    return (<Query query={BUILDINGS_QUERY}>
        {
            ({ loading, data })=>{
                console.log(data)
            return  loading ? <p>loading...</p> : <select className="form-control"
                        onChange={event => props.onChange({ selectedBuilding: Number(event.target.value) })}>
                        {
                            (data.Buildings || []).map(({ name, id }, i) => {
                                return (
                                    <option key={i} value={id}>
                                        {name}
                                    </option>
                                )
                            })
                        }
                    </select>
            }
           
        }
    </Query>
    )
}

const MeetingSchedulerApp = () => (
    <ApolloProvider client={client}>
        <AppContainer />
    </ApolloProvider>
);

render(<MeetingSchedulerApp />, document.getElementById("root"));



