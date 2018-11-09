import React, {Component} from 'react';
import {connect} from 'react-redux';
import {addEmployee} from '../../actions/employee';
import {Button} from 'react-bootstrap';
import './style.css';

class AddNewPage extends Component{
    constructor(props){
        super(props);
        let today = new Date();
        this.state = {
            avatar: "",
            avatarPreview: "vimeo.jpg",
            name: "",
            title: "",
            sex: "",
            start_date: today.getDate() < 10?`${today.getFullYear()}-${today.getMonth()+1}-0${today.getDate()}`: `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`,
            office_phone: "",
            cell: "",
            sms: "",
            email: "",
            manager: "",
            managerName: "",
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.employees.err === null && nextProps.employees.isFetching === false){
            this.props.history.push("/");
        } else if(nextProps.employees.err !== null){
            alert(nextProps.employees.err);
        }
    }

    submitHandler = () => {
        this.props.addNewEmployee(this.state.name, this.state.title, this.state.sex, this.state.start_date, this.state.office_phone, this.state.cell, this.state.sms, this.state.email, this.state.manager, this.state.avatarPreview);
    }

    goBack = () => {
        console.log("Go Back");
        this.props.history.push("/");
    }

    handleImageChange = event => {
        let reader = new FileReader();
        let file = event.target.files[0];
        reader.onloadend = () => {
            this.setState({
                ...this.state,
                avatar: file,
                avatarPreview: reader.result
            });
        };
        reader.readAsDataURL(file);
    }

    changeHandler = (which, event) => {
        switch(which){
            case "name":
                this.setState({
                    ...this.state,
                    name: event.target.value
                }, () => console.log(this.state));
                break;
            case "title":
                this.setState({
                    ...this.state,
                    title: event.target.value
                }, () => console.log(this.state));
                break;
            case "sex":
                this.setState({
                    ...this.state,
                    sex: event
                }, () => console.log(this.state));
                break;
            case "date":
                this.setState({
                    ...this.state,
                    start_date: event.target.value
                }, () => console.log(this.state));
                break;
            case "office":
                this.setState({
                    ...this.state,
                    office_phone: event.target.value
                },() => console.log(this.state));
                break;
            case "cell":
                this.setState({
                    ...this.state,
                    cell: event.target.value
                },() => console.log(this.state));
                break;
            case "sms":
                this.setState({
                    ...this.state,
                    sms: event.target.value
                },() => console.log(this.state));
                break;
            case "email":
                this.setState({
                    ...this.state,
                    email: event.target.value
                },() => console.log(this.state));
                break;
            case "manager":
                let index = event.target.selectedIndex;
                let el = event.target.childNodes[index];
                let option =  el.getAttribute('id');
                this.setState({
                    ...this.state,
                    manager: option,
                    managerName: event.target.value
                }, () => console.log(this.state));
                break;
            default:
                break;
        }
    }

    render(){
        console.log(this.state.start_date);
        return(
            <div className="AddNewPage">
                <div className="submitLine">
                    <h3>New Employee:</h3>
                    <div className="ctrlBtns">
                        <Button bsSize="small" onClick={this.goBack}><i className="fas fa-chevron-left"></i>&nbsp;Back</Button>&nbsp;&nbsp;&nbsp;
                        <Button bsStyle="success" bsSize="small" onClick={this.submitHandler}>Submit</Button>
                    </div>
                </div>
                <br></br>
                <div className="EmployeeInfo">
                    <div className="imgPanel">
                        <img src={this.state.avatarPreview} alt="Avatar"/>
                        <form>
                            <label>
                                <span id="avatarMsg">Please select a photo as avatar:</span>
                                <br></br>
                                <input type="file" onChange={this.handleImageChange}/>
                            </label>
                        </form>
                    </div>
                    <form className="infoForm">
                        <label>
                            Name:<br></br>
                            <input type="text" className="textField" value={this.state.name} onChange={event => this.changeHandler("name", event)}/>
                        </label>
                        <br></br>
                        <label>
                            Title:<br></br>
                            <input type="text" className="textField" value={this.state.title} onChange={event => this.changeHandler("title", event)}/>
                        </label>
                        <br></br>
                        <label>
                            Sex:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <input type="radio" name="gender" defaultValue="M" onChange={() => this.changeHandler("sex", "M")}/>&nbsp;&nbsp;Male&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <input type="radio" name="gender" defaultValue="F" onChange={() => this.changeHandler("sex", "F")}/>&nbsp;&nbsp;Female
                        </label>
                        <br></br>
                        <label>
                            Start Date:<br></br>
                            <input type="date" className="textField" value={this.state.start_date} onChange={event => this.changeHandler("date", event)}/>
                        </label>
                        <br></br>
                        <label>
                            Office Phone:<br></br>
                            <input type="text" className="textField" value={this.state.office_phone} onChange={event => this.changeHandler("office", event)}/>
                        </label>
                        <br></br>
                        <label>
                            Cell Phone:<br></br>
                            <input type="text" className="textField" value={this.state.cell} onChange={event => this.changeHandler("cell", event)}/>
                        </label>
                        <br></br>
                        <label>
                            SMS:<br></br>
                            <input type="text" className="textField" value={this.state.sms} onChange={event => this.changeHandler("sms", event)}/>
                        </label>
                        <br></br>
                        <label>
                            Email:<br></br>
                            <input type="text" className="textField" value={this.state.email} onChange={event => this.changeHandler("email", event)}/>
                        </label>
                        <br></br>
                        <label>
                            Manager:<br></br>
                            <select id="manager" className="textField" value={this.state.managerName} onChange={event => this.changeHandler("manager", event)}>
                                <option value={this.state.manager}>{this.state.managerName}</option>
                                {this.props.employees.data.map(ele => {
                                    return <option value={ele.name} key={ele._id} id={ele._id}>{ele.name}</option>
                                })}
                            </select>
                        </label>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        employees: state.users
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addNewEmployee: (name, title, sex, start_date, office_phone, cell, sms, email, manager, avatar) => dispatch(addEmployee(name, title, sex, start_date, office_phone, cell, sms, email, manager, avatar))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewPage);