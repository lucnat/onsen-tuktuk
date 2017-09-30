import { Meteor } from 'meteor/meteor';
import React from 'react';
import {render} from 'react-dom';

import ons from 'onsenui';
import * as Ons from 'react-onsenui';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';

import Shake from 'shake.js';

ONS = ons;

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isOpen: true,
			host: 'https://onsenui.github.io/react-onsenui-kitchensink/',
			platform: 'ios',
		}


		var myShakeEvent = new Shake();
		myShakeEvent.start();

		window.addEventListener('shake', onShake.bind(this), false);

		function onShake () {

		    this.setState({isOpen: true});
		}


	}

	handleCancel() {
		this.setState({isOpen: false});
	}

	handleRefresh() {

	}

	handleEditHost() {
		var that = this;
		ons.notification.prompt('Host').then(function(result) {
			that.setState({host: result});
		})
	}

	changePlatform() {
		if(this.state.platform === 'ios'){
			this.setState({platform: 'android'});
		} else {
			this.setState({platform: 'ios'});
		}
		this.setState({isOpen: false})
	}

	render() {
		var src = this.state.host + "?ionicplatform=" + this.state.platform;
		return (
			<div>

				<iframe id="android-frame" src={src} style={{height: window.innerHeight, width: '100%', border: 0}}></iframe>

				<Ons.ActionSheet 
					isOpen={this.state.isOpen} 
					animation='default'
					onCancel={this.handleCancel.bind(this)}
					isCancelable={true}
					title={'Description'}
				>
					<Ons.ActionSheetButton onClick={this.handleRefresh.bind(this)}>Refresh</Ons.ActionSheetButton>
					<Ons.ActionSheetButton onClick={this.changePlatform.bind(this)}>Change platform</Ons.ActionSheetButton>
					<Ons.ActionSheetButton onClick={this.handleEditHost.bind(this)}>Set new host</Ons.ActionSheetButton>
					<Ons.ActionSheetButton onClick={this.handleCancel.bind(this)} icon={'md-close'}>Cancel</Ons.ActionSheetButton>
				</Ons.ActionSheet>

			</div>
		);
	}
}

Meteor.startup(() => {
	render(<App />, document.getElementById('render-target'));

});

// add this to your meteor client
Meteor.startup(() => { 
	var url = new URL(document.location.href);
	var platform = url.searchParams.get('platform');
	ons.platform.select(platform);
	function KeyPress(e) {
	      var evtobj = window.event? event : e
	      if (evtobj.keyCode == 84 && evtobj.ctrlKey) 
	      	window.open('http://lucnaterop.github.io/onsen-tuktuk');
	}
	document.onkeydown = KeyPress
});
			
