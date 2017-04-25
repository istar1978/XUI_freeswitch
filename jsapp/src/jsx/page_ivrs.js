'use strict';
import React from 'react';
import T from 'i18n-react';
import { Modal, ButtonToolbar, ButtonGroup, Button, Form, FormGroup, FormControl, ControlLabel, Checkbox, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek';
import { EditControl, xFetchJSON } from './libs/xtools';
import verto from './verto/verto';

class IvrActionPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = { row: [], editText: "Edit", editable: false};
		this.handleEdit = this.handleEdit.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		const _this = this;
		let url = "/api/ivrs/" + _this.props.params.ivr_menu_id + "/actions/" + _this.props.params.id;
		xFetchJSON(url).then((obj) => {
			_this.setState({ row: obj[0] });
		}).catch((msg) => {
			console.log("get ERR");
		});
	}

	handleEdit () {
		const _this = this;
		if( _this.state.editText === "Save" ){
			_this.handleSubmit();
		}
		let text = _this.state.editText === "Edit" ? "Save" : "Edit";
		this.setState({ editText: text, editable: !this.state.editable });
	}

	handleSubmit (){
		let _this = this;
		console.log("submit...");
		let action = form2json('#editActionForm');
		if (!action.action ) {
			notify(<T.span text="Mandatory fields left blank"/>, 'error');
			return;
		}

		action.action = _this.state.row.action;
		xFetchJSON( "/api/ivrs/" + _this.state.row.ivr_menu_id + "/actions/" + action.id, {
			method: "PUT",
			body: JSON.stringify(action)
		}).then((obj) => {
			_this.setState({ editable: false, row: action})
			notify(<T.span text={{ key:"Saved at"+ Date()}}/>);
		}).catch((msg) => {
			console.error("action", msg);
		});
	}

	render () {
		const _this = this;
		let row = this.state.row;
		return <div>
			<ButtonToolbar className="pull-right">
				<Button onClick={ _this.handleEdit }><i className="fa fa-edit" aria-hidden="true"></i>&nbsp;<T.span text={ _this.state.editText } /></Button>
			</ButtonToolbar>
			<h1><T.span text="IVR ACTION Info"/></h1>
			<hr />
			<Form horizontal id="editActionForm">
				<input type="hidden" name="id" defaultValue={row.id}/>
				<input type="hidden" name="ivr_menu_id" defaultValue={row.ivr_menu_id}/>
				<FormGroup controlId="formDigits">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Digits" className="mandatory"/></Col>
					<Col sm={10}><EditControl name="digits" edit={_this.state.editable} defaultValue={row.digits}/></Col>
				</FormGroup>
				<FormGroup controlId="formAction">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Action" className="mandatory"/></Col>
					<Col sm={10}><EditControl name="action" edit={_this.state.editable} defaultValue={row.action}/></Col>
				</FormGroup>
				<FormGroup controlId="formArgs">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Args" /></Col>
					<Col sm={10}><EditControl name="args" edit={_this.state.editable} defaultValue={row.args}/></Col>
				</FormGroup>
			</Form>
		</div>
	}
}

class NewAction extends React.Component {
	constructor (props) {
		super(props);
		this.state = { errmsg: "" };
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit (){
		const _this = this;
		var action = form2json('#newActionForm');
		if (!action.action) {
			this.setState({ errmsg: "Mandatory fields left blank" });
			return;
		}
		action.ivr_menu_id = this.props.ivrData.ivrId;

		xFetchJSON("/api/ivrs/" + action.ivr_menu_id + "/actions", {
			method: "POST",
			body: JSON.stringify(action)
		}).then((obj) => {
			action.id = obj.id;
			_this.props.handleNewActionAdded(action);
		}).catch((msg) => {
			console.error("new IVR Err", msg);
		});
	}

	render () {
		const _this = this;
		const props = Object.assign({}, this.props);
		delete props.handleNewActionAdded;
		delete props.ivrData;
		return <Modal {...props} aria-labelledby="contained-modal-title-lg">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-lg"><T.span text="Add IVR ACTION" /></Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form horizontal id="newActionForm">
					<FormGroup controlId="formDigits">
						<Col componentClass={ControlLabel} sm={2}><T.span text="Digits" className="mandatory"/></Col>
						<Col sm={10}><FormControl type="input"  name="digits" placeholder="0"/></Col>
					</FormGroup>
					<FormGroup controlId="formAction">
						<Col componentClass={ControlLabel} sm={2}><T.span text="Action" className="mandatory"/></Col>
						<Col sm={10}><FormControl type="input" name="action" placeholder="menu-exec-app" /></Col>
					</FormGroup>
					<FormGroup controlId="formArgs">
						<Col componentClass={ControlLabel} sm={2}><T.span text="Args" /></Col>
						<Col sm={10}><FormControl type="input" name="args"/></Col>
					</FormGroup>
					<FormGroup>
						<Col smOffset={2} sm={10}>
							<Button type="button" bsStyle="primary" onClick={ _this.handleSubmit }>
								<i className="fa fa-floppy-o" aria-hidden="true"></i>&nbsp;
								<T.span text="Save" />
							</Button>
							&nbsp;&nbsp;<T.span className="danger" text={ this.state.errmsg }/>
						</Col>
					</FormGroup>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={this.props.onHide}>
					<i className="fa fa-times" aria-hidden="true"></i>&nbsp;
					<T.span text="Close" />
				</Button>
			</Modal.Footer>
		</Modal>
	}
}

class IvrInfo extends React.Component {

	constructor (props) {
		super(props);
		this.state = { 
			ivrRows: [], actionRows:[], danger: false, formShow: false, 
			editable: false, editText: "Edit", auto_record:"0", ifChecked: false};

		this.handleEdit = this.handleEdit.bind(this);
		this.handleNewActionAdded = this.handleNewActionAdded.bind(this);
	}

	componentDidMount() {
		const _this = this;
		xFetchJSON("/api/ivrs/" + _this.props.params.ivr_menu_id)
			.then((data) => {
				let ifChecked = data.auto_record == "1" ? true : false ;
				_this.setState({ ivrRows: data, ifChecked: ifChecked});
			}).catch((msg) => {
				console.log("get ivr ERR");
			});

		xFetchJSON("/api/ivrs/" + _this.props.params.ivr_menu_id + "/actions")
			.then((data) => {
				_this.setState({ actionRows: data });
			}).catch((msg) => {
				console.log("get action ERR");
			});
	}

	handleEdit () {
		const _this = this;
		if( _this.state.editText === "Save" ){
			_this.handleSubmit();
		}
		let text = _this.state.editText === "Edit" ? "Save" : "Edit";
		this.setState({ editText: text, editable: !this.state.editable});
	}

	handleSubmit (){
		let _this = this;
		console.log("submit...");
		let ivr = form2json('#editIvrForm');
		if (!ivr.name ) {
			notify(<T.span text="Mandatory fields left blank"/>, 'error');
			return;
		}

		ivr.id = _this.props.params.ivr_menu_id;

		xFetchJSON("/api/ivrs/"+ ivr.id, {
			method: "PUT",
			body: JSON.stringify(ivr)
		}).then((obj) => {
			_this.setState({ editable: false, ivrRows: ivr})
			notify(<T.span text={{ key:"Saved at"+ Date()}}/>);
		}).catch((msg) => {
			console.error("ivr", msg);
		});
	}


	handleNewActionAdded (action) {
		const _this = this;
		xFetchJSON("/api/ivrs/"+ _this.props.params.ivr_menu_id +"/actions")
			.then((obj) => {
				_this.setState({actionRows: obj, formShow: false});
			}).catch((msg) => {
				console.log("ERR");
			});
	}

	handleDelete (id) {
		console.log("deleting id", id);
		var _this = this;
		if (!this.state.danger) {
			var c = confirm(T.translate("Confirm to Delete ?"));
			if (!c) return;
		}

		xFetchJSON("/api/ivrs/" + _this.props.params.ivr_menu_id + "/actions/" + id, {
			method: "DELETE"
		}).then(() => {
			console.log("deleted")
			var actionRows = _this.state.actionRows.filter(function(row) {
				return row.id != id;
			});
			console.log("delete row", actionRows);
			_this.setState({actionRows: actionRows});
		}).catch((msg) => {
			console.log("route", msg);
		});
	}

	render() {
		const _this = this;
		const props = Object.assign({}, this.props);

		let formClose = () => this.setState({ formShow: false });
		let danger = this.state.danger ? "danger" : ""; 
		let toggleDanger = () => this.setState({ danger: !this.state.danger });
		let frow = this.state.ivrRows;
		let ivrData = {ivrId: frow.id, ivrName: frow.name};
		let colEdit = _this.state.editable ?  { display: "none"} : { display: "block" };
		let colCheck = _this.state.editable ? { display: "block"} : { display: "none" };

		let ivrRow = <div>
			<h1><T.span text="IVR Info"/></h1>
			<ButtonToolbar className="pull-right">
				<Button onClick={ _this.handleEdit } ><i className="fa fa-edit" aria-hidden="true"></i>&nbsp;<T.span text={ _this.state.editText } /></Button>
			</ButtonToolbar>
			<hr />
			<Form horizontal id="editIvrForm">
				<FormGroup controlId="formName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Name" className="mandatory"/></Col>
					<Col sm={9}><EditControl  name="name" edit={_this.state.editable} defaultValue={frow.name}/></Col>
				</FormGroup>
				<FormGroup controlId="formGreet_long">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Greet_long" /></Col>
					<Col sm={9}><EditControl  name="greet_long" edit={_this.state.editable} defaultValue={frow.greet_long}/></Col>
				</FormGroup>
				<FormGroup controlId="formGreet_short">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Greet_short" /></Col>
					<Col sm={9}><EditControl name="greet_short" edit={_this.state.editable} defaultValue={frow.greet_short}/></Col>
				</FormGroup>
                                <FormGroup controlId="formInvalid_sound">
                                        <Col componentClass={ControlLabel} sm={2}><T.span text="Invalid_sound" /></Col>
                                        <Col sm={9}><EditControl name="invalid_sound" edit={_this.state.editable} defaultValue={frow.invalid_sound}/></Col>
                                </FormGroup>
				<FormGroup controlId="formExit_sound">
                                        <Col componentClass={ControlLabel} sm={2}><T.span text="Exit_sound" /></Col>
                                        <Col sm={9}><EditControl name="exit_sound" edit={_this.state.editable} defaultValue={frow.exit_sound}/></Col>
                                </FormGroup>
				<FormGroup controlId="formTransfer_sound">
                                        <Col componentClass={ControlLabel} sm={2}><T.span text="Transfer_sound"/></Col>
                                        <Col sm={9}><EditControl  name="transfer_sound" edit={_this.state.editable} defaultValue={frow.transfer_sound}/></Col>
                                </FormGroup>
                                <FormGroup controlId="formMax_failures">
                                        <Col componentClass={ControlLabel} sm={2}><T.span text="Max_failures" /></Col>
                                        <Col sm={9}><EditControl  name="max_failures" edit={_this.state.editable} defaultValue={frow.max_failures}/></Col>
                                </FormGroup>
                                <FormGroup controlId="formMax_timeouts">
                                        <Col componentClass={ControlLabel} sm={2}><T.span text="Max_timeouts" /></Col>
                                        <Col sm={9}><EditControl name="max_timeouts" edit={_this.state.editable} defaultValue={frow.max_timeouts}/></Col>
                                </FormGroup>
                                <FormGroup controlId="formExec_on_max_failures">
                                        <Col componentClass={ControlLabel} sm={2}><T.span text="Exec_on_max_failures" /></Col>
                                        <Col sm={9}><EditControl name="exec_on_max_failures" edit={_this.state.editable} defaultValue={frow.exec_on_max_failures}/></Col>
                                </FormGroup>
				<FormGroup controlId="formExec_on_max_timeouts">
                                        <Col componentClass={ControlLabel} sm={2}><T.span text="Exec_on_max_timeouts" /></Col>
                                        <Col sm={9}><EditControl name="exec_on_max_timeouts" edit={_this.state.editable} defaultValue={frow.exec_on_max_timeouts}/></Col>
                                </FormGroup>
                                <FormGroup controlId="formConfirm_macro">
                                        <Col componentClass={ControlLabel} sm={2}><T.span text="Transfer_sound" className="confirm_macro"/></Col>
                                        <Col sm={9}><EditControl  name="confirm_macro" edit={_this.state.editable} defaultValue={frow.confirm_macro}/></Col>
                                </FormGroup>
                                <FormGroup controlId="formConfirm_key">
                                        <Col componentClass={ControlLabel} sm={2}><T.span text="Confirm_key" /></Col>
                                        <Col sm={9}><EditControl  name="confirm_key" edit={_this.state.editable} defaultValue={frow.confirm_key}/></Col>
                                </FormGroup>
                                <FormGroup controlId="formTts_engine">
                                        <Col componentClass={ControlLabel} sm={2}><T.span text="Tts_engine" /></Col>
                                        <Col sm={9}><EditControl name="tts_engine" edit={_this.state.editable} defaultValue={frow.tts_engine}/></Col>
                                </FormGroup>
                                <FormGroup controlId="formTts_voice">
                                        <Col componentClass={ControlLabel} sm={2}><T.span text="Tts_voice" /></Col>
                                        <Col sm={9}><EditControl name="tts_voice" edit={_this.state.editable} defaultValue={frow.tts_voice}/></Col>
                                </FormGroup>
				<FormGroup controlId="formConfirm_attempts">
                                        <Col componentClass={ControlLabel} sm={2}><T.span text="Confirm_attempts" /></Col>
                                        <Col sm={9}><EditControl name="confirm_attempts" edit={_this.state.editable} defaultValue={frow.confirm_attempts}/></Col>
                                </FormGroup>
                                <FormGroup controlId="formDigit_len">
                                        <Col componentClass={ControlLabel} sm={2}><T.span text="Digit_len" className="digit_len"/></Col>
                                        <Col sm={9}><EditControl  name="digit_len" edit={_this.state.editable} defaultValue={frow.digit_len}/></Col>
                                </FormGroup>
                                <FormGroup controlId="formInter_digit_timeout">
                                        <Col componentClass={ControlLabel} sm={2}><T.span text="Inter_digit_timeout" /></Col>
                                        <Col sm={9}><EditControl  name="inter_digit_timeout" edit={_this.state.editable} defaultValue={frow.inter_digit_timeout}/></Col>
                                </FormGroup>
                                <FormGroup controlId="formPin">
                                        <Col componentClass={ControlLabel} sm={2}><T.span text="Pin" /></Col>
                                        <Col sm={9}><EditControl name="pin" edit={_this.state.editable} defaultValue={frow.pin}/></Col>
                                </FormGroup>
                                <FormGroup controlId="formPin_file">
                                        <Col componentClass={ControlLabel} sm={2}><T.span text="Pin_file" /></Col>
                                        <Col sm={9}><EditControl name="pin_file" edit={_this.state.editable} defaultValue={frow.pin_file}/></Col>
                                </FormGroup>
				<FormGroup controlId="formBad_pin_file">
                                        <Col componentClass={ControlLabel} sm={2}><T.span text="Bad_pin_file" /></Col>
                                        <Col sm={9}><EditControl name="bad_pin_file" edit={_this.state.editable} defaultValue={frow.bad_pin_file}/></Col>
                                </FormGroup>
				</Form>
			</div>;

		let actionRows = this.state.actionRows.map ( function (actionRow) {
			if( frow.id == actionRow.ivr_menu_id ) {
				return <tr key={actionRow.id} >
					<td> {actionRow.id} </td>
					<td> <Link to={`/settings/ivrs/${frow.id}/actions/${actionRow.id}`}>{actionRow.digits}</Link></td>
					<td> {actionRow.action} </td>
					<td> {actionRow.args} </td>
					<td> { <T.a onClick={() => _this.handleDelete(actionRow.id)} text="Delete" className={danger} style= {{cursor:"pointer"}}/>} </td>
				</tr>;
	    	}
	    });

		return <div>
			{ivrRow}

			<br/><br/>
			<NewAction ivrData={ivrData} show={this.state.formShow} onHide={formClose} handleNewActionAdded={ this.handleNewActionAdded }/>
			<ButtonToolbar className="pull-right">
				<Button onClick={() => this.setState({formShow: true})}>
					<i className="fa fa-plus" aria-hidden="true" ></i>&nbsp;
					<T.span text="Add" />
				</Button>
			</ButtonToolbar>
			<h3><T.span text="IVR Action"/></h3>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th><T.span text="ID"/></th>
					<th><T.span text="Digits"/></th>
					<th><T.span text="Action"/></th>
					<th><T.span text="Args"/></th>
					<th><T.span style={{cursor: "pointer" }} text="Delete" className={danger} onClick={toggleDanger} title={T.translate("Click me to toggle fast delete mode")}/></th>
				</tr>
				{actionRows}
				</tbody>
				</table>
			</div>
		</div>
	}
}

class NewIvr extends React.Component {

	constructor (props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}


	handleSubmit () {
		console.log("submit...");
		const _this = this;
		var ivr = form2json('#newIvrForm');
		if (!ivr.name) {
			this.setState({ errmsg: "Mandatory fields left blank" });
			return;
		}


		xFetchJSON("/api/ivrs", {
			method: "POST",
			types: "json",
			body: JSON.stringify(ivr),
		}).then((obj) => {
			ivr.id = obj.id;
			_this.props.handleNewIvrAdded(ivr);
		}).catch((msg) => {
			console.error("new IVR Err", msg);
			_this.setState({errmsg: "" + msg + ""});
		});
	}

	render () {
		const _this = this;
		const props = Object.assign({}, this.props);
		delete props.handleNewIvrAdded;

		return <Modal {...props} aria-labelledby="contained-modal-title-lg">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-lg"><T.span text="Create New IVR" /></Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form horizontal id="newIvrForm">
					<FormGroup controlId="formName">
						<Col componentClass={ControlLabel} sm={4}><T.span text="Name" className="mandatory"/></Col>
						<Col sm={7}><FormControl type="input" name="name" placeholder="welcome"/></Col>
					</FormGroup>
					<FormGroup controlId="formGreet_long">
						<Col componentClass={ControlLabel} sm={4}><T.span text="Greet_long" /></Col>
						<Col sm={7}><FormControl type="input"  name="greet_long" placeholder="welcome.wav"/></Col>
					</FormGroup>
					<FormGroup controlId="formGreet_short">
						<Col componentClass={ControlLabel} sm={4}><T.span text="Greet_short" /></Col>
						<Col sm={7}><FormControl type="input" name="greet_short" placeholder="welcome_short.wav" /></Col>
					</FormGroup>
                                        <FormGroup controlId="frominvalid_sound">
                                                <Col componentClass={ControlLabel} sm={4}><T.span text="Invalid_sound"/></Col>
                                                <Col sm={7}><FormControl type="input" name="invalid_sound" placeholder="ivr/ivr-that_was_an_invalid_entry.wav"/></Col>
                                        </FormGroup>
                                        <FormGroup controlId="formexit_sound">
                                                <Col componentClass={ControlLabel} sm={4}><T.span text="Exit_sound" /></Col>
                                                <Col sm={7}><FormControl type="input"  name="exit_sound" placeholder="voicemail/vm-goodbye.wav"/></Col>
                                        </FormGroup>
                                        <FormGroup controlId="formtimeout">
                                                <Col componentClass={ControlLabel} sm={4}><T.span text="Timeout" /></Col>
                                                <Col sm={7}><FormControl type="input" name="timeout" placeholder="15000" /></Col>
                                        </FormGroup>
					<FormGroup>
						<Col smOffset={2} sm={10}>
							<Button type="button" bsStyle="primary" onClick={ _this.handleSubmit }>
								<i className="fa fa-floppy-o" aria-hidden="true"></i>&nbsp;
								<T.span text="Save" />
							</Button>
						</Col>
					</FormGroup>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={this.props.onHide}>
					<i className="fa fa-times" aria-hidden="true"></i>&nbsp;
					<T.span text="Close" />
				</Button>
			</Modal.Footer>
		</Modal>
	}
}

class IvrPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = { rows: [], ivrId: "", ivrName:"", danger: "", formShow: false};
		this.handleActionClick = this.handleActionClick.bind(this);
		this.handleNewIvrAdded = this.handleNewIvrAdded.bind(this);
	}

	componentDidMount() {
		let _this = this;
		xFetchJSON("/api/ivrs").then((data) => {
			_this.setState({rows: data});
		}).catch((e)=> {
			console.log("get groups ERR");
		});
	}

	handleActionClick (ivrId) {
		this.setState({ ivrId: ivrId, ivrName: ivrId.text });
	}

	handleNewIvrAdded(ivr) {
		const _this = this;
		xFetchJSON("/api/ivrs")
			.then((obj) => {
				_this.setState({rows: obj, formShow: false});
			})
			.catch((msg) => {
				console.log("refresh err");
			});
	}

	handleReparseClick() {
		verto.fsAPI("ivr", "reparse", function(data) {
			notify(<T.span text="IVR Reparsed"/>);
		});
	}

	handleDelete (id){
		console.log("deleting id", id);
		var _this = this;
		if (!this.state.danger) {
			var c = confirm(T.translate("Confirm to Delete ?"));
			if (!c) return;
		}

		xFetchJSON("/api/ivrs/" + id, {
			method: "DELETE"
		}).then((data) => {
			var rows = _this.state.rows.filter(function(row) {
					return row.id != id;
				});
				console.log("delete row", rows);
				_this.setState({rows: rows});
		}).catch((e)=> {
			console.error("route", msg);
		});
	}

	render() {
		const _this = this;
		let actionStyle = _this.state.ivrId ? { display: "block" } : { display: "none"};
		let danger = this.state.danger ? "danger" : "";
		let formClose = () => this.setState({ formShow: false });
		let editFormClose = () => this.setState({ editFormShow: false });
		let toggleDanger = () => this.setState({ danger: !this.state.danger });
		let rows = this.state.rows.map(function(row) {
			return <tr key={row.id} >
				<td> {row.id} </td>
				<td> <Link to={`/settings/ivrs/${row.id}`}>{row.name}</Link></td>
				<td> {row.greet_long} </td>
				<td> {row.greet_short} </td>
				<td> {row.invalid_sound} </td>
				<td> {row.exit_sound} </td>
				<td> {row.timeout} </td>
				<td><T.a onClick={() => _this.handleDelete(row.id)} text="Delete" className={danger} style={{cursor:"pointer"}}/></td>
			</tr>
		});
		return <div>
			<ButtonToolbar className="pull-right">
				<Button onClick={this.handleReparseClick}>
					<i className="fa fa-refresh" aria-hidden="true" ></i>&nbsp;
					<T.span text="Reparse" />
				</Button>
				<Button onClick={()=>{_this.setState({formShow: true})}}>
					<i className="fa fa-plus" aria-hidden="true" ></i>&nbsp;
					<T.span text="New" />
				</Button>
			</ButtonToolbar>
			<h1><T.span text="IVR"/></h1>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th><T.span text="ID"/></th>
					<th><T.span text="Name"/></th>
					<th><T.span text="Greet_long"/></th>
					<th><T.span text="Greet_short"/></th>
					<th><T.span text="Invalid_sound"/></th>
                                        <th><T.span text="Exit_sound"/></th>
                                        <th><T.span text="Timeout"/></th>
					<th><T.span style={{cursor: "pointer" }} text="Delete" className={danger} onClick={toggleDanger} title={T.translate("Click me to toggle fast delete mode")}/></th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>
			<br />
			<NewIvr show={this.state.formShow} onHide={formClose} handleNewIvrAdded={this.handleNewIvrAdded}/>
		</div>
	}
}

export { IvrPage, IvrInfo, IvrActionPage };
