import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions/employee';
import * as filterActions from '../../actions/filter';

import UserList from '../../components/UserList';
import {Button} from 'react-bootstrap';
import './style.css';

class UserPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            searchFilter: "",
        };
    }
    componentDidMount(){
        this.props.getAll();
    }

    toNewEmployeePage = () => {
        this.props.history.push("/addEmployee");
    }

    toEditPage = id => {
        this.props.history.push(`/editEmployee/${id}`);
    }

    searchHandler = event => {
        this.setState({
            searchFilter: event.target.value
        });
        this.props.setSearchFilter(event.target.value);
    }

    resetHandler = () => {
        this.setState({
            searchFilter: ""
        });
        this.props.resetFilter();
    }

    searchFieldResetHandler = () => {
        this.setState({
            searchFilter: ""
        });
    }

    render(){
        let finalList = this.props.employees;
        if(this.props.filter.type === "search"){
            finalList = finalList.filter(ele => {
                let found = false;
                for(let p in ele){
                    if(p !== "_id" && p !== "avatar" && p !== "manager" && p !== "dr" && p !=="bosses" && ele[p].toString().toLowerCase().indexOf(this.props.filter.search.toLowerCase()) !== -1){
                        found = true;
                        break;
                    }
                }
                return found;
            });
        } else if(this.props.filter.type === "arr"){
            finalList = finalList.filter(ele => this.props.filter.arr.includes(ele._id));
        }
        return(
            <div className="EmployeePage">
                <div className="searchBar">
                    <form>
                        Search:&nbsp;&nbsp;<input type="text" placeholder="Search Employee" value={this.state.searchFilter} onChange={this.searchHandler}/>
                    </form>
                    <div>
                        {(this.props.filter.type === "" || (this.props.filter.search === "" && this.props.filter.arr.length === 0))?
                            <Button bsSize="small" disabled onClick={this.resetHandler}>Reset Filter</Button>:
                            <Button bsSize="small" onClick={this.resetHandler}>Reset Filter</Button>
                        }&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button bsStyle="success" bsSize="small" onClick={this.toNewEmployeePage}>Add New Employee</Button>
                    </div>
                </div>
                <UserList
                    employees={finalList}
                    editHandler={this.toEditPage}
                    deleteHandler={this.props.deleteEmployee}
                    arrFilterHandler = {this.props.setArrFilter}
                    searchFieldResetHandler = {this.searchFieldResetHandler}
                ></UserList>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        employees: state.users.data,
        filter: state.filter
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getAll: () => dispatch(actions.getAllEmployees()),
        deleteEmployee: id => dispatch(actions.deleteEmployee(id)),
        setSearchFilter: str => dispatch(filterActions.setSearchFilter(str)),
        setArrFilter: arr => dispatch(filterActions.setArrFilter(arr)),
        resetFilter: () => dispatch(filterActions.resetFilter())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);