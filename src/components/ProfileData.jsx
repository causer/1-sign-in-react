import React from "react";
import '../styles/App.css';
import { Table } from 'react-bootstrap';

/**
 * Renders information about the user obtained from MS Graph 
 * @param props
 */
export const ProfileData = (props) => { 
    return (
        <div className="profile-div">
            <Table responsive striped bordered hover>
                <thead>
                    <tr>
                        <th>Param</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>First Name</td>
                        <td>{props.graphData.givenName}</td>
                    </tr>
                    <tr>
                        <td>Last Name</td>
                        <td>{props.graphData.surname}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>{props.graphData.userPrincipalName}</td>
                    </tr>
                    <tr>
                        <td>Id</td>
                        <td>{props.graphData.id}</td>
                    </tr>
                </tbody>
            </Table>
        </div>
  );
};