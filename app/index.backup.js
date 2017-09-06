import React, { Component } from 'react';
import ReactDom from 'react-dom';
import {
	ReactiveBase,
	DataSearch,
	TextField,
	ReactiveList,
} from '@appbaseio/reactivesearch';

import Appbase from 'appbase-js';

class HelloWorld extends Component {

	constructor(props) {
		super(props);

		const HOST_URL = "https://scalr.api.appbase.io"
		const APPNAME = "dhruvdutt-starter"
		const CREDENTIALS = "Wi9TGu5Fz:a2580105-a485-4a49-ac28-0a9d35633d1d"

		// Add data into our ES "app index"
		var appbase = new Appbase({
			url: HOST_URL,
			app: APPNAME,
			credentials: CREDENTIALS
		});

		// appbase.update({
		// 	type: "todos",
		// 	id: "todoid4",
		// 	body: {
		// 		doc: {
		// 			completed: false,
		// 		}
		// 	}
		// }).on('data', function(res) {
		// 	console.log('done', res);
		// }).on('error', function(err) {
		// 	console.log(err);
		// });
	}

	render() {
		return (
			<ReactiveBase
				app="dhruvdutt-starter"
				credentials="ciLp1aV44:3f5a2ae6-000c-4bb1-b637-9a220eba6d3f"
				>
					<div className="row">
						<div className="col s6 col-xs-6">
							<TextField
								dataField="name"
								componentId="new-todo"
								placeholder="Add todo"
								title="new-todo"
								onValueChange={
									function(value) {
										console.log('val:', value);
									}
								}
							/>
						</div>
						<div className="col s6 col-xs-6">
							<DataSearch
								dataField="title"
								componentId="todos-list"
								placeholder="Search TODOs"
								title="todosx"
							/>
						</div>
					</div>
					<div className="row">
						<div className="col s6 col-xs-6">
							<ReactiveList
								dataField="title"
								componentId="todos"
								placeholder="Todos list"
								title="todos"
								showResultStats={true}
								onData={
							    function(res) {
										console.log('onData:', res);
							      return(
							        <div>
							          { res }
							        </div>
							      )
							    }
								}
							/>
						</div>
					</div>
				</ReactiveBase>
			);
		}
	}

	ReactDom.render(<HelloWorld />, document.getElementById('app'));
