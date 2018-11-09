import React, {Component} from 'react';
import {Route, BrowserRouter} from 'react-router-dom';
import UserPage from '../../containers/UserPage';
import AddNewPage from '../../containers/AddNewPage';
import EditPage from '../../containers/EditPage';

class App extends Component{
    render(){
        return (
            <BrowserRouter>
                <div>
                    <Route 
                        exact={true}
                        path="/"
                        component={UserPage}
                    />
                    <Route 
                        path="/addEmployee"
                        component={AddNewPage}
                    />
                    <Route 
                        path="/editEmployee/:employeeId"
                        component={EditPage}
                    />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;