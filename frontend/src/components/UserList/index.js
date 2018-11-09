import React, {Component} from 'react';
import './style.css';

class UserList extends Component{
    editHandler = id => {
        this.props.editHandler(id);
    }

    setManagerFilter = m => {
        if(m !== null){
            this.props.searchFieldResetHandler();
            this.props.arrFilterHandler([m._id]);
        }
    }

    setDrFilter = drs => {
        this.props.searchFieldResetHandler();
        this.props.arrFilterHandler(drs);
    }

    render(){
        console.log(this.props.employees);
        return(
            <div className="EmployeeList">
                <table className="EmployeeTable">
                    <thead>
                        <tr>
                            <th>&nbsp;</th>
                            <th>Name</th>
                            <th>Title</th>
                            <th>Sex&nbsp;&nbsp;</th>
                            <th>Start Date</th>
                            <th>Office Phone</th>
                            <th>Cell Phone</th>
                            <th>SMS</th>
                            <th>Email</th>
                            <th>Manager&nbsp;&nbsp;</th>
                            <th># of DR</th>
                            <th> </th>
                            <th> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.employees.map(ele => {
                            return <tr key={ele._id}>
                                <td>{ele.avatar === "none"? <img src="vimeo.jpg" alt="Avatar" className="avatar"/>: <img src={ele.avatar} alt="Avatar" className="avatar"/>}</td>
                                <td>{ele.name}</td>
                                <td>{ele.title}</td>
                                <td>{ele.sex}</td>
                                <td>{ele.start_date}</td>
                                <td><a href={`tel:${ele.office_phone}`}>{ele.office_phone}</a></td>
                                <td><a href={`tel:${ele.cell}`}>{ele.cell}</a></td>
                                <td>{ele.sms}</td>
                                <td><a href={`mailto:${ele.email}`}>{ele.email}</a></td>
                                <td><a onClick={() => this.setManagerFilter(ele.manager)}>{ele.manager === null? "": ele.manager.name}</a></td>
                                <td>{ele.dr.length === 0? 0: <a onClick={() => this.setDrFilter(ele.dr)}>{ele.dr.length}</a>}</td>
                                <td><button onClick={() => this.editHandler(ele._id)}><i className="far fa-edit fa-lg"></i>&nbsp;Edit</button></td>
                                <td><button id="delBtn" onClick={() => this.props.deleteHandler(ele._id)}><i className="far fa-times-circle fa-lg"></i></button></td>
                            </tr>;
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default UserList;