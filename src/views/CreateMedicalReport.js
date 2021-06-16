import React from "react";
import PanelHeader from "../components/PanelHeader/PanelHeader";
import {Alert, Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Row, Table} from "reactstrap";
import Searchable from 'react-searchable-dropdown';
import axios from "axios";
import {tbody} from "../variables/general";

const thead = ["Test Name", "Value", "Unit", "Target Value"];


class CreateMedicalReport extends React.Component {

    constructor(props) {
        super(props);
        this.onAddTest = this.onAddTest.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeValueInput = this.onChangeValueInput.bind(this);
        this.notify = this.notify.bind(this)

        this.state = {
            tests : [],
            inputRows : [],
            patient : "",
            doctor : "",
            testAndValues : [],
            visible: false,

        }

    }

    onChangeValueInput(object) {
        let temArr = this.state.testAndValues

        const test = temArr.find(obj => obj.test === object.test)

        if(test === undefined || test === null) {
            temArr.push(object);
            this.setState({
                testAndValues : temArr
            });
        } else {
            let tempArray = temArr.filter(obj => obj.test !== object.test);
            tempArray.push(object);
            this.setState({
                testAndValues : tempArray
            });
        }

        console.log(this.state.testAndValues);
    }

    handleSubmit() {

        let tests = []
        this.state.testAndValues.forEach(val => {
            const obj = {
                reportFormat : {
                    reportFormatId : val.test,
                },
                value : val.value
            }
            tests.push(obj);
        })

        const object = {
            patientName : this.state.patient,
            doctorName : this.state.doctor,
            reportToFormatRelationships : tests
        }



        axios.post("http://localhost:2021/api/v1/medicalReport",object)
            .then(r => this.notify(1))
            .catch(error => this.notify(2))


    }

    fetchReportFormat(id) {
        axios.get("http://localhost:2021/api/v1/reportFormat/" + id)
            .then(result => {
                console.log(result.data)
                return result.data;
            })
            .catch(error => {
                console.log(error);
                return null;
            })


         // axios.get("http://localhost:2021/api/v1/reportFormat/" + id)
         //        .then(result => {
         //            let tempInputRow = [];
         //            tempInputRow.push(result.data.test);
         //            tempInputRow.push(
         //                <Input
         //                    placeholder={"Value"}
         //                    onChange={(e) => {
         //                        const obj = {
         //                            test : result.data.reportFormatId,
         //                            value : e.target.value
         //                        }
         //                        this.onChangeValueInput(obj)
         //                    }}
         //                />
         //            );
         //            tempInputRow.push(result.data.unit);
         //            tempInputRow.push(result.data.targetValue);
         //            const obj = {
         //                test : result.data.reportFormatId,
         //                className: "table-info",
         //                data: tempInputRow
         //            }
         //            inputRowsArray.push(obj)
         //            this.setState({
         //                inputRows : inputRowsArray
         //            })
         //        })
         //        .catch(error => {
         //            console.log(error);
         //        })

    }

    onAddTest(valueIds) {
        console.log(valueIds)
        if(valueIds.length  === 0) {
            this.setState({
                inputRows : []
            });
        } else {

            let allInputRows = this.state.inputRows;
            let newTestIds = [];
            let removedTestIds = [];
            const allCurrentTestIds = this.state.inputRows.map(obj => obj.test);
            valueIds.forEach(id => {
                if(!allCurrentTestIds.includes(id)) {
                    newTestIds.push(id);
                }
            })

            allCurrentTestIds.forEach(currentId => {
                if(!valueIds.includes(currentId)) {
                    removedTestIds.push(currentId);
                }
            })

            if(removedTestIds.length !== 0) {
                removedTestIds.forEach(id => {
                    allInputRows = allInputRows.filter(obj => obj.test !== id)
                })
            }

            if(newTestIds.length !== 0) {
                newTestIds.forEach(id => {
                    axios.get("http://localhost:2021/api/v1/reportFormat/" + id)
                        .then(result => {
                            const reportFormat = result.data
                            if (reportFormat !== null) {
                                let tempInputRow = [];
                                tempInputRow.push(reportFormat.test);
                                tempInputRow.push(
                                    <Input
                                        placeholder={"Value"}
                                        onChange={(e) => {
                                            const obj = {
                                                test: reportFormat.reportFormatId,
                                                value: e.target.value
                                            }
                                            this.onChangeValueInput(obj)
                                        }}
                                    />
                                );
                                tempInputRow.push(reportFormat.unit);
                                tempInputRow.push(reportFormat.targetValue);
                                const obj = {
                                    test: reportFormat.reportFormatId,
                                    className: "table-info",
                                    data: tempInputRow
                                }
                                allInputRows.push(obj);
                                this.setState({
                                    inputRows: allInputRows
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        })
                })
            }

            this.setState({
                inputRows: allInputRows
            })
        }
    }

    componentDidMount() {
            axios.get("http://localhost:2021/api/v1/reportFormat/")
                .then(result => {
                    console.log(result.data);
                    let array = []
                    if(result.data !== undefined && result.data !== []) {
                        result.data.forEach(test => {
                            const obj = {
                                value : test.reportFormatId,
                                label : test.test
                            }
                            array.push(obj);
                        })
                    }
                    console.log(array)
                    this.setState({
                        tests : array
                    })


                })
                .catch(error => {
                    console.log(error);
                })
    }
    notify(color) {
        var type;
        switch (color) {
            case 1:
                type = "success";
                break;
            case 2:
                type = "danger";
                break;
            default:
                break;
        }
        var options = {};
        options = {
            place: "tc",
            message: (
                <div>
                    <div>
                        Action Successfully Executed
                    </div>
                </div>
            ),
            type: type,
            icon: "now-ui-icons ui-1_bell-53",
            autoDismiss: 7,
        };
        this.refs.notificationAlert.notificationAlert(options);

    }

    render() {
        return(
            <>
                <PanelHeader size="sm"/>
                <Alert
                    color="info"
                    isOpen={this.state.visible}
                    toggle={this.onDismiss}
                >
                    <span>This is a notification with close button.</span>
                </Alert>

                <div className="content">
                    <Row>
                        <Col md="12">
                            <Card>
                                <CardHeader>
                                    <h4 className="title">Create New Medical Report</h4>
                                </CardHeader>
                                <CardBody>
                                    <Form onSubmit={this.handleSubmit}>
                                        <br/><br/>
                                        <Row>
                                            <Col md="6">
                                                <FormGroup>
                                                    <label><h6>Patient Name</h6></label>
                                                    <Input
                                                        placeholder="Name"
                                                        type="text"
                                                        onChange ={(e) => {this.setState({
                                                            patient : e.target.value
                                                        })}}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md="6">
                                                <FormGroup>
                                                    <label><h6>Age</h6></label>
                                                    <Input placeholder="Doctor"
                                                           type="text"
                                                           onChange ={(e) => {this.setState({
                                                               doctor : e.target.value
                                                           })}}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <br/>
                                        <Row>
                                            <Col md="6">
                                                <FormGroup>
                                                    <label><h6>Test</h6></label>
                                                    <Searchable
                                                        value=""
                                                        multiple
                                                        hideSelected
                                                        placeholder="Search" // by default "Search"
                                                        notFoundText="No result found" // by default "No result found"
                                                        options={this.state.tests}
                                                        onSelect={value => {
                                                            this.onAddTest(value);
                                                        }}
                                                        listMaxHeight={200} //by default 140
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <br/>
                                        <Row>
                                            <Col md="12">
                                            <Table responsive>
                                                <thead className="text-primary">
                                                <tr>
                                                    {thead.map((prop, key) => {
                                                        if (key === thead.length - 1) {
                                                            return (
                                                                <th key={key} className="text-left">
                                                                    <h6>{prop}</h6>
                                                                </th>
                                                            );
                                                        }
                                                        return <th key={key}><h6>{prop}</h6></th>;
                                                    })}
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {this.state.inputRows.map((prop, key) => {
                                                    return (
                                                        <tr key={key}>
                                                            {prop.data.map((prop, key) => {
                                                                if (key === thead.length - 1) {
                                                                    return (
                                                                        <td key={key} className="text-left">
                                                                            <h6>{prop}</h6>
                                                                        </td>
                                                                    );
                                                                }
                                                                return <td key={key}><h6>{prop}</h6></td>;
                                                            })}
                                                        </tr>
                                                    );
                                                })}
                                                </tbody>
                                            </Table>
                                            </Col>
                                        </Row>
                                        <Button type="submit"
                                                color={"success"}
                                                value="Submit"> Submit </Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }

}

export default CreateMedicalReport;
