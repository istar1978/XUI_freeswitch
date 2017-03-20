'use strict';
import React from 'react';
import T from 'i18n-react';
import { Modal, ButtonToolbar, ButtonGroup, Button, Form, FormGroup, FormControl, ControlLabel, Checkbox, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek';
import { EditControl } from './xtools';
import verto from './verto/verto';

class FifoMemberPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = { row: [], editText: "Edit", editable: false};
		this.handleEdit = this.handleEdit.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		const _this = this;
		$.getJSON("/api/fifos/"+_this.props.params.fifo_id+"/members/" + _this.props.params.id , function(data) {
			_this.setState({ row: data[0] });
		}, function(e) {
			console.log("get ERR");
		});
	}

	getNowTime () {
		Date.prototype.Format = function (fmt) {
		    var o = {
		        "M+": this.getMonth() + 1,
		        "d+": this.getDate(),
		        "h+": this.getHours(),
		        "m+": this.getMinutes(),
		        "s+": this.getSeconds(),
		        "q+": Math.floor((this.getMonth() + 3) / 3),
		        "S": this.getMilliseconds()
		    };
		    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		    for (var k in o)
		    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		    return fmt;
		}
		var time = new Date().Format("yyyy-MM-dd hh:mm:ss");  
	    return time;
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
		let member = form2json('#editMemberForm');
		if (!member.name ) {
			notify(<T.span text="Mandatory fields left blank"/>, 'error');
			return;
		}
		member.fifo_name = _this.state.row.fifo_name;
		member.updated_epoch = this.getNowTime();
		$.ajax({
			type: "PUT",
			url: "/api/fifos/"+_this.state.row.fifo_id+"/members/" + member.id ,
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(member),
			success: function (obj) {
				_this.setState({ editable: false, row: member})
				notify(<T.span text={{ key:"Saved at"+ Date()}}/>);
			},
			error: function(msg) {
				console.error("member", msg);
			}
		});
	}

	render () {
		const _this = this;
		let row = this.state.row;
		return <div>
			<ButtonToolbar className="pull-right">
				<Button><T.span onClick={ _this.handleEdit } text={ _this.state.editText } /></Button>
			</ButtonToolbar>
			<h1><T.span text="FIFO Member Info"/></h1>
			<hr />
			<Form horizontal id="editMemberForm">
				<input type="hidden" name="id" defaultValue={row.id}/>
				<input type="hidden" name="fifo_id" defaultValue={row.fifo_id}/>
				<FormGroup controlId="formName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Name" className="mandatory"/></Col>
					<Col sm={10}><EditControl name="name" edit={_this.state.editable} defaultValue={row.name} /></Col>
				</FormGroup>
				<FormGroup controlId="formDescription">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Description" /></Col>
					<Col sm={10}><EditControl  name="description" edit={_this.state.editable} defaultValue={row.description}/></Col>
				</FormGroup>
				<FormGroup controlId="formFifoName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="FIFO Name"/></Col>
					<Col sm={10}><EditControl name="fifo_name" defaultValue={row.fifo_name}/></Col>
				</FormGroup>
				<FormGroup controlId="formTimeout">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Timeout" /></Col>
					<Col sm={10}><EditControl name="timeout" edit={_this.state.editable} defaultValue={row.timeout}/></Col>
				</FormGroup>
				<FormGroup controlId="formSimo">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Simo" /></Col>
					<Col sm={10}><EditControl name="simo" edit={_this.state.editable} defaultValue={row.simo}/></Col>
				</FormGroup>
				<FormGroup controlId="formextn">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Lag" /></Col>
					<Col sm={10}><EditControl name="lag" edit={_this.state.editable} defaultValue={row.lag}/></Col>
				</FormGroup>
				<FormGroup controlId="formName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Extn" /></Col>
					<Col sm={10}><EditControl name="extn" edit={_this.state.editable} defaultValue={row.extn}/></Col>
				</FormGroup>
				<FormGroup controlId="formDialString">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Dial String" /></Col>
					<Col sm={10}><EditControl name="dial_string" edit={_this.state.editable} defaultValue={row.dial_string}/></Col>
				</FormGroup>
				<FormGroup controlId="formUpdateEpoch">
					<Col componentClass={ControlLabel} sm={2}><T.span text="updated_epoch" /></Col>
					<Col sm={10}><EditControl name="updated_epoch" defaultValue={row.updated_epoch}/></Col>
				</FormGroup>
			</Form>
		</div>
	}
}

class NewMember extends React.Component {
	constructor (props) {
		super(props);
		this.state = { errmsg: "" };
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentWillReceiveProps(nextProps){
		console.log("nextProps",nextProps);
	}

	handleSubmit (){
		const _this = this;
		var member = form2json('#newMemberForm');
		if (!member.name) {
			this.setState({ errmsg: "Mandatory fields left blank" });
			return;
		}
		member.fifo_id = this.props.fifoData.fifoId;
		member.fifo_name = this.props.fifoData.fifoName;
		$.ajax({
			type: "POST",
			url: "/api/fifos/" + member.fifo_id + "/members",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(member),
			success: function (obj) {
				member.id = obj.id;
				_this.props.handleNewMemberAdded(member);
			},
			error: function(msg) {
				console.error("new FIFO Err", msg);
			}
		});
	}

	render () {
		const _this = this;
		const props = Object.assign({}, this.props);
		delete props.handleNewMemberAdded;
		delete props.fifoData;
		return <Modal {...props} aria-labelledby="contained-modal-title-lg">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-lg"><T.span text="Create New FIFO Member" /></Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form horizontal id="newMemberForm">
					<FormGroup controlId="formName">
						<Col componentClass={ControlLabel} sm={2}><T.span text="Name" className="mandatory"/></Col>
						<Col sm={10}><FormControl type="input" name="name" placeholder="name"/></Col>
					</FormGroup>
					<FormGroup controlId="formDescription">
						<Col componentClass={ControlLabel} sm={2}><T.span text="Description" /></Col>
						<Col sm={10}><FormControl type="input"  name="description" placeholder="description"/></Col>
					</FormGroup>
					<FormGroup controlId="formTimeout">
						<Col componentClass={ControlLabel} sm={2}><T.span text="Timeout" /></Col>
						<Col sm={10}><FormControl type="input" name="timeout" placeholder="timeout"/></Col>
					</FormGroup>
					<FormGroup controlId="formSimo">
						<Col componentClass={ControlLabel} sm={2}><T.span text="Simo" /></Col>
						<Col sm={10}><FormControl type="input" name="simo" placeholder="simo"/></Col>
					</FormGroup>
					<FormGroup controlId="formextn">
						<Col componentClass={ControlLabel} sm={2}><T.span text="Lag" /></Col>
						<Col sm={10}><FormControl type="input" name="lag" placeholder="lag"/></Col>
					</FormGroup>
					<FormGroup controlId="formName">
						<Col componentClass={ControlLabel} sm={2}><T.span text="Extn" /></Col>
						<Col sm={10}><FormControl type="input" name="extn" placeholder="extn"/></Col>
					</FormGroup>
					<FormGroup controlId="formDialString">
						<Col componentClass={ControlLabel} sm={2}><T.span text="Dial String" /></Col>
						<Col sm={10}><FormControl type="input" name="dial_string" placeholder="{member_wait=nowait}user/1001"/></Col>
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

class FifoMember extends React.Component {

	constructor (props) {
		super(props);
		this.state = { rows:[], propId: '', danger: false, formShow: false};
		this.handleMemberAdd = this.handleMemberAdd.bind(this);
		this.handleNewMemberAdded = this.handleNewMemberAdded.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		const _this = this;
		if(nextProps.fifoData.fifoId) {
			$.getJSON("/api/fifos/"+nextProps.fifoData.fifoId+"/members", function(data) {
				_this.setState({ rows: data, propId: nextProps.fifoData.fifoId });
			}, function(e) {
				console.log("get FIFO ERR");
			});
		}
	}

	handleMemberAdd () {
		this.setState({ formShow: true});
	}

	handleNewMemberAdded (member) {
		const _this = this;
		$.getJSON("/api/fifos/"+_this.props.fifoData.fifoId+"/members", function(data) {
			_this.setState({rows: data, formShow: false});
		});
	}

	handleDelete (e) {
		var id = e.target.getAttribute("data-id");
		console.log("deleting id", id);
		var _this = this;
		if (!this.state.danger) {
			var c = confirm(T.translate("Confirm to Delete ?"));
			if (!c) return;
		}
		$.ajax({
			type: "DELETE",
			url: "/api/fifos/" + _this.props.fifoData.fifoId + "/members/" + id,
			success: function () {
				console.log("deleted")
				var rows = _this.state.rows.filter(function(row) {
					return row.id != id;
				});
				console.log("delete row", rows);
				_this.setState({rows: rows});
			},
			error: function(msg) {
				console.error("route", msg);
			}
		});
	}

	render() {
		const _this = this;
		const props = Object.assign({}, this.props);
		delete props.fifoData;
	    let fifoId = _this.props.fifoData.fifoId;
	    let fifoData = {fifoId: fifoId, fifoName: _this.props.fifoData.fifoName}
	    let formClose = () => this.setState({ formShow: false });
	    let danger = this.state.danger ? "danger" : "";
	   	let rows = this.state.rows.map ( function (row) {
	    	if( fifoId == row.fifo_id ) {
	    		return <tr key={row.id} >
					<td> {row.id} </td>
					<td> <Link to={`/settings/fifos/${fifoId}/members/${row.id}`}>{row.name}</Link> </td>
					<td> {row.description} </td>
					<td> {row.timeout} </td>
					<td> {row.simo} </td>
					<td> {row.lag} </td>
					<td> {row.extn} </td>
					<td> {row.dial_string}  </td>
					<td> { <T.a onClick={_this.handleDelete.bind(_this)} data-id={row.id} text="Delete" className={danger} style= {{cursor:"pointer"}}/>} </td>
				</tr>;
	    	}
	    });

		return <div>
			<NewMember fifoData={fifoData} show={this.state.formShow} onHide={formClose} handleNewMemberAdded={ this.handleNewMemberAdded }/>
			<ButtonToolbar className="pull-right">
				<Button onClick={this.handleMemberAdd}>
					<i className="fa fa-plus" aria-hidden="true" ></i>&nbsp;
					<T.span text="New" />
				</Button>
			</ButtonToolbar>
			<h3><T.span text="FIFO Member"/></h3>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th><T.span text="ID"/></th>
					<th><T.span text="Name"/></th>
					<th><T.span text="Description"/></th>
					<th><T.span text="Timeout"/></th>
					<th><T.span text="Simo"/></th>
					<th><T.span text="Lag"/></th>
					<th><T.span text="Extn"/></th>
					<th><T.span text="Dial String"/></th>
					<th><T.span text="Delete"/></th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>
		</div>
	}
}

class NewFifo extends React.Component {

	constructor (props) {
		super(props);
		this.state = { errmsg: "", auto_record: "0"};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChecked = this.handleChecked.bind(this);
	}

	handleChecked(e) {
		var auto_record = e.target.checked ? "1" : "0";
		this.setState({ auto_record: auto_record });
	}

	handleSubmit () {
		console.log("submit...");
		const _this = this;
		var fifo = form2json('#newFifoForm');
		fifo.auto_record = _this.state.auto_record;
		if (!fifo.name) {
			this.setState({ errmsg: "Mandatory fields left blank" });
			return;
		}
		$.ajax({
			type: "POST",
			url: "/api/fifos",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(fifo),
			success: function (obj) {
				fifo.id = obj.id;
				_this.props.handleNewFifoAdded(fifo);
			},
			error: function(msg) {
				console.error("new FIFO Err", msg);
			}
		});
	}

	render () {
		const _this = this;
		const props = Object.assign({}, this.props);
		delete props.handleNewFifoAdded;

		return <Modal {...props} aria-labelledby="contained-modal-title-lg">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-lg"><T.span text="Create New FIFO" /></Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form horizontal id="newFifoForm">
					<FormGroup controlId="formName">
						<Col componentClass={ControlLabel} sm={4}><T.span text="Name" className="mandatory"/></Col>
						<Col sm={7}><FormControl type="input" name="name" placeholder="name"/></Col>
					</FormGroup>
					<FormGroup controlId="formDescription">
						<Col componentClass={ControlLabel} sm={4}><T.span text="Description" /></Col>
						<Col sm={7}><FormControl type="input"  name="description" placeholder="description"/></Col>
					</FormGroup>
					<FormGroup controlId="formImportance">
						<Col componentClass={ControlLabel} sm={4}><T.span text="Importance" /></Col>
						<Col sm={7}><FormControl type="input" name="importance" defaultValue="0"/></Col>
					</FormGroup>
					<FormGroup controlId="formOPC">
						<Col componentClass={ControlLabel} sm={4}><T.span text="outbound_per_cycle" /></Col>
						<Col sm={7}><FormControl type="input" name="outbound_per_cycle" defaultValue="1"/></Col>
					</FormGroup>
					<FormGroup controlId="formOPCM">
						<Col componentClass={ControlLabel} sm={4}><T.span text="outbound_per_cycle_min" /></Col>
						<Col sm={7}><FormControl type="input" name="outbound_per_cycle_min" defaultValue="1"/></Col>
					</FormGroup>
					<Col sm={4}></Col>
					<Checkbox name="auto_record" value="auto_record" inline onChange={_this.handleChecked}>
						<T.span text="Auto Record" />
					</Checkbox>
					<FormGroup>
						<Col smOffset={2} sm={10}>
							<Button type="button" bsStyle="primary" onClick={ _this.handleSubmit }>
								<i className="fa fa-floppy-o" aria-hidden="true"></i>&nbsp;
								<T.span text="Save" />
							</Button>
							&nbsp;&nbsp;<T.span className="danger" text={ _this.state.errmsg }/>
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

class EditFifo extends React.Component {

	constructor (props) {
		super(props);
		this.state = { errmsg: "" };
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	getNowTime () {
		Date.prototype.Format = function (fmt) {
		    var o = {
		        "M+": this.getMonth() + 1,
		        "d+": this.getDate(),
		        "h+": this.getHours(),
		        "m+": this.getMinutes(),
		        "s+": this.getSeconds(),
		        "q+": Math.floor((this.getMonth() + 3) / 3),
		        "S": this.getMilliseconds()
		    };
		    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		    for (var k in o)
		    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		    return fmt;
		}
		var time = new Date().Format("yyyy-MM-dd hh:mm:ss");  
	    return time;
	}

	handleSubmit (){
		console.log("submit...");
		const _this = this;
		var fifo = form2json('#newFifoEditForm');
		if (!fifo.name) {
			this.setState({ errmsg: "Mandatory fields left blank"})
			return;
		}
		fifo.id = _this.props.editData.id;
		fifo.updated_epoch = _this.getNowTime();
		$.ajax({
			type: "PUT",
			url: "/api/fifos/" + _this.props.editData.id,
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(fifo),
			success: function (obj) {
				console.log(obj);
				_this.props.handleFifoEdited(fifo);
			},
			error: function(msg) {
				console.error("new fifo Err", msg);
			}
		});
	}

	render () {
		const _this = this;
		
		let editData = this.props.editData;
		const props = Object.assign({}, this.props);
		delete props.handleFifoEdited;
		delete props.editData;
		return <Modal {...props} aria-labelledby="contained-modal-title-lg">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-lg"><T.span text="Edit FIFO" /></Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form horizontal id="newFifoEditForm">
					<FormGroup controlId="formName">
						<Col componentClass={ControlLabel} sm={4}><T.span text="Name" className="mandatory"/></Col>
						<Col sm={7}><FormControl type="input" name="name" defaultValue={editData.name} /></Col>
					</FormGroup>
					<FormGroup controlId="formDescription">
						<Col componentClass={ControlLabel} sm={4}><T.span text="Description" /></Col>
						<Col sm={7}><FormControl type="input"  name="description" defaultValue={editData.description} /></Col>
					</FormGroup>
					<FormGroup controlId="formImportance">
						<Col componentClass={ControlLabel} sm={4}><T.span text="Importance" /></Col>
						<Col sm={7}><FormControl type="input" name="importance" defaultValue={editData.importance} /></Col>
					</FormGroup>
					<FormGroup controlId="formOPC">
						<Col componentClass={ControlLabel} sm={4}><T.span text="outbound_per_cycle" /></Col>
						<Col sm={7}><FormControl type="input" name="outbound_per_cycle" defaultValue={editData.outbound_per_cycle} /></Col>
					</FormGroup>
					<FormGroup controlId="formOPCM">
						<Col componentClass={ControlLabel} sm={4}><T.span text="outbound_per_cycle_min" /></Col>
						<Col sm={7}><FormControl type="input" name="outbound_per_cycle_min" defaultValue={editData.outbound_per_cycle_min} /></Col>
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

class FifoPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = { rows: [], fifoId: "", fifoName:"", danger: "", formShow: false, 
			editFormShow: false, editText: "Edit", editable: false, editData: []};
		this.handleMemberClick = this.handleMemberClick.bind(this);
		this.handleNewFifoAdd = this.handleNewFifoAdd.bind(this);
		this.handleNewFifoAdded = this.handleNewFifoAdded.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleFifoEdited = this.handleFifoEdited.bind(this);
	}

	componentDidMount() {
		let _this = this;
		$.getJSON("/api/fifos", function(data) {
			_this.setState({rows: data});
		}, function(e) {
			console.log("get FIFO ERR");
		});
	}

	handleMemberClick (e) {
		let fifoId = e.target.getAttribute("data-fifoId");
		this.setState({ fifoId: fifoId, fifoName: e.target.text });
	}

	handleNewFifoAdd(e) {
		this.setState({ formShow: true });
	}

	handleNewFifoAdded(fifo) {
		const _this = this;
		$.getJSON("/api/fifos", function(data) {
			_this.setState({rows: data, formShow: false});
		});
	}

	handleReparseClick() {
		verto.fsAPI("fifo", "reparse");
	}

	handleFifoEdited (fifo){
		var id = fifo.id;
		var rows = this.state.rows;
		let change = [];
		rows.map(function(row){
			if(row.id == id){
				rows[id-1] = fifo;
			}
		});

		this.setState({ editFormShow: false, rows: this.state.rows });
	}

	handleEdit (e) {
		const _this = this;
		let fifoId = e.target.getAttribute("data-id");
		let editData =[] ;
		this.state.rows.map(function(row){
			if( row.id == fifoId ){
				editData = row;
			}
		})
		this.setState({ editFormShow: true, editData:editData}); 
	}

	handleDelete (e){
		var id = e.target.getAttribute("data-id");
		console.log("deleting id", id);
		var _this = this;
		if (!this.state.danger) {
			var c = confirm(T.translate("Confirm to Delete ?"));
			if (!c) return;
		}
		$.ajax({
			type: "DELETE",
			url: "/api/fifos/" + id,
			success: function () {
				console.log("deleted")
				var rows = _this.state.rows.filter(function(row) {
					return row.id != id;
				});
				console.log("delete row", rows);
				_this.setState({rows: rows});
			},
			error: function(msg) {
				console.error("route", msg);
			}
		});
	}

	render() {
		const _this = this;
		/*用来控制fifo memeber是否显示的那一条*/
		let memberStyle = _this.state.fifoId ? { display: "block" } : { display: "none"};
	    let danger = this.state.danger ? "danger" : "";
	    let formClose = () => this.setState({ formShow: false });
	    let editFormClose = () => this.setState({ editFormShow: false });
	    let toggleDanger = () => this.setState({ danger: !this.state.danger });
		let rows = this.state.rows.map( function(row) {
			let  autoRecord = row.auto_record == "1" ? "Yes" : "No" ;
			return <tr key={row.id} >
				<td> {row.id} </td>
				<td><a onClick = {_this.handleMemberClick} style={{cursor: "pointer"}} data-fifoId={row.id}>{ row.name }</a></td>
				<td> {row.description} </td>
				<td> {row.importance} </td>
				<td> {row.outbound_per_cycle} </td>
				<td> {row.outbound_per_cycle_min} </td>
				<td><T.span text={autoRecord}/></td>
				<td> {row.updated_epoch} </td>
				<td><T.a onClick={_this.handleEdit} data-id={row.id} text={_this.state.editText} style={{cursor:"pointer"}}/></td>
				<td><T.a onClick={_this.handleDelete.bind(_this)} data-id={row.id} text="Delete" className={danger} style={{cursor:"pointer"}}/></td>
			</tr>
		});
		let fifoData = { fifoId: this.state.fifoId, fifoName: this.state.fifoName }
		return <div>
			<ButtonToolbar className="pull-right">
				<Button onClick={this.handleNewFifoAdd}>
					<i className="fa fa-plus" aria-hidden="true" ></i>&nbsp;
					<T.span text="New" />
				</Button>
				<Button onClick={this.handleReparseClick}>
					<i className="fa fa-refresh" aria-hidden="true" ></i>&nbsp;
					<T.span text="Reparse" />
				</Button>
			</ButtonToolbar>
			<h1><T.span text="FIFO"/></h1>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th><T.span text="ID"/></th>
					<th><T.span text="Name"/></th>
					<th><T.span text="Description"/></th>
					<th><T.span text="Importance"/></th>
					<th><T.span text="outbound_per_cycle"/></th>
					<th><T.span text="outbound_per_cycle_min"/></th>
					<th><T.span text="Auto Record"/></th>
					<th><T.span text="updated_epoch"/></th>
					<th><T.span text={_this.state.editText}/></th>
					<th><T.span style={{cursor: "pointer" }} text="Delete" className={danger} onClick={toggleDanger} title={T.translate("Click me to toggle fast delete mode")}/></th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>
			<br />
			<div style={memberStyle}>
				<FifoMember fifoData={fifoData} />
			</div>
			<NewFifo show={this.state.formShow} onHide={formClose} handleNewFifoAdded={this.handleNewFifoAdded}/>
			<EditFifo show={this.state.editFormShow} onHide={editFormClose} handleFifoEdited={this.handleFifoEdited} editData={this.state.editData}/>
		</div>
	}
}

export { FifoPage, FifoMemberPage };
