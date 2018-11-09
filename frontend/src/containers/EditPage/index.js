import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions/target';
import {Button} from 'react-bootstrap';
import './style.css';

class EditPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            avatar: "",
            avatarPreview: "../vimeo.jpg",
            name: "",
            title: "",
            sex: "",
            start_date: "",
            office_phone: "",
            cell: "",
            sms: "",
            email: "",
            manager: "",
            managerName: "",
        }
    }

    componentDidMount(){
        //console.log("Mount: " + this.props.match.params.employeeId);
        this.props.getTarget(this.props.match.params.employeeId);
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps.targetEmployee);
        if(nextProps.targetEmployee.editSucceed === true){
            this.props.history.push("/");
        } else if(nextProps.targetEmployee.isFetching === false && nextProps.targetEmployee.err === null){
            this.setState({
                avatar: "",
                avatarPreview: nextProps.targetEmployee.data[0].avatar === "none"? "../vimeo.jpg": nextProps.targetEmployee.data[0].avatar,
                name: nextProps.targetEmployee.data[0].name,
                title: nextProps.targetEmployee.data[0].title,
                sex: nextProps.targetEmployee.data[0].sex,
                start_date: nextProps.targetEmployee.data[0].start_date,
                office_phone: nextProps.targetEmployee.data[0].office_phone,
                cell: nextProps.targetEmployee.data[0].cell,
                sms: nextProps.targetEmployee.data[0].sms,
                email: nextProps.targetEmployee.data[0].email,
                manager: nextProps.targetEmployee.data[0].manager === null? "": nextProps.targetEmployee.data[0].manager._id,
                managerName: nextProps.targetEmployee.data[0].manager === null? "": nextProps.targetEmployee.data[0].manager.name
            });
        }
    }

    submitHandler = () => {
        this.props.modifyTarget(this.props.match.params.employeeId, this.state.name, this.state.title, this.state.sex, this.state.start_date, this.state.office_phone, this.state.cell, this.state.sms, this.state.email, this.state.manager, this.state.avatarPreview);
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
        return(
            <div className="EditPage">
                <div className="submitLine">
                    <h3>Edit Employee:</h3>
                    <div className="ctrlBtns">
                        <Button bsSize="small" onClick={this.goBack}><i className="fas fa-chevron-left"></i>&nbsp;Back</Button>&nbsp;&nbsp;&nbsp;
                        <Button bsStyle="success" bsSize="small" onClick={this.submitHandler}>Modify</Button>
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
                            {this.state.sex === "M"?
                                <input type="radio" name="gender" defaultValue="M" onChange={() => this.changeHandler("sex", "M")} defaultChecked/>:
                                <input type="radio" name="gender" defaultValue="M" onChange={() => this.changeHandler("sex", "M")}/>
                            }&nbsp;&nbsp;Male&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            {this.state.sex === "F"?
                                <input type="radio" name="gender" defaultValue="F" onChange={() => this.changeHandler("sex", "F")} defaultChecked/>:
                                <input type="radio" name="gender" defaultValue="F" onChange={() => this.changeHandler("sex", "F")}/>
                            }&nbsp;&nbsp;Female
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
                                <option value="" id=""> </option>
                                {this.props.employees.map(ele => {
                                    return <option value={ele.name} key={ele._id} id={ele._id}>{ele.name}</option>
                                })}
                            </select>
                            <span className="errMsg">{this.props.targetEmployee.circleCheck === true? "Invalid manager, causing circle, please check!": ""}</span>
                        </label>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        employees: state.users.data,
        targetEmployee: state.targetUser
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getTarget: id => dispatch(actions.getTarget(id)),
        modifyTarget: (id, name, title, sex, start_date, office_phone, cell, sms, email, manager, avatar) => dispatch(actions.modifyTarget(id, name, title, sex, start_date, office_phone, cell, sms, email, manager, avatar))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPage);