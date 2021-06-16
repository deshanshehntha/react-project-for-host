import React from "react";
import PanelHeader from "../components/PanelHeader/PanelHeader";
import {Alert, Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Row, Table} from "reactstrap";
import Searchable from 'react-searchable-dropdown';
import axios from "axios";
import {tbody} from "../variables/general";

import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import '@react-pdf-viewer/core/lib/styles/index.css';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { SpecialZoomLevel, Viewer } from '@react-pdf-viewer/core';


class ViewMedicalReports extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [
                { headerName: 'Patient', field: 'patientName' },
                { headerName: 'Ref. Doctor', field: 'doctorName' },
                { headerName: 'Created Date', field: 'createdDateTime', sortable : true},
                { headerName: 'Required Date', field: 'requiredDateTime' },


            ],
            rowData: [],
            base64data : "",
            viewMode : false,
            rowSelection: 'single',
        }
    }

    onSelectionChanged = () => {
        var selectedRows = this.gridApi.getSelectedRows();
        const id = selectedRows[0].medicalReportDbId;
        axios.get("http://localhost:2021/api/v1/medicalReport/"+id+"/print")
            .then(result => {
                    this.setState({
                        base64data: result.data
                    })

                }
            )
            .catch(error => {
                console.log(error);
            })
        this.setState({
            viewMode : true
        })
    };

    onGridReady = (params) => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        const updateData = (data) => {
            this.setState({ rowData: data });
        };

        fetch('http://localhost:2021/api/v1/medicalReport')
            .then((resp) => resp.json())
            .then((data) => updateData(data));
    };

    componentDidMount() {

        axios.get("http://localhost:2021/api/v1/medicalReport")
            .then(result => {
                this.setState({
                    rowData : result.data
                })
            })
            .catch(err => console.log(err))
    }


    render() {

        if (!this.state.viewMode) {
            return (
                <>
                    <PanelHeader size="sm"/>
                    <div className="content">
                        <Row>
                            <Col md="12">
                                <Card>
                                    <CardHeader>
                                        <h4 className="title">View Reports</h4>
                                    </CardHeader>
                                    <CardBody>

                                        <div
                                            className="ag-theme-alpine"
                                            style={{
                                                height: '500px',
                                                width: '100%'
                                            }}
                                        >
                                            <AgGridReact
                                                columnDefs={this.state.columnDefs}
                                                rowData={this.state.rowData}
                                                // defaultColDef={this.state.defaultColDef}
                                                rowSelection={this.state.rowSelection}
                                                onGridReady={this.onGridReady}
                                                onSelectionChanged={this.onSelectionChanged.bind(this)}
                                            >
                                            </AgGridReact>
                                        </div>

                                        {/*<div>*/}
                                        {/*    <img width='100%' height='100%' src={`data:image/jpg;base64,${this.state.base64data}`}/>:*/}
                                        {/*</div>*/}
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </>
            );

        } else {
            return (
                <>
                    <PanelHeader size="sm"/>
                    <div className="content">
                        <Row>
                            <Col md="12">
                                <Card>
                                    <CardHeader>
                                        <h4 className="title">View Reports</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <div>
                                            <img width='100%' height='100%' src={`data:image/jpg;base64,${this.state.base64data}`}/>:
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </>
            );
        }
    }

}

export default ViewMedicalReports;
