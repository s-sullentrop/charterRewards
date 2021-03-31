import React from 'react';
import {render} from 'react-dom';
import _ from 'lodash';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import './index.css';
import {customerData} from'./data/customerData.js';

// import * as serviceWorker from './serviceWorker';

class App extends React.Component {
    constructor(props){
        super(props);
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul', 'Aug','Sep','Oct', 'Nov','Dec'];
        customerData.forEach(function(element) {
            element.points = computeInvoicePoints(element.invoiceAmt);
        });
        customerData.forEach(function(element) {
            var dt = new Date(element.invoiceDate);
            var m = dt.getMonth();
            element.month = months[m];
        });
        this.state = {
            customerData
        };
    }
    render(){
        const data = this.state.customerData;
        return(
            <div>
                <ReactTable
                    data={data}
                    columns={[
                        {
                            Header: 'Customer',
                            columns: [
                                {
                                    Header: 'Customer Id',
                                    accessor: 'custId'
                                },
                                {
                                    Header: 'Month',
                                    accessor: 'month'
                                },
                                {
                                    Header: 'Sales ($)',
                                    accessor: 'invoiceAmt',
                                    aggregate: vals => _.sum(vals),
                                    Aggregated: row =>{
                                        return(
                                            <span>
                                            {row.value.toFixed(2)}
                                            </span>
                                        )
                                    },
                                },
                                {
                                    Header: 'Points',
                                    accessor: 'points',
                                    aggregate: vals => _.sum(vals),
                                    Aggregated: row =>{
                                        return (
                                            <span>
                                            {row.value}
                                        </span>
                                        )
                                    }
                                }
                            ]
                        }
                    ]
                }
                pivotBy={['custId', 'month']}
                className='-striped -highlight'
                />
            </div>
        )
    }
}

function computeInvoicePoints(amt) {
    var intAmt = parseInt(amt);
    if(!amt || isNaN(intAmt))
        return null;
    else if(intAmt < 50)
        return 0;
    else if(intAmt >= 50 && intAmt < 100)
        return intAmt -49;
    else if(intAmt >= 100)
        return 50 + ((intAmt - 99) * 2);
    else
        return null;
}



const rootElement = document.getElementById('root');
render(<App />, rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
