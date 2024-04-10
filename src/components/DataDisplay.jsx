import { Table, Button } from 'react-bootstrap';
import { createClaimsTable } from '../utils/claimUtils';
import { useState } from 'react';
import { loginRequest } from '../authConfig';
import { callMsGraph } from '../graph';
import { ProfileData } from './ProfileData';

import { useMsal } from '@azure/msal-react';

import '../styles/App.css';

export const IdTokenData = (props) => {
    const tokenClaims = createClaimsTable(props.idTokenClaims);
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    const tableRow = Object.keys(tokenClaims).map((key, index) => {
        return (
            <tr key={key}>
                {tokenClaims[key].map((claimItem) => (
                    <td key={claimItem}>{claimItem}</td>
                ))}
            </tr>
        );
    });

    function RequestProfileData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                callMsGraph(response.accessToken).then((response) => setGraphData(response));
            });
    }

    return (
        <>
            <div className="row">
                <div className="data-area-div column">
                    <h5 className="card-title">Welcome {accounts[0].name}</h5>
                    <br/>
                    {graphData ? (
                        <ProfileData graphData={graphData} />
                    ) : (
                        <Button variant="secondary" onClick={RequestProfileData}>
                            Request Profile Information
                        </Button>
                    )}
                </div>

                <div className="data-area-div column">
                <p>
                    See below the claims in your <strong> ID token </strong>. For more information, visit:{' '}
                    <span>
                        <a href="https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token">
                            docs.microsoft.com
                        </a>
                    </span>
                </p>
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th>Claim</th>
                                <th>Value</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>{tableRow}</tbody>
                    </Table>
                </div>
            </div>
        </>
    );
};