import React from "react";
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Form,
    FormGroup,
    Input,
    Row,
    Table,
} from "reactstrap";

import PanelHeader from "components/PanelHeader/PanelHeader.js";
import NotificationAlert from "react-notification-alert";
import {tbody} from "variables/general";
import axios from "axios"
import {ButtonGroup} from "@material-ui/core";

const thead = ["Format Id", "Test Name", "Unit", "Target Value"];
const attributeThead = ["Added Attributes"];
const tableViewMode = "TABLE"
const viewEachMode = "VIEW"
const editMode = "EDIT"
const createMode = "CREATE"

class ReportFormat extends React.Component {

    constructor(props) {
        super(props);
        this.onChangeViewDetails = this.onChangeViewDetails.bind(this);
        this.onChangeEditModeTrue = this.onChangeEditModeTrue.bind(this);
        this.onChangeEditModeFalse = this.onChangeEditModeFalse.bind(this);
        this.onCloseViewMode = this.onCloseViewMode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeFormatName = this.handleChangeFormatName.bind(this)
        this.notify = this.notify.bind(this);
        this.onChangeDeleteReportFormat = this.onChangeDeleteReportFormat.bind(this);
        this.handleChangeUnit = this.handleChangeUnit.bind(this);
        this.handleChangeTargetValue = this.handleChangeTargetValue.bind(this);


        this.state = {
            formats: [],
            show: false,
            focussedObject: null,
            attributes: [],
            disabled: true,
            createModeEnabled: false,
            attributesToBeCreated: [],
            values: [],
            formatName: "",
            visible: false,
            activeMode: tableViewMode,
            unit: "",
            targetValue: ""
        }

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

    handleChangeFormatName(event) {
        this.setState({formatName: event.target.value});
    }

    handleChangeUnit(event) {
        this.setState({unit: event.target.value});
    }

    handleChangeTargetValue(event) {
        this.setState({targetValue: event.target.value});
    }

    onChangeCreateModeOn() {
        this.setState({
            activeMode: createMode
        })
    }

    onChangeCreateModeOff() {
        this.setState({
            activeMode: tableViewMode
        })
    }

    onChangeEditModeTrue() {
        this.setState({
            disabled: false
        })
    }

    onChangeEditModeFalse() {
        this.setState({
            disabled: true
        })
    }

    onCloseViewMode() {
        this.setState({
            activeMode: tableViewMode,
        })
    }

    // addInputs() {
    //     return this.state.values.map((el, i) =>
    //
    //         <div key={i}>
    //             <Input placeholder="Add attribute here" value={el || ''} onChange={this.handleChange.bind(this, i)}/>
    //             <Button
    //                 color="danger"
    //                 value='remove'
    //                 onClick={this.removeClick.bind(this, i)}>
    //                 Remove
    //             </Button>
    //         </div>
    //     )
    // }

    handleChange(i, event) {
        let values = [...this.state.values];
        values[i] = event.target.value;
        this.setState({values});
    }

    // addClick() {
    //     this.setState(prevState => ({values: [...prevState.values, '']}))
    // }

    // removeClick(i) {
    //     let values = [...this.state.values];
    //     values.splice(i, 1);
    //     this.setState({values});
    // }

    handleSubmit(event) {
        event.preventDefault();
        const obj = {
            test: this.state.formatName,
            unit: this.state.unit,
            targetValue: this.state.targetValue
        }

        axios.post("http://localhost:2021/api/v1/reportFormat/", obj).then(result => {
            console.log(result);
            this.notify(1);
            this.setState({
                activeMode: tableViewMode
            })
            this.fetchReportFormats()
        }).catch(error => {
            console.log(error);
            this.notify(2)
        })

        this.setState({
            createModeEnabled: false
        })
    }

    onChangeDeleteReportFormat(e) {
        axios.delete("http://localhost:2021/api/v1/reportFormat/" + e)
            .then(result => {
                console.log(result);
                this.notify(1);
                this.fetchReportFormats();
            })
            .catch(error => {
                console.log(error);
            })
    }

    fetchReportFormats() {
        axios.get("http://localhost:2021/api/v1/reportFormat/")
            .then(result => {
                console.log(result)
                if (result.data !== null) {
                    var dataArray = []
                    const reports = result.data;
                    reports.forEach(format => {
                        var rowArray = []
                        rowArray.push(format.reportFormatId);
                        rowArray.push(format.test);
                        rowArray.push(format.unit);
                        rowArray.push(format.targetValue);
                        rowArray.push(
                            <Row>
                                <Col xs={6}>
                                    <Button
                                        color="primary"
                                        block
                                        onClick={() => this.onChangeViewDetails(format.reportFormatId)}
                                    >
                                        View
                                    </Button>
                                </Col>
                                <Col xs={6}>
                                    <Button
                                        color="warning"
                                        block
                                        onClick={() => this.onChangeDeleteReportFormat(format.reportFormatId)}
                                    >
                                        Delete
                                    </Button>
                                </Col>
                            </Row>
                        )
                        const obj = {
                            className: "table-info",
                            data: rowArray
                        }
                        dataArray.push(obj);
                    })

                    this.setState({
                        formats: dataArray
                    })
                }

            })
            .catch(error => console.log(error))
    }

    onChangeViewDetails(e) {
        console.log(e)

        this.setState({
            show: false,
            currentFocusedId: e,
            activeMode: viewEachMode
        });

        axios.get("http://localhost:2021/api/v1/reportFormat/" + e)
            .then(result => {
                console.log(result.data)
                this.setState({
                    focussedObject: result.data
                })

            })
            .catch(error => {
                console.log(error)
            })

        this.setState({
            show: true,
            currentFocusedId: e
        });
    }

    componentDidMount() {
        this.fetchReportFormats()
    }

    render() {
        return (
            <>
                <PanelHeader size="sm"/>
                <NotificationAlert ref="notificationAlert"/>
                <div className="content">

                    <Alert
                        color="info"
                        isOpen={this.state.visible}
                        toggle={this.onDismiss}
                    >
                        <span>This is a notification with close button.</span>
                    </Alert>

                    {this.state.activeMode === tableViewMode ?
                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <Row>
                                        <Col md={9} xs={12}>
                                            <CardHeader>
                                                <CardTitle tag="h2">Report Formats</CardTitle>
                                            </CardHeader>
                                        </Col>
                                        <Col md={3} xs={12}>
                                            <CardHeader>
                                                <ButtonGroup aria-label="outlined primary button group">
                                                    <Button
                                                        color="success"
                                                        onClick={() => {
                                                            this.onChangeCreateModeOn()
                                                        }}>
                                                        Create New Format
                                                    </Button>
                                                </ButtonGroup>
                                            </CardHeader>
                                        </Col>
                                    </Row>

                                    <CardBody>
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
                                            {this.state.formats.map((prop, key) => {
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
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row> : null
                    }

                    {this.state.activeMode === viewEachMode && this.state.focussedObject !== null ?
                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle tag="h2">View Test Format</CardTitle>
                                        <ButtonGroup aria-label="outlined primary button group">
                                            <Button
                                                color="success"
                                                disabled={this.state.disabled}
                                                onClick={() => {
                                                    this.onChangeEditModeFalse()
                                                }}>
                                                View
                                            </Button>
                                            <Button
                                                color="primary"
                                                disabled={!this.state.disabled}
                                                onClick={() => {
                                                    this.onChangeEditModeTrue()
                                                }}>
                                                Edit
                                            </Button>
                                            <Button
                                                color="danger"
                                                onClick={() => {
                                                    this.onCloseViewMode()
                                                }}>
                                                Close
                                            </Button>
                                        </ButtonGroup>
                                    </CardHeader>
                                    <CardBody>
                                        <div>
                                            <FormGroup>
                                                <h6>Report Format Id</h6>
                                                <Input
                                                    disabled
                                                    placeholder={this.state.focussedObject.reportFormatId}
                                                />
                                                <br/><br/>
                                                <h6>Test</h6>
                                                <Input
                                                    disabled={this.state.disabled}
                                                    placeholder={this.state.focussedObject.test}
                                                    type="text"
                                                />
                                                <br/><br/>
                                                <h6>Unit</h6>
                                                <Input
                                                    disabled={this.state.disabled}
                                                    placeholder={this.state.focussedObject.unit}
                                                    type="text"
                                                />
                                                <br/><br/>
                                                <h6>Target Value</h6>
                                                <Input
                                                    disabled={this.state.disabled}
                                                    placeholder={this.state.focussedObject.targetValue}
                                                    type="text"
                                                />
                                            </FormGroup>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        : null
                    }
                    {this.state.activeMode === createMode ?
                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle tag="h2">Create New Test Format</CardTitle>
                                        <ButtonGroup aria-label="outlined primary button group">
                                            <Button
                                                color="danger"
                                                onClick={() => {
                                                    this.onChangeCreateModeOff()
                                                }}>
                                                Close
                                            </Button>
                                        </ButtonGroup>
                                    </CardHeader>
                                    <CardBody>
                                        <Form onSubmit={this.handleSubmit}>
                                            <Row>
                                                <Col className="pr-1" md="5">
                                                    <FormGroup>
                                                        <h6>Test Name</h6>
                                                        <Input
                                                            placeholder="Test name"
                                                            type="text"
                                                            value={this.state.test}
                                                            onChange={this.handleChangeFormatName}
                                                        />
                                                        <br/><br/>
                                                        <h6>Unit</h6>
                                                        <Input
                                                            placeholder="Unit"
                                                            type="text"
                                                            value={this.state.unit}
                                                            onChange={this.handleChangeUnit}
                                                        />
                                                        <br/><br/>
                                                        <h6>Target Value</h6>
                                                        <Input
                                                            placeholder="Target Value"
                                                            type="text"
                                                            value={this.state.targetValue}
                                                            onChange={this.handleChangeTargetValue}
                                                        />
                                                        <Button type="submit" color={"success"}
                                                                value="Submit">Submit</Button>
                                                    </FormGroup>
                                                </Col>

                                            </Row>
                                            <Row>
                                                {/*<Col md="6">*/}
                                                {/*<FormGroup>*/}
                                                {/*    <h6>Attributes</h6>*/}
                                                {/*    <Col md="6">*/}
                                                {/*        {this.addInputs()}*/}
                                                {/*    </Col>*/}
                                                {/*    <Col md="6">*/}
                                                {/*        <Button*/}
                                                {/*            color="info"*/}
                                                {/*            onClick={() => {*/}
                                                {/*                this.addClick()*/}
                                                {/*            }}>*/}
                                                {/*            Add Attribute*/}
                                                {/*        </Button>*/}
                                                {/*        <Button type="submit" color={"success"}*/}
                                                {/*                value="Submit">Submit</Button>*/}
                                                {/*    </Col>*/}
                                                {/*</FormGroup>*/}
                                                {/*</Col>*/}
                                                {/*<Col md="6">*/}
                                                {/*    <Table responsive>*/}
                                                {/*        <thead className="text-primary">*/}
                                                {/*        <tr>*/}
                                                {/*            {attributeThead.map((prop, key) => {*/}
                                                {/*                if (key === thead.length - 1) {*/}
                                                {/*                    return (*/}
                                                {/*                        <th key={key} className="text-left">*/}
                                                {/*                            <h6>{prop}</h6>*/}
                                                {/*                        </th>*/}
                                                {/*                    );*/}
                                                {/*                }*/}
                                                {/*                return <th key={key}><h6>{prop}</h6></th>;*/}
                                                {/*            })}*/}
                                                {/*        </tr>*/}
                                                {/*        </thead>*/}
                                                {/*        <tbody>*/}
                                                {/*        {this.state.values.map((prop, key) => {*/}
                                                {/*            prop = {*/}
                                                {/*                className: "table-success",*/}
                                                {/*                data: [prop]*/}
                                                {/*            }*/}
                                                {/*            return (*/}
                                                {/*                <tr key={key}>*/}
                                                {/*                    {prop.data.map((prop, key) => {*/}
                                                {/*                        if (key === thead.length - 1) {*/}
                                                {/*                            return (*/}
                                                {/*                                <td key={key} className="text-left">*/}
                                                {/*                                    <h6>{prop}</h6>*/}
                                                {/*                                </td>*/}
                                                {/*                            );*/}
                                                {/*                        }*/}
                                                {/*                        return <td key={key}><h6>{prop}</h6></td>;*/}
                                                {/*                    })}*/}
                                                {/*                </tr>*/}
                                                {/*            );*/}
                                                {/*        })}*/}
                                                {/*        </tbody>*/}
                                                {/*    </Table>*/}
                                                {/*</Col>*/}
                                            </Row>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        : null
                    }
                </div>
            </>
        );
    }
}

export default ReportFormat;
