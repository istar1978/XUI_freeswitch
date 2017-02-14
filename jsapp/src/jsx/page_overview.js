/*
 * HTML5 GUI Framework for FreeSWITCH - XUI
 * Copyright (C) 2015-2016, Seven Du <dujinfang@x-y-t.cn>
 *
 * Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is XUI - GUI for FreeSWITCH
 *
 * The Initial Developer of the Original Code is
 * Seven Du <dujinfang@x-y-t.cn>
 * Portions created by the Initial Developer are Copyright (C)
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Seven Du <dujinfang@x-y-t.cn>
 *
 *
 */

'use strict';

import React from 'react';
import T from 'i18n-react';
import verto from './verto/verto';

class OverViewPage extends React.Component {
	// overview is so special because it must wait the websocket connected before it can get any data
	constructor(props) {
		super(props);
		this.state = {msg: "connecting ..."};
		this.handleUpdateStatus = this.handleUpdateStatus.bind(this);
	}

	handleClick (x) {
	}

	componentWillMount () {
		// listen to "update-status" event
		window.addEventListener("update-status", this.handleUpdateStatus);
	}

	componentWillUnmount () {
		window.removeEventListener("update-status", this.handleUpdateStatus);
	}

	componentDidMount () {
		var _this = this;
		verto.fsStatus(function(e) {
			_this.setState({msg: e.message});
		})
	}

	handleUpdateStatus (e) {
		// console.log("eeee", e.detail);
		this.setState({msg: e.detail.message});
	}

	render () {
		return <div><h1><T.span text={{ key: "Status"}} /></h1><pre>{this.state.msg}</pre></div>;
	}
};

export default OverViewPage;
